// app/resumeScan/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you have these components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Upload, Loader2, BarChart3, TrendingUp, Briefcase } from "lucide-react";

// Define the shape of the result data from the backend
interface ScanResult {
  bestFitRole: string;
  recommendedSkills: string[];
  otherPossibleRoles: string[];
}

export default function ResumeScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Authentication check (similar to your /dashboard/page.tsx)
  if (isLoaded && !isSignedIn) {
    router.push("/auth");
    return null;
  }
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid PDF file for the scan.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a resume file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    // 'resume' must match the expected field name in the Route Handler (step 2)
    formData.append("resume", file);

    try {
      // 1. Submit file to the Next.js Route Handler
      const response = await fetch("/api/scanResume", {
        method: "POST",
        body: formData,
      });

      // 2. Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred during scanning." }));
        throw new Error(errorData.message || "Failed to analyze resume.");
      }

      // 3. Process the successful result
      const data: ScanResult = await response.json();
      setResult(data);

    } catch (err: any) {
      console.error("Resume Scan Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
            <Zap className="h-8 w-8 text-purple-600" />
            <span>AI Resume Scan</span>
          </h1>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Scan Input Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Upload Resume (PDF)</CardTitle>
            <CardDescription>
              Get an AI-powered analysis of your resume, including your **ideal role prediction**, **recommended skills**, and **alternative career options**.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Input */}
              <div className="flex items-center space-x-4">
                <label className="flex-grow flex items-center px-4 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">
                    {file ? file.name : "Choose PDF file"}
                  </span>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
                <Button type="submit" disabled={isLoading || !file} className="min-w-[150px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Start Scan"
                  )}
                </Button>
              </div>
              {/* Error Message */}
              {error && (
                <p className="text-sm font-medium text-red-600 p-2 bg-red-50 border border-red-200 rounded">
                  Error: {error}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Display (Same as before) */}
        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Scan Results
            </h2>

            {/* Best Fit Role */}
            <Card className="bg-white border-l-4 border-purple-500 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-700">Best-Fit Role Prediction</h3>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-purple-600">
                  {result.bestFitRole}
                </p>
              </CardContent>
            </Card>

            {/* Recommended Skills */}
            <Card className="bg-white border-l-4 border-emerald-500 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-700">Recommended Skills</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.recommendedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-full"
                      >
                        {skill}
                      </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Other Possible Roles */}
            <Card className="bg-white border-l-4 border-sky-500 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-sky-600" />
                  <h3 className="text-lg font-semibold text-gray-700">Alternative Career Paths</h3>
                </div>
                <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700">
                  {result.otherPossibleRoles.map((role, index) => (
                    <li key={index} className="text-base">
                      {role}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="pt-4 text-center">
              <Button asChild>
                <Link href="/quiz">Practice Quiz for {result.bestFitRole}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}