"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SyncPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const redirectPath = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    console.log("🔄 Sync page loaded, user:", { isSignedIn, userId: user?.id });

    if (isSignedIn && user && !isSyncing) {
      console.log("🔄 Starting user sync for:", user.id);
      setIsSyncing(true);
      setSyncError(null);

      const apiUrl = `/api/syncUser`;
      console.log("🔄 Making API call to:", apiUrl);

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          console.log("🔄 Response received:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          });

          const responseData = await response
            .json()
            .catch(() => ({ success: false }));

          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}: ${
                responseData.error || "Failed to sync user"
              }`
            );
          }

          console.log("✅ User sync successful:", responseData);
          // Small delay to show the success message
          setTimeout(() => {
            router.push(redirectPath);
          }, 1000);
        })
        .catch((error) => {
          console.error("❌ Error syncing user:", error);
          setSyncError(error.message);
          // Still redirect even if sync fails after a delay
          setTimeout(() => {
            router.push(redirectPath);
          }, 3000);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    } else if (!isSignedIn) {
      // If not signed in, redirect to sign in
      router.push("/auth/sign-in");
    }
  }, [isSignedIn, user, router, redirectPath, isSyncing]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSyncing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              ) : syncError ? (
                <div className="text-red-500 text-2xl">❌</div>
              ) : (
                <div className="text-green-500 text-2xl">✅</div>
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {isSyncing
                ? "Setting up your account..."
                : syncError
                ? "Sync Failed"
                : "Account Ready!"}
            </h1>

            <p className="text-gray-600 text-sm">
              {isSyncing
                ? "Please wait while we sync your account data."
                : syncError
                ? `Error: ${syncError}`
                : "Your account has been synchronized successfully."}
            </p>
          </div>

          {syncError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              <p>Don't worry, you'll still be redirected to your dashboard.</p>
            </div>
          )}

          {!isSyncing && !syncError && (
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          )}
        </div>
      </div>
    </div>
  );
}
