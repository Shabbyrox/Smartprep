"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Brain, FileText, Plus, Edit, Trash2, Eye, Activity } from "lucide-react"
import { AdminNavbar } from "@/components/admin-navbar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Job Seeker",
    joinDate: "2024-01-15",
    resumeScore: 85,
    quizzesTaken: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Job Seeker",
    joinDate: "2024-01-20",
    resumeScore: 92,
    quizzesTaken: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Job Seeker",
    joinDate: "2024-02-01",
    resumeScore: 78,
    quizzesTaken: 15,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Job Seeker",
    joinDate: "2024-02-10",
    resumeScore: 88,
    quizzesTaken: 6,
    status: "Active",
  },
]

const quizData = [
  {
    id: 1,
    company: "Google",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    difficulty: "Medium",
  },
  {
    id: 2,
    company: "Microsoft",
    question: "Which design pattern is used in React?",
    options: ["Singleton", "Observer", "Component", "Factory"],
    correct: 2,
    difficulty: "Easy",
  },
  {
    id: 3,
    company: "Amazon",
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2,
    difficulty: "Hard",
  },
]

const analyticsData = [
  { month: "Jan", users: 120, resumes: 95, quizzes: 340 },
  { month: "Feb", users: 180, resumes: 142, quizzes: 520 },
  { month: "Mar", users: 240, resumes: 198, quizzes: 680 },
  { month: "Apr", users: 320, resumes: 256, quizzes: 890 },
  { month: "May", users: 420, resumes: 334, quizzes: 1200 },
]

const pieData = [
  { name: "Active Users", value: 75, color: "#8b5cf6" },
  { name: "Inactive Users", value: 25, color: "#e5e7eb" },
]

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isAddingQuiz, setIsAddingQuiz] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, quizzes, and monitor platform analytics</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resumes Analyzed</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,421</div>
                  <p className="text-xs text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Usage</CardTitle>
                  <CardDescription>Monthly activity trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="resumes" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="quizzes" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Status</CardTitle>
                  <CardDescription>Active vs Inactive users</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Resume Score</TableHead>
                      <TableHead>Quizzes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Badge variant={user.resumeScore >= 80 ? "default" : "secondary"}>{user.resumeScore}%</Badge>
                        </TableCell>
                        <TableCell>{user.quizzesTaken}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Quiz Management</CardTitle>
                  <CardDescription>Add, edit, and manage quiz questions</CardDescription>
                </div>
                <Dialog open={isAddingQuiz} onOpenChange={setIsAddingQuiz}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Quiz Question</DialogTitle>
                      <DialogDescription>Create a new question for company-specific quizzes</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google</SelectItem>
                            <SelectItem value="microsoft">Microsoft</SelectItem>
                            <SelectItem value="amazon">Amazon</SelectItem>
                            <SelectItem value="meta">Meta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea placeholder="Enter your question here..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="option1">Option 1</Label>
                          <Input placeholder="First option" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="option2">Option 2</Label>
                          <Input placeholder="Second option" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="option3">Option 3</Label>
                          <Input placeholder="Third option" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="option4">Option 4</Label>
                          <Input placeholder="Fourth option" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="correct">Correct Answer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Option 1</SelectItem>
                            <SelectItem value="1">Option 2</SelectItem>
                            <SelectItem value="2">Option 3</SelectItem>
                            <SelectItem value="3">Option 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddingQuiz(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">Add Question</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizData.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>
                          <Badge variant="outline">{quiz.company}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{quiz.question}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              quiz.difficulty === "Hard"
                                ? "destructive"
                                : quiz.difficulty === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {quiz.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                  <CardDescription>User registration and activity trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most popular platform features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resume Analysis</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mock Interviews</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                        <span className="text-sm">72%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Company Quizzes</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                        <span className="text-sm">68%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Job Recommendations</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "59%" }}></div>
                        </div>
                        <span className="text-sm">59%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Platform health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <p className="text-sm text-gray-600">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                    <p className="text-sm text-gray-600">User Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
