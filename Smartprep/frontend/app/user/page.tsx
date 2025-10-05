"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, MessageSquare, Brain, CheckCircle, AlertCircle, Target } from "lucide-react"
import { UserNavbar } from "@/components/user-navbar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Link from "next/link";

const skillsData = [
  { skill: "JavaScript", score: 85 },
  { skill: "React", score: 78 },
  { skill: "Python", score: 92 },
  { skill: "SQL", score: 70 },
  { skill: "Node.js", score: 65 },
]

const progressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 85 },
  { month: "May", score: 88 },
]

const jobRecommendations = [
  {
    title: "Frontend Developer",
    company: "Google",
    match: 92,
    location: "Bangalore",
    salary: "₹15-25 LPA",
  },
  {
    title: "Full Stack Developer",
    company: "Microsoft",
    match: 88,
    location: "Hyderabad",
    salary: "₹18-28 LPA",
  },
  {
    title: "Software Engineer",
    company: "Amazon",
    match: 85,
    location: "Chennai",
    salary: "₹20-30 LPA",
  },
]

const quizzes = [
  {
    company: "Google",
    questions: 25,
    duration: "45 min",
    difficulty: "Hard",
    completed: false,
  },
  {
    company: "Microsoft",
    questions: 30,
    duration: "60 min",
    difficulty: "Medium",
    completed: true,
    score: 85,
  },
  {
    company: "Amazon",
    questions: 20,
    duration: "40 min",
    difficulty: "Hard",
    completed: false,
  },
]

export default function UserDashboard() {
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState("")

  const handleResumeUpload = () => {
    setResumeUploaded(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Track your progress and continue your job preparation journey hi </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interview Score</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+12% improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">8 new this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                  <CardDescription>Your current skill levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>Your improvement journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>Upload your resume for AI-powered analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                    <Button onClick={handleResumeUpload} className="bg-purple-600 hover:bg-purple-700">
                      {resumeUploaded ? "Resume Uploaded" : "Choose File"}
                    </Button>
                  </div>
                  {resumeUploaded && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">resume.pdf uploaded successfully</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                  <CardDescription>Personalized suggestions to improve your resume</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeUploaded ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <Badge className="bg-green-100 text-green-800">85/100</Badge>
                      </div>
                      <Progress value={85} className="w-full" />

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">Strong technical skills section</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span className="text-sm">Add more quantified achievements</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          <span className="text-sm">Include relevant keywords: "React", "Node.js"</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Upload your resume to get AI-powered feedback</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Link href="/resumeEdit">
              <Button>Click to create new resume</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>AI-curated job opportunities based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobRecommendations.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{job.location}</span>
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-2">{job.match}% Match</Badge>
                          <div>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company-Specific Quizzes</CardTitle>
                <CardDescription>Practice with real interview questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{quiz.company} Quiz</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{quiz.questions} questions</span>
                            <span>{quiz.duration}</span>
                            <Badge variant={quiz.difficulty === "Hard" ? "destructive" : "secondary"}>
                              {quiz.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {quiz.completed ? (
                            <div>
                              <Badge className="bg-green-100 text-green-800 mb-2">Score: {quiz.score}%</Badge>
                              <div>
                                <Button size="sm" variant="outline">
                                  Retake
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Start Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mock Interview</CardTitle>
                  <CardDescription>Practice with AI-powered mock interviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Select Company</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="microsoft">Microsoft</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="meta">Meta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="data">Data Scientist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Mock Interview</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Interview Performance</CardTitle>
                  <CardDescription>Your latest mock interview results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Knowledge</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-20" />
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Problem Solving</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Improvements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Practice explaining complex concepts simply</li>
                      <li>• Work on system design fundamentals</li>
                      <li>• Improve time management in coding problems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
