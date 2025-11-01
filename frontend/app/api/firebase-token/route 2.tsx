import { auth } from "@clerk/nextjs/server";
import { adminAuth } from "@/lib/firebaseAdmin"; // Assumes you have this file from my previous answer
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get the logged-in Clerk user on the server
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      console.error("Unauthorized access: No userId found.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Use the Firebase Admin SDK to create a custom token for that user
    const customToken = await adminAuth.createCustomToken(userId);

    // 3. Send the token back to the client
    return NextResponse.json({ token: customToken });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating Firebase custom token:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: (error as any).code, // Firebase-specific error code if available
      });
    } else {
      console.error("Unknown error occurred:", error);
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
