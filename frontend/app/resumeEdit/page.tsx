// resumeEdit/page.tsx
"use client"

import { useState } from "react"
import dynamic from 'next/dynamic'; // Import dynamic for client-side loading
// 🚨 Import useRouter
import { useRouter } from 'next/navigation'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, FileText, User, Briefcase, GraduationCap, Award, Code, AlertTriangle, ArrowLeft } from "lucide-react"

const PDFDownloadWrapper = dynamic(
  () => import('@/components/ResumePDF'),
  { 
    ssr: false, // THIS IS CRITICAL
    // 💡 FIX: Return null or simple text during the loading/SSR skip phase
    loading: () => null, // or loading: () => <p>Loading PDF...</p>
  } 
);

interface ResumeData {
  personalInfo: {
    fullName: string
    phone: string
    email: string
    location: string
    linkedin?: string
    github?: string
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
    location: string
    gpa: string
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

  certifications: Array<{
    id: string
    name: string
    description: string 
  }>

}

export default function ResumeBuilder() {
  // 🚨 Initialize useRouter
  const router = useRouter(); 

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    experience: [{ id: "1", company: "", position: "", duration: "", description: "" }],
    education: [{ id: "1", school: "", degree: "", year: "", location: "", gpa: "" }],
    projects: [{ id: "1", name: "", description: "", technologies: "", link: "" }],
    skills: [""],
    certifications: [{ id: "1", name: "", description: "" }],
  })

  // 1. State for the alert trigger
  const [showNameAlert, setShowNameAlert] = useState(false);

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
          location: "",
          gpa: "",
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

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }))
  }

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
        },
      ],
    }))
  }

  const textToList = (text: string) => {
    if (!text) return []
    // Split the text by newline, filter out empty lines, and trim whitespace
    return text.split('\n').filter(line => line.trim() !== '').map(line => line.trim());
  }

  // 2. Logic to check if required fields are filled (excluding fullName)
  const checkOtherFieldsFilled = () => {
    const { phone, email, location, summary } = resumeData.personalInfo;
    
    // Add other sections' basic check if they are considered "required"
    const hasMinExperience = resumeData.experience.some(exp => exp.company.trim() && exp.position.trim());
    const hasMinEducation = resumeData.education.some(edu => edu.school.trim() && edu.degree.trim());
    const hasMinSkills = resumeData.skills.some(skill => skill.trim());

    return (
      phone.trim() !== "" &&
      email.trim() !== "" &&
      location.trim() !== "" &&
      summary.trim() !== "" &&
      hasMinExperience &&
      hasMinEducation &&
      hasMinSkills
    );
  };

  // 3. Focus handler for the Full Name input
  const handleFullNameFocus = () => {
    const areOtherFieldsFilled = checkOtherFieldsFilled();
    if (!areOtherFieldsFilled) {
      setShowNameAlert(true);
    } else {
      setShowNameAlert(false);
    }
  };
  
  // 4. Handle change to clear the alert if the user starts filling a required field
  const handlePersonalInfoChange = (field: keyof ResumeData["personalInfo"], value: string) => {
    updatePersonalInfo(field, value);
    // Hide the alert when the user starts filling any required field
    if (showNameAlert && value.trim() !== "") {
        setShowNameAlert(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          {/* 🚨 Updated Header for Dashboard Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
            </div>
            
            {/* 🚨 Dashboard Button */}
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="outline" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            
            {/* 5. Display the Alert Banner */}
            {showNameAlert && (
              <div className="flex items-center p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow-md transition-all duration-300">
                <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="font-medium text-sm">
                  **Development Tip**: For a better experience and to avoid errors, please fill out the **Phone, Email, Location, Career Objective, Experience, Education, Skills and other sections** before entering your **Full Name**.
                </p>
                <button 
                    onClick={() => setShowNameAlert(false)} 
                    className="ml-auto text-yellow-700 hover:text-yellow-900 font-bold text-lg leading-none"
                    aria-label="Close alert"
                >&times;</button>
              </div>
            )}

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
                      // 6. Add onFocus handler
                      onFocus={handleFullNameFocus}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      placeholder="+91 1234567891"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                      placeholder="Mumbai, India"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Career Objective</Label>
                  <Textarea
                    id="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
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
            
            {/* Certifications / Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications / Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder="AWS Certified Developer - Associate or 'Best Mobile App' at HackTX"
                      />
                    </div>
                    <div>
                      <Label>Description (one achievement per line)</Label>
                      <Textarea
                        value={cert.description}
                        onChange={(e) => updateCertification(cert.id, "description", e.target.value)}
                        placeholder="Use a new line (Enter) for each separate achievement or detail, like:
                       Issued by AWS, August 2023 (for certificates)
                      or Winner of the Annual Hackathon 2024 (for achievements)"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addCertification} variant="outline" className="w-full bg-transparent">
                  Add Certification / Achievement
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
                          placeholder="Bachelor of Technology in Information Technology"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    <div> 
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        placeholder="8.93"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                        placeholder="Aug 2020"
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
                    placeholder="Language: JavaScript, Python, C"
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
                
                {/* 🚨 NEW: Use the dynamically imported PDFDownloadWrapper */}
                <PDFDownloadWrapper resumeData={resumeData}>
                  <Button size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </PDFDownloadWrapper>
              </CardHeader>
              <CardContent>
                {/* NOTE: You should remove the 'id="resume-preview"' and 'min-h-[800px]' 
                   since the download functionality no longer relies on it, but I'll 
                   leave it here for the HTML preview logic to remain functional. 
                   The old downloadPDF function is now useless.
                */}
                <div id="resume-preview" className="bg-white text-black p-6 rounded-lg border shadow-sm min-h-[800px]">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="text-gray-600 flex flex-wrap justify-center items-center text-sm">
                        <p>{resumeData.personalInfo.phone}</p>
                        {resumeData.personalInfo.email && <p className="mx-2"> | </p>}
                        <p>{resumeData.personalInfo.email}</p>
                        {resumeData.personalInfo.linkedin && <p className="mx-2"> | </p>}
                        <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" className="hover:underline">{resumeData.personalInfo.linkedin}</a>
                        {resumeData.personalInfo.github && <p className="mx-2"> | </p>}
                        <a href={`https://${resumeData.personalInfo.github}`} target="_blank" className="hover:underline">{resumeData.personalInfo.github}</a>
                        {resumeData.personalInfo.location && <p className="mx-2"> | </p>}
                        <p>{resumeData.personalInfo.location}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.personalInfo.summary && (
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.some((exp) => exp.company || exp.position) && (
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Work Experience
                      </h2>
                      <div className="space-y-3">
                        {resumeData.experience.map(
                          (exp) =>
                            (exp.company || exp.position) && (
                              <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                                    <p className="text-gray-700">{exp.company || "Company"}</p>
                                  </div>
                                  <span className="text-gray-600 text-sm">{exp.duration || "Duration"}</span>
                                </div>
                                {exp.description && (
                                  <ul className="list-disc ml-4 text-gray-700 text-sm space-y-0.5">
                                  {textToList(exp.description).map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.some((project) => project.name || project.description) && (
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Projects
                      </h2>
                      <div className="space-y-3">
                        {resumeData.projects.map(
                          (project) =>
                            (project.name || project.description) && (
                              <div key={project.id}>
                                <div className="flex justify-between items-start mb-1">
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
                                  <ul className="list-disc ml-4 text-gray-700 text-sm space-y-0.5">
                                  {textToList(project.description).map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Certifications / Achievements */}
                  {resumeData.certifications.some((cert) => cert.name || cert.description) && (
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Certifications & Achievements
                      </h2>
                      <div className="space-y-3">
                        {resumeData.certifications.map(
                          (cert) =>
                            (cert.name || cert.description) && (
                              <div key={cert.id} className="mb-2">
                                <h3 className="font-semibold text-gray-900">{cert.name || "Certification/Achievement"}</h3>
                                {cert.description && (
                                  <ul className="list-disc ml-4 text-gray-700 text-sm space-y-0.5">
                                    {textToList(cert.description).map((line, i) => (
                                      <li key={i}>{line}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.some((edu) => edu.school || edu.degree) && (
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Education
                      </h2>
                      <div className="space-y-2">
                        {resumeData.education.map(
                          (edu) =>
                            (edu.school || edu.degree) && (
                              <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                                  <p className="text-gray-700">{edu.school || "School"}</p>
                                  {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
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
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5 uppercase tracking-wider">
                        Skills
                      </h2>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {/* Join skills with a separator */}
                        {resumeData.skills.filter((skill) => skill.trim()).join(' • ')}
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