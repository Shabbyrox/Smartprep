"use client"

import React, { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "../../libsupabase/supabaseClient"
import { useUser } from "@clerk/nextjs"
import { db, auth } from "../../lib/firebase" // Import both db and auth
import { doc, getDoc, setDoc } from "firebase/firestore"
import { signInWithCustomToken } from "firebase/auth" // <-- Import Firebase auth function

type Question = {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_ans: string
}

const JOB_ROLES = [
  { id: "sde", name: "Software Engineer" },
  { id: "da", name: "Data Analyst" },
  { id: "fd", name: "Frontend Developer" },
  { id: "bd", name: "Backend Developer" }
]
const LEVEL_COUNT = 10

// Helper function to get default progress
const getDefaultProgress = () => {
  const progress: Record<string, number> = {}
  JOB_ROLES.forEach((r) => {
    progress[r.id] = 1 // Everyone starts with level 1 unlocked
  })
  return progress
}

export default function QuizPage() {
  const [role, setRole] = useState<string>(JOB_ROLES[0].id)
  const [level, setLevel] = useState<number>(1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unlockedLevels, setUnlockedLevels] = useState<Record<string, number>>(getDefaultProgress())
  
  const [isSaving, setIsSaving] = useState(false)
  const { user, isLoaded: isClerkLoaded } = useUser() // Get Clerk user
  const [isFirebaseReady, setIsFirebaseReady] = useState(false) // <-- New state

  // Timer state
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState<number>(60 * 10)
  const timerRef = useRef<number | null>(null)

  // --- NEW: Step 1 - Sign in to Firebase using Clerk ---
  useEffect(() => {
    if (!isClerkLoaded || !user) return; // Wait for Clerk user to be loaded

    const signInToFirebase = async () => {
      try {
        // Fetch the custom token from our new API route
        const res = await fetch("/api/firebase-token");
        if (!res.ok) {
          throw new Error("Failed to fetch Firebase token");
        }
        
        const { token } = await res.json();
        
        if (!token) {
          throw new Error("Received empty token");
        }

        // Sign in to Firebase Auth with the custom token
        await signInWithCustomToken(auth, token);
        
        console.log("Firebase Auth successful!");
        setIsFirebaseReady(true); // <-- THIS IS KEY
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        setError("Could not authenticate with Firebase.");
      }
    };

    // Only sign in if not already signed in
    if (!auth.currentUser) {
      signInToFirebase();
    } else {
      setIsFirebaseReady(true); // Already signed in
    }
    
  }, [isClerkLoaded, user]); // Run when Clerk user is ready


  // --- MODIFIED: Step 2 - Load progress from FIREBASE ---
  useEffect(() => {
    // Wait for BOTH Clerk to load AND Firebase to sign in
    if (!isFirebaseReady || !user) return; 

    async function loadProgress() {
      console.log("Loading progress for user:", user.id);
      const userDocRef = doc(db, "users", user.id);
      
      try {
        // This call will now have permission
        const docSnap = await getDoc(userDocRef); 
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.unlockedLevels) {
            console.log("Found progress:", data.unlockedLevels);
            setUnlockedLevels(prev => ({ ...getDefaultProgress(), ...data.unlockedLevels }))
          } else {
            console.log("No progress found, setting default.")
            setUnlockedLevels(getDefaultProgress())
          }
        } else {
          // This might happen if sync-user API hasn't run yet
          console.log("No user doc, setting default progress.")
          setUnlockedLevels(getDefaultProgress())
        }
      } catch (err) {
        console.error("Error loading user progress:", err);
        setError(err instanceof Error ? err.message : "Failed to load progress");
      }
    }

    loadProgress();
  }, [user, isFirebaseReady]); // <-- Run when Firebase is ready


  // --- QUESTION FETCHING: Load questions from Supabase (No change) ---
  useEffect(() => {
    async function loadQuestions() {
      setQuestions([])
      setAnswers({})
      setCurrent(0)
      setSubmitted(false)
      setScore(null)
      setLoading(true)
      setError(null)
      setTimerRunning(false)
      if (timerRef.current) window.clearInterval(timerRef.current)

      try {
        const tableName = `${role}${level}`
        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .limit(10)

        if (fetchError) throw new Error(fetchError.message)
        if (data && data.length > 0) {
          setQuestions(data as Question[])
        } else {
          setError(`No questions found for ${role.toUpperCase()} Level ${level}`)
        }
      } catch (err) {
        console.error("Error loading questions:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [role, level])

  const totalMarks = questions.length
  
  const onChoose = (qId: string, option: string) => {
    if (!submitted) setAnswers((s) => ({ ...s, [qId]: option }))
  }

  // --- onSubmit to save to FIREBASE (No change in this function's logic) ---
  // This will now work because the user is signed in
  const onSubmit = async () => {
    if (submitted || isSaving) return
    setIsSaving(true)

    let correct = 0
    for (const q of questions) {
      const ans = answers[q.id]
      if (ans === q.correct_ans) correct++
    }

    const pct = totalMarks ? Math.round((correct / totalMarks) * 100) : 0
    setScore(pct)
    setSubmitted(true)
    setTimerRunning(false)
    if (timerRef.current) window.clearInterval(timerRef.current)

    let newUnlockedLevelsMap = { ...unlockedLevels }

    if (pct > 40 && level < LEVEL_COUNT) {
      const currentUnlocked = unlockedLevels[role] || 1
      const newUnlockedLevel = Math.max(currentUnlocked, level + 1)
      
      if (newUnlockedLevel > currentUnlocked) {
        newUnlockedLevelsMap = {
          ...unlockedLevels,
          [role]: newUnlockedLevel
        }
        setUnlockedLevels(newUnlockedLevelsMap)
      }
    }
    
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.id)
        const quizAttempt = {
          role,
          level,
          score: pct,
          passed: pct > 40,
          timestamp: new Date().toISOString()
        }
        
        await setDoc(userDocRef, { 
          unlockedLevels: newUnlockedLevelsMap,
          lastQuizAttempt: quizAttempt
        }, { merge: true }) // merge: true is important!
        
        console.log("Progress saved successfully!")

      } catch (err) {
        console.error("Failed to save progress:", err)
      }
    }
    
    setIsSaving(false)
  }

  // --- TIMER LOGIC (No change) ---
  useEffect(() => {
    if (!timerEnabled || !timerRunning) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    
    const id = window.setInterval(() => {
        setTimerSeconds((s) => {
            if (s <= 1) {
                if (!submitted) onSubmit()
                if (timerRef.current) window.clearInterval(timerRef.current)
                return 0
            }
            return s - 1
        })
    }, 1000)
    timerRef.current = id

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [timerEnabled, timerRunning, submitted, questions])

  const formatSecs = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  const question = questions[current]
  const getRoleName = (id: string) => JOB_ROLES.find(r => r.id === id)?.name || id
  const canAccessLevel = (roleId: string, lvl: number) => lvl <= (unlockedLevels[roleId] || 1)

  const getOptions = (q: Question) => [
    { key: 'option_a', value: q.option_a },
    { key: 'option_b', value: q.option_b },
    { key: 'option_c', value: q.option_c },
    { key: 'option_d', value: q.option_d }
  ]

  // --- MODIFIED: Loading State ---
  // Show a loading screen until both Clerk and Firebase are ready
  if (!isClerkLoaded || !isFirebaseReady) {
    return (
      <div className="container mx-auto p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-blue-600">
          {!isClerkLoaded ? "Loading user..." : "Authenticating with datastore..."}
        </div>
      </div>
    )
  }
  
  // --- All your JSX from here down is the same ---
  return (
    <div className="container mx-auto p-4 sm:p-6 min-h-screen">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Role</CardTitle>
              <CardDescription>Choose a job role to attempt quizzes for.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {JOB_ROLES.map((r) => (
                  <Button
                    key={r.id}
                    variant={r.id === role ? "default" : "ghost"}
                    onClick={() => setRole(r.id)}
                    className="w-full justify-start shadow-sm"
                  >{r.name}</Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <div className="w-full text-sm text-muted-foreground">
                Highest unlocked: Level {unlockedLevels[role] || 1}
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Levels</CardTitle>
              <CardDescription>Levels 1 — {LEVEL_COUNT}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {Array.from({ length: LEVEL_COUNT }).map((_, i) => {
                  const lv = i + 1
                  const locked = !canAccessLevel(role, lv)
                  return (
                    <Button
                      key={lv}
                      variant={lv === level ? "default" : locked ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => { if (!locked) setLevel(lv) }}
                      disabled={locked}
                      className="w-full"
                    >{locked ? `🔒 ${lv}` : `Lvl ${lv}`}</Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Quiz Area */}
        <main className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">{getRoleName(role)} — Level {level} Quiz</CardTitle>
                  <CardDescription>
                    {questions.length} questions — pass with <span className="font-medium text-gray-700">&gt; 40%</span> to unlock next level.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link href="/dashboard">← Back to Dashboard</Link>
                  </Button>
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">Timer:</label>
                    <Button
                      variant={timerEnabled ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (submitted) return
                        setTimerEnabled((v) => {
                          const next = !v
                          if (next) setTimerSeconds(60 * 10)
                          return next
                        })
                      }}
                      className="shadow-sm"
                      disabled={loading || questions.length === 0}
                    >
                      {timerEnabled ? "Timer: ON" : "Timer: OFF"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {timerEnabled && (
                <div className="mb-4 p-3 rounded-lg bg-gray-50 border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className={`text-base font-medium ${timerSeconds < 60 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    Time left: <span className="font-mono text-lg font-bold">{formatSecs(timerSeconds)}</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {!timerRunning && !submitted ? (
                      <Button size="sm" onClick={() => setTimerRunning(true)} className="flex-1">Start Timer</Button>
                    ) : (
                      <Button size="sm" onClick={() => setTimerRunning(false)} disabled={submitted} variant="outline" className="flex-1">Pause</Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => { 
                        setTimerRunning(false); 
                        setTimerSeconds(60 * 10);
                        setSubmitted(false);
                      }}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {loading && <div className="text-center py-8 text-lg text-blue-600">Loading questions...</div>}
              
              {error && (
                <div className="p-4 text-center bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium">{error}</p>
                </div>
              )}

              {!loading && !error && questions.length === 0 && (
                <div>No questions found for this level/role...</div>
              )}

              {question && !loading && (
                <div>
                  <div className="mb-6 border-b pb-4">
                    <div className="text-sm text-blue-600 font-semibold mb-1">
                      Question {current + 1} / {questions.length}
                    </div>
                    <h3 className="text-xl font-bold mt-1 text-gray-800">{question.question}</h3>
                  </div>

                  <div className="space-y-3">
                    {getOptions(question).map((opt, idx) => {
                      const chosen = answers[question.id]
                      const isSelected = chosen === opt.key
                      const isCorrect = question.correct_ans === opt.key
                      
                      let className = "bg-background hover:bg-gray-50 border-gray-300"
                      
                      if (submitted) {
                        if (isCorrect) className = "border-2 border-green-500 bg-green-50 shadow-md"
                        else if (isSelected) className = "border-2 border-red-500 bg-red-50 shadow-md"
                      } else {
                        if (isSelected) className = "bg-blue-50 border-blue-600 border-2 shadow-lg"
                        else className = "hover:bg-gray-100 border-gray-200"
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => onChoose(question.id, opt.key)}
                          className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ease-in-out ${className}`}
                          disabled={submitted}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-700">{String.fromCharCode(65 + idx)}. {opt.value}</div>
                            {submitted && isCorrect && <div className="text-lg text-green-600 font-bold">✓ Correct</div>}
                            {submitted && !isCorrect && isSelected && <div className="text-lg text-red-600 font-bold">✕ Wrong</div>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4 border-t mt-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                  >
                    ← Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                    disabled={current >= questions.length - 1 || questions.length === 0}
                  >
                    Next →
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {!submitted ? (
                    <Button 
                      onClick={onSubmit} 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      disabled={isSaving || questions.length === 0 || timerSeconds === 0 || Object.keys(answers).length !== questions.length}
                    >
                      {isSaving ? "Saving..." : "Submit Quiz"} 
                    </Button>
                  ) : (
                    <div className="text-lg p-2 rounded-lg font-bold bg-white shadow-xl border">
                      Score: <span className={score !== null && score > 40 ? "text-green-600" : "text-red-600"}>{score}%</span>{" "}
                      {score !== null && (score > 40 ? (
                        <span className="text-green-600 font-medium">(Passed)</span>
                      ) : (
                        <span className="text-red-600 font-medium">(Failed)</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}