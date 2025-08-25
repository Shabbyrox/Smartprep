// ResumePDF.tsx "use client";

import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { ReactNode } from "react";

interface ResumeData {
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    location: string;
    linkedin?: string;
    github?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    location: string;
    gpa: string;
    year: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 15, fontFamily: "Helvetica" },
  
  header: { textAlign: "left", marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
  contact: { fontSize: 10, marginTop: 0, color: "black" },
  
  section: { marginTop: 15 }, 
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4, borderBottom: 2, paddingBottom: 2, textTransform: "uppercase" },
  
  item: { marginBottom: 8 }, 
  itemTitle: { fontSize: 11, fontWeight: "bold" },
  itemSub: { fontSize: 10, color: "black", marginTop: 2 }, 
  
  // Style for the container of the bullet and the text
  listItemContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginLeft: 15, 
    paddingRight: 5,
    marginBottom: 2, // Small space between points
  },
  // Style for the bullet character
  bullet: { 
    fontSize: 10, 
    marginRight: 5, 
  },
  // Style for the text content of the list item
  listItem: { 
    fontSize: 10, 
    lineHeight: 1.4, // Improves readability
    flexGrow: 1, // Allows text to take up remaining space
  },
  // **********************************************
  
  // Utility styles for aligning content
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
});

const textToList = (text: string) =>
  text.split("\n").filter((line) => line.trim() !== "").map((line) => line.trim());

const ResumeDocument = ({ resumeData }: { resumeData: ResumeData }) => (
  <Document>
    <Page style={styles.page}>
      {/* HEADER: Left aligned contact info */}
      <View style={styles.header}>
        <Text style={styles.name}>{resumeData.personalInfo.fullName || "Your Name"}</Text>
        <Text style={styles.contact}>
          {[
            resumeData.personalInfo.phone,
            resumeData.personalInfo.email,
            resumeData.personalInfo.linkedin,
            resumeData.personalInfo.github,
            resumeData.personalInfo.location,
          ]
            .filter(Boolean)
            .join(" | ")}
        </Text>
      </View>

      {/* SUMMARY */}
      {resumeData.personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={{fontSize: 10, lineHeight: 1.4}}>{resumeData.personalInfo.summary || "..."}</Text>
        </View>
      )}

      {/* EXPERIENCE (Updated List Rendering) */}
      {resumeData.experience.some((exp) => exp.company || exp.position) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resumeData.experience.map(
            (exp) =>
              (exp.company || exp.position) && (
                <View key={exp.id} style={styles.item}>
                  {/* Title and Duration on same row, justified */}
                  <View style={styles.flexRow}>
                    <Text style={styles.itemTitle}>{exp.position || "Position"}</Text>
                    {exp.duration && <Text style={styles.itemTitle}>{exp.duration}</Text>}
                  </View>
                  
                  {/* Company on next line */}
                  <Text style={styles.itemSub}>{exp.company}</Text>

                  {/* Description as bullet points (FIXED WRAPPING) */}
                  {exp.description &&
                    textToList(exp.description).map((line, i) => (
                      <View key={i} style={styles.listItemContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItem}>{line}</Text>
                      </View>
                    ))}
                </View>
              )
          )}
        </View>
      )}

      {/* PROJECTS (Updated List Rendering) */}
      {resumeData.projects.some((p) => p.name || p.description) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resumeData.projects.map(
            (p) =>
              (p.name || p.description) && (
                <View key={p.id} style={styles.item}>
                  {/* Name and Link on same row, justified */}
                  <View style={styles.flexRow}>
                    <Text style={styles.itemTitle}>{p.name || "Project"}</Text>
                    {p.link && <Text style={{fontSize: 10, color: 'blue', textDecoration: 'underline'}}>View Project</Text>}
                  </View>
                  
                  {/* Technologies on next line */}
                  {p.technologies && <Text style={styles.itemSub}>{p.technologies}</Text>}
                  
                  {/* Description as bullet points (FIXED WRAPPING) */}
                  {p.description &&
                    textToList(p.description).map((line, i) => (
                      <View key={i} style={styles.listItemContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItem}>{line}</Text>
                      </View>
                    ))}
                </View>
              )
          )}
        </View>
      )}

      {/* CERTIFICATIONS (Updated List Rendering) */}
      {resumeData.certifications.some((c) => c.name || c.description) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
          {resumeData.certifications.map(
            (c) =>
              (c.name || c.description) && (
                <View key={c.id} style={styles.item}>
                  {/* Name (Title) */}
                  <Text style={styles.itemTitle}>{c.name}</Text>
                  
                  {/* Description as bullet points (FIXED WRAPPING) */}
                  {c.description &&
                    textToList(c.description).map((line, i) => (
                      <View key={i} style={styles.listItemContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItem}>{line}</Text>
                      </View>
                    ))}
                </View>
              )
          )}
        </View>
      )}

      {/* EDUCATION */}
      {resumeData.education.some((edu) => edu.school || edu.degree) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resumeData.education.map(
            (edu) =>
              (edu.school || edu.degree) && (
                <View key={edu.id} style={styles.item}>
                  {/* Degree and Year on same row, justified */}
                  <View style={styles.flexRow}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    {edu.year && <Text style={{fontSize: 10, color: 'black'}}>{edu.year}</Text>}
                  </View>
                  
                  {/* School, Location, and GPA on next lines (similar to SAM DER) */}
                  <Text style={styles.itemSub}>{edu.school}</Text>
                  {edu.location && <Text style={styles.itemSub}>{edu.location}</Text>}
                  {edu.gpa && <Text style={styles.itemSub}>GPA: {edu.gpa}</Text>}
                </View>
              )
          )}
        </View>
      )}

      {/* SKILLS */}
      {resumeData.skills.some((s) => s.trim()) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={{fontSize: 10, lineHeight: 1.4}}>{resumeData.skills.filter((s) => s.trim()).join(" • ")}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default function PDFDownloadWrapper({
  resumeData,
  children,
}: {
  resumeData: ResumeData;
  children?: ReactNode;
}) {
  // Ensure we don't render PDFDownloadLink until there's at least a name
  if (!resumeData.personalInfo.fullName.trim()) return null;

  return (
    <PDFDownloadLink
      document={<ResumeDocument resumeData={resumeData} />}
      fileName="resume.pdf"
    >
      {({ loading }) => (loading ? "Preparing PDF..." : children || "Download PDF")}
    </PDFDownloadLink>
  );
}