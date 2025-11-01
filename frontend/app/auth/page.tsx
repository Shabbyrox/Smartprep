"use client";

import type React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  User,
  Shield,
  GraduationCap,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function AuthPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">
              SmartPrep.AI
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Link
                href="/auth/sign-in"
                className="flex items-center justify-center space-x-2"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full" size="lg">
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
              </Link>
            </Button>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Choose your account type:
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Job Seeker</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Resume optimization & interview prep
                  </span>
                </div>
                {/* <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">
                    University/Institute
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Student career services
                  </span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Admin</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Platform management
                  </span>
                </div> */}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <Link href="/" className="hover:text-purple-600">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
