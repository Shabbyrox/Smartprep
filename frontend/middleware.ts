import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/user(.*)',
  '/resumeEdit(.*)',
  '/api/firebase-token(.*)', // <-- ADD THIS LINE
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // If it's a protected route, run auth.protect()
    // This will either grant access or throw an error (e.g., redirect to sign-in)
    await auth.protect()
  }
  // For all other routes (public or unmatched), do nothing.
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}