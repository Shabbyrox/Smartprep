"use client";

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
  page: { padding: 30, fontSize: 11, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  contact: { fontSize: 10, marginTop: 4 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4, borderBottom: 1, paddingBottom: 2 },
  item: { marginBottom: 6 },
  itemTitle: { fontSize: 11, fontWeight: "bold" },
  itemSub: { fontSize: 10, color: "grey" },
  listItem: { fontSize: 10, marginLeft: 10 },
});

const textToList = (text: string) =>
  text.split("\n").filter((line) => line.trim() !== "").map((line) => line.trim());

const ResumeDocument = ({ resumeData }: { resumeData: ResumeData }) => (
  <Document>
    <Page style={styles.page}>
      {/* HEADER */}
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
          <Text>{resumeData.personalInfo.summary}</Text>
        </View>
      )}

      {/* EXPERIENCE */}
      {resumeData.experience.some((exp) => exp.company || exp.position) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resumeData.experience.map(
            (exp) =>
              (exp.company || exp.position) && (
                <View key={exp.id} style={styles.item}>
                  <Text style={styles.itemTitle}>{exp.position || "Position"}</Text>
                  <Text style={styles.itemSub}>
                    {exp.company} {exp.duration ? `• ${exp.duration}` : ""}
                  </Text>
                  {exp.description &&
                    textToList(exp.description).map((line, i) => (
                      <Text key={i} style={styles.listItem}>• {line}</Text>
                    ))}
                </View>
              )
          )}
        </View>
      )}

      {/* PROJECTS */}
      {resumeData.projects.some((p) => p.name || p.description) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resumeData.projects.map(
            (p) =>
              (p.name || p.description) && (
                <View key={p.id} style={styles.item}>
                  <Text style={styles.itemTitle}>{p.name || "Project"}</Text>
                  {p.technologies && <Text style={styles.itemSub}>{p.technologies}</Text>}
                  {p.description &&
                    textToList(p.description).map((line, i) => (
                      <Text key={i} style={styles.listItem}>• {line}</Text>
                    ))}
                </View>
              )
          )}
        </View>
      )}

      {/* CERTIFICATIONS */}
      {resumeData.certifications.some((c) => c.name || c.description) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
          {resumeData.certifications.map(
            (c) =>
              (c.name || c.description) && (
                <View key={c.id} style={styles.item}>
                  <Text style={styles.itemTitle}>{c.name}</Text>
                  {c.description &&
                    textToList(c.description).map((line, i) => (
                      <Text key={i} style={styles.listItem}>• {line}</Text>
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
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemSub}>
                    {edu.school} {edu.year ? `• ${edu.year}` : ""}
                  </Text>
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
          <Text>{resumeData.skills.filter((s) => s.trim()).join(" • ")}</Text>
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
