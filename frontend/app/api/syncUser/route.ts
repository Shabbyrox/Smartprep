import { currentUser } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    console.log("🔄 SyncUser API called");
    
    // Get the current authenticated user from Clerk
    const user = await currentUser();
    
    if (!user) {
      console.log("❌ No user found - unauthorized");
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("✅ User found:", {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    });

    // Sync user data to Firebase
    const userData = {
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("users").doc(user.id).set(userData, { merge: true });

    console.log("✅ User synced to Firebase successfully:", user.id);
    
    return new Response(JSON.stringify({ 
      success: true, 
      userId: user.id,
      message: "User synced successfully" 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("❌ Error syncing user:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}