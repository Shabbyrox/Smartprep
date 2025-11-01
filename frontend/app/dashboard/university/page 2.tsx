"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { GraduationCap, FileText, Plus, Download, Eye, BarChart3, Award, BookOpen } from "lucide-react"
import { UniversityNavbar } from "@/components/university-navbar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const studentsData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@university.edu",
    batch: "2024",
    department: "Computer Science",
    resumeScore: 88,
    quizzesTaken: 15,
    interviewScore: 82,
    placementStatus: "Placed",
    company: "Google",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@university.edu",
    batch: "2024",
    department: "Computer Science",
    resumeScore: 75,
    quizzesTaken: 12,
    interviewScore: 78,
    placementStatus: "In Process",
    company: "-",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@university.edu",
    batch: "2024",
    department: "Information Technology",
    resumeScore: 92,
    quizzesTaken: 18,
    interviewScore: 85,
    placementStatus: "Placed",
    company: "Microsoft",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@university.edu",
    batch: "2024",
    department: "Computer Science",
    resumeScore: 70,
    quizzesTaken: 8,
    interviewScore: 65,
    placementStatus: "Preparing",
    company: "-",
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva@university.edu",
    batch: "2024",
    department: "Information Technology",
    resumeScore: 85,
    quizzesTaken: 14,
    interviewScore: 80,
    placementStatus: "In Process",
    company: "-",
  },
]

const batchPerformance = [
  { batch: "2020", placed: 85, total: 100 },
  { batch: "2021", placed: 92, total: 110 },
  { batch: "2022", placed: 88, total: 105 },
  { batch: "2023", placed: 95, total: 120 },
  { batch: "2024", placed: 45, total: 115 },
]

const departmentStats = [
  { department: "Computer Science", students: 65, placed: 28, avgScore: 82 },
  { department: "Information Technology", students: 50, placed: 17, avgScore: 79 },
  { department: "Electronics", students: 40, placed: 12, avgScore: 75 },
  { department: "Mechanical", students: 35, placed: 8, avgScore: 71 },
]

const skillsRadarData = [
  { skill: "Technical", A: 85, B: 78, fullMark: 100 },
  { skill: "Communication", A: 75, B: 82, fullMark: 100 },
  { skill: "Problem Solving", A: 90, B: 75, fullMark: 100 },
  { skill: "Leadership", A: 70, B: 85, fullMark: 100 },
  { skill: "Teamwork", A: 80, B: 88, fullMark: 100 },
  { skill: "Adaptability", A: 85, B: 80, fullMark: 100 },
]

export default function UniversityDashboard() {
  const [selectedBatch, setSelectedBatch] = useState("2024")
  const [isAddingStudent, setIsAddingStudent] = useState(false)

  const generateReport = () => {
    // Mock report generation
    alert("Placement report generated successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UniversityNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">University Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and placement performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">190</div>
                  <p className="text-xs text-muted-foreground">Across all batches</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">Current batch</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Resume Score</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82</div>
                  <p className="text-xs text-muted-foreground">Out of 100</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Preparations</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67</div>
                  <p className="text-xs text-muted-foreground">Students preparing</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Batch-wise Placement Trends</CardTitle>
                  <CardDescription>Historical placement performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={batchPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="batch" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="placed" fill="#8b5cf6" />
                      <Bar dataKey="total" fill="#e5e7eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Average scores by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Track individual student progress and performance</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">Batch 2024</SelectItem>
                      <SelectItem value="2023">Batch 2023</SelectItem>
                      <SelectItem value="2022">Batch 2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>Register a new student to the platform</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input placeholder="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input type="email" placeholder="john@university.edu" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="batch">Batch</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cs">Computer Science</SelectItem>
                                <SelectItem value="it">Information Technology</SelectItem>
                                <SelectItem value="ece">Electronics</SelectItem>
                                <SelectItem value="mech">Mechanical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddingStudent(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-purple-600 hover:bg-purple-700">Add Student</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Resume Score</TableHead>
                      <TableHead>Quizzes</TableHead>
                      <TableHead>Interview Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <Badge variant={student.resumeScore >= 80 ? "default" : "secondary"}>
                            {student.resumeScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>{student.quizzesTaken}</TableCell>
                        <TableCell>
                          <Badge variant={student.interviewScore >= 80 ? "default" : "secondary"}>
                            {student.interviewScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.placementStatus === "Placed"
                                ? "default"
                                : student.placementStatus === "In Process"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {student.placementStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.company}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment Comparison</CardTitle>
                  <CardDescription>Top vs Average performers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={skillsRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Top Performers" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Radar name="Average" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Readiness Metrics</CardTitle>
                  <CardDescription>Student preparation levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resume Ready</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Interview Ready</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Skills</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                        <span className="text-sm">82%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Soft Skills</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "71%" }}></div>
                        </div>
                        <span className="text-sm">71%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Performance metrics across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Placed</TableHead>
                      <TableHead>Placement Rate</TableHead>
                      <TableHead>Avg Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentStats.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell>{dept.students}</TableCell>
                        <TableCell>{dept.placed}</TableCell>
                        <TableCell>
                          <Badge
                            variant={Math.round((dept.placed / dept.students) * 100) >= 50 ? "default" : "secondary"}
                          >
                            {Math.round((dept.placed / dept.students) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dept.avgScore >= 80 ? "default" : "secondary"}>{dept.avgScore}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create comprehensive placement and performance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Placement Report</h3>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Select Batch</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose batch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">Batch 2024</SelectItem>
                          <SelectItem value="2023">Batch 2023</SelectItem>
                          <SelectItem value="2022">Batch 2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="ece">Electronics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateReport} className="w-full bg-purple-600 hover:bg-purple-700">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Placement Report
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Performance Analytics</h3>
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skills">Skills Assessment</SelectItem>
                          <SelectItem value="progress">Progress Tracking</SelectItem>
                          <SelectItem value="readiness">Placement Readiness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period">Time Period</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateReport} className="w-full bg-blue-600 hover:bg-blue-700">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Analytics Report
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Batch 2024 Placement Report</p>
                        <p className="text-sm text-gray-600">Generated on Dec 15, 2024</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Skills Assessment - Q4 2024</p>
                        <p className="text-sm text-gray-600">Generated on Dec 10, 2024</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Department Performance Analysis</p>
                        <p className="text-sm text-gray-600">Generated on Dec 5, 2024</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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
