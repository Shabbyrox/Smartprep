"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, FileText, User, Briefcase, GraduationCap, Award, Code } from "lucide-react"

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    year: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
  }>
  skills: string[]
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [{ id: "1", company: "", position: "", duration: "", description: "" }],
    education: [{ id: "1", school: "", degree: "", year: "" }],
    projects: [{ id: "1", name: "", description: "", technologies: "", link: "" }],
    skills: [""],
  })

  const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          duration: "",
          description: "",
        },
      ],
    }))
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          school: "",
          degree: "",
          year: "",
        },
      ],
    }))
  }

  const updateSkills = (index: number, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    }))
  }

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    }))
  }

  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview")
    if (!element) return

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).jsPDF

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf"

      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                    placeholder="Brief summary of your professional background and goals..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          placeholder="Job Title"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                        placeholder="Jan 2020 - Present"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div>
                        <Label>Project Link</Label>
                        <Input
                          value={project.link}
                          onChange={(e) => updateProject(project.id, "link", e.target.value)}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="Describe what the project does and your role in it..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
                  Add Project
                </Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
                  Add Education
                </Button>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.skills.map((skill, index) => (
                  <Input
                    key={index}
                    value={skill}
                    onChange={(e) => updateSkills(index, e.target.value)}
                    placeholder="Enter a skill"
                  />
                ))}
                <Button onClick={addSkill} variant="outline" className="w-full bg-transparent">
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resume Preview</CardTitle>
                <Button size="sm" className="gap-2" onClick={downloadPDF}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div id="resume-preview" className="bg-white text-black p-8 rounded-lg border shadow-sm min-h-[800px]">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="text-gray-600 space-y-1">
                      {resumeData.personalInfo.email && <p>{resumeData.personalInfo.email}</p>}
                      {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
                      {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.some((exp) => exp.company || exp.position) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Work Experience
                      </h2>
                      <div className="space-y-4">
                        {resumeData.experience.map(
                          (exp) =>
                            (exp.company || exp.position) && (
                              <div key={exp.id}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                                    <p className="text-gray-700">{exp.company || "Company"}</p>
                                  </div>
                                  <span className="text-gray-600 text-sm">{exp.duration || "Duration"}</span>
                                </div>
                                {exp.description && (
                                  <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.some((project) => project.name || project.description) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Projects
                      </h2>
                      <div className="space-y-4">
                        {resumeData.projects.map(
                          (project) =>
                            (project.name || project.description) && (
                              <div key={project.id}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{project.name || "Project Name"}</h3>
                                    {project.technologies && (
                                      <p className="text-gray-600 text-sm">{project.technologies}</p>
                                    )}
                                  </div>
                                  {project.link && (
                                    <a
                                      href={project.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 text-sm hover:underline"
                                    >
                                      View Project
                                    </a>
                                  )}
                                </div>
                                {project.description && (
                                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.some((edu) => edu.school || edu.degree) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Education
                      </h2>
                      <div className="space-y-3">
                        {resumeData.education.map(
                          (edu) =>
                            (edu.school || edu.degree) && (
                              <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                                  <p className="text-gray-700">{edu.school || "School"}</p>
                                </div>
                                <span className="text-gray-600 text-sm">{edu.year || "Year"}</span>
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.some((skill) => skill.trim()) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills
                          .filter((skill) => skill.trim())
                          .map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
