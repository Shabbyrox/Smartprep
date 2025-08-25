"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, User, Settings, LogOut, Bell } from "lucide-react";

export function UserNavbar() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/user" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900">SmartPrep.AI</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/user"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/resumeEdit"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/user#jobs"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/user#quizzes"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Quizzes
          </Link>
          <Link
            href="/user#interviews"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Interviews
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <UserButton afterSignOutUrl="/auth" />
        </div>
      </div>
    </header>
  );
}
