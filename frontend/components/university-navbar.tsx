"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, User, Settings, LogOut, Bell, GraduationCap } from "lucide-react"

export function UniversityNavbar() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard/university" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900">SmartPrep.AI</span>
          <GraduationCap className="h-5 w-5 text-blue-600" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard/university" className="text-gray-600 hover:text-purple-600 transition-colors">
            Overview
          </Link>
          <Link href="/dashboard/university#students" className="text-gray-600 hover:text-purple-600 transition-colors">
            Students
          </Link>
          <Link
            href="/dashboard/university#performance"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Performance
          </Link>
          <Link href="/dashboard/university#reports" className="text-gray-600 hover:text-purple-600 transition-colors">
            Reports
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="University" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">University Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@university.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
