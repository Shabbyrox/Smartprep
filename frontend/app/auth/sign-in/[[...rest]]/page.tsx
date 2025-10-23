"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your SmartPrep.AI account</p>
        </div>
        <SignIn 
          afterSignInUrl="/auth/sync?redirect=/dashboard"
          redirectUrl="/auth/sync?redirect=/dashboard"
        />
      </div>
    </div>
  );
}
