import { currentUser } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    console.log("🔍 Debug API called - checking users in database");
    
    // Get current user for auth check
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get all users from Firebase (limit to 10 for testing)
    const usersSnapshot = await adminDb.collection("users").limit(10).get();
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    console.log("✅ Found users in database:", users.length);
    
    return new Response(JSON.stringify({ 
      success: true,
      totalUsers: users.length,
      users: users,
      currentUserId: user.id,
      currentUserExists: users.some(u => u.id === user.id)
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("❌ Error checking users:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
