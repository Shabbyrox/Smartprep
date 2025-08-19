from flask import Flask, request, jsonify
from flask_cors import CORS
import docx2txt
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# -------------------------
# Job descriptions
# -------------------------
job_roles = {
    "Data Scientist": "Python, machine learning, ML models, data analysis, statistics, pandas, numpy, data visualization, predictive modeling, SQL, AI, deep learning",
    "Business Analyst": "Excel, Tableau, business analysis, reporting, stakeholder management, requirement gathering, data-driven insights, dashboards, KPIs",
    "Software Engineer": "Java, Python, software development, coding, algorithms, data structures, problem solving, debugging, application design, system architecture",
    "ML Engineer": "ML models, Python, scikit-learn, TensorFlow, PyTorch, model deployment, data preprocessing, data analysis, predictive modeling, AI",
    "Frontend Developer": "React, HTML, CSS, JavaScript, UI development, responsive design, web development, web applications, user interface, frontend frameworks",
    "Backend Developer": "Node.js, Python, database management, APIs, server-side development, RESTful services, backend architecture, SQL, security",
    "Full Stack Developer": "React, Node.js, MongoDB, Python, web development, front-end and back-end, API integration, full-stack applications, UI/UX collaboration",
    "Project Manager": "Team leadership, planning, agile, project coordination, stakeholder communication, risk management, scheduling, project lifecycle",
    "HR Manager": "Recruitment, employee relations, HR policies, communication, onboarding, talent acquisition, performance management, HR strategy",
    "Marketing Specialist": "SEO, content marketing, social media, campaigns, digital marketing, branding, analytics, email marketing, marketing strategy",
    "Data Analyst": "SQL, Excel, Tableau, data visualization, reporting, data cleaning, data insights, dashboards, statistics, business intelligence",
    "UI/UX Designer": "Figma, Adobe XD, prototyping, user interface design, user experience, wireframing, usability testing, design thinking",
    "DevOps Engineer": "AWS, CI/CD, Docker, Kubernetes, automation, cloud infrastructure, deployment pipelines, monitoring, system reliability",
    "QA Engineer": "Testing, Selenium, automation, manual testing, test cases, bug reporting, quality assurance, software validation, QA strategy",
    "Cybersecurity Analyst": "Network security, vulnerability assessment, ethical hacking, penetration testing, risk management, firewalls, intrusion detection, information security"
}

# -------------------------
# File extraction
# -------------------------
def extract_file(file_path):
    if file_path.lower().endswith(".pdf"):
        reader = PyPDF2.PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + " "
        return text
    elif file_path.lower().endswith(".docx"):
        return docx2txt.process(file_path)
    return ""

# -------------------------
# Text preprocessing
# -------------------------
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text

# -------------------------
# Resume matching
# -------------------------
def match_resume(resume_text, job_roles):
    resume_text = preprocess_text(resume_text)
    job_names = list(job_roles.keys())
    job_descs = [preprocess_text(desc) for desc in job_roles.values()]

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1,2))
    vectors = vectorizer.fit_transform([resume_text] + job_descs)

    resume_vec = vectors[0]
    job_vecs = vectors[1:]

    cos_scores = cosine_similarity(resume_vec, job_vecs)[0]
    best_idx = cos_scores.argmax()
    best_role = job_names[best_idx]
    confidence = cos_scores[best_idx] * 100

    resume_words = set(resume_text.split())
    job_words = set(job_descs[best_idx].split())
    overlap_bonus = min(len(resume_words & job_words) * 1.5, 20)
    confidence += overlap_bonus

    sorted_idx = cos_scores.argsort()[::-1]
    other_roles = [job_names[i] for i in sorted_idx if i != best_idx][:2]

    return best_role, confidence, other_roles

# -------------------------
# API endpoint
# -------------------------
@app.route('/check_resume', methods=['POST'])
def check_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    os.makedirs("temp_upload", exist_ok=True)
    file_path = os.path.join("temp_upload", file.filename)
    file.save(file_path)

    resume_text = extract_file(file_path)
    os.remove(file_path)

    if not resume_text:
        return jsonify({"error": "Unsupported file type or empty file"}), 400

    best_role, confidence, other_roles = match_resume(resume_text, job_roles)

    return jsonify({
        "best_role": best_role,
        "confidence": round(confidence, 1),
        "other_roles": other_roles
    })

# -------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
