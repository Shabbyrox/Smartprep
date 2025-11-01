from flask import Flask, request, jsonify
from flask_cors import CORS
import docx2txt
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import os
import io
import tempfile
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configuration & Initialization ---
app = Flask(__name__)

# Set max file size to 5 MB (5 * 1024 * 1024 bytes) to prevent DoS attacks
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

# Set CORS policy based on environment variable for production security
# Example: ALLOWED_ORIGINS = "https://your-frontend.com,http://localhost:3000"
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000") # Default to local frontend for quick setup
allowed_origins_list = [
    origin.strip() for origin in allowed_origins_str.split(',')
] if allowed_origins_str != "*" else "*"

CORS(app, resources={r"/*": {"origins": allowed_origins_list}})

logger.info(f"CORS allowed origins set to: {allowed_origins_list}")

# -------------------------
# Job roles -> ordered skills (Your full list)
# -------------------------
job_skills = {
    # Engineering & Web
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "Git", "Responsive Design", "React", "Redux", "Next.js", "TypeScript", "Tailwind", "Testing"],
    "Backend Developer": ["Python", "Node.js", "Express", "Django", "Flask", "REST APIs", "SQL", "PostgreSQL", "MongoDB", "Auth/Security", "Caching"],
    "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "REST APIs", "MongoDB", "PostgreSQL", "TypeScript", "CI/CD"],
    "Software Engineer": ["Data Structures", "Algorithms", "Git", "Python", "Java", "System Design", "Testing", "Design Patterns", "APIs", "OOP"],
    "Mobile App Developer": ["Java", "Kotlin", "Android SDK", "Swift", "iOS SDK", "Flutter", "React Native", "SQLite", "Firebase", "Push Notifications"],
    "Game Developer": ["C#", "Unity", "C++", "Unreal Engine", "3D Math", "Shaders", "Gameplay Programming", "Optimization", "Multiplayer", "Profiling"],
    "Embedded Systems Engineer": ["C", "C++", "Microcontrollers", "GPIO/UART/I2C/SPI", "RTOS", "Embedded Linux", "Sensors", "Interrupts", "Debugging", "IoT Protocols"],
    "Robotics Engineer": ["Python", "C++", "ROS", "Kinematics", "Motion Planning", "SLAM", "Perception", "Path Planning", "Controls", "Simulation (Gazebo)"],
    "IoT Engineer": ["Microcontrollers", "Sensors", "MQTT/CoAP", "Python", "Node-RED", "Edge Computing", "Cloud IoT", "OTA Updates", "IoT Security", "Dashboards"],

    # Data & AI
    "Data Analyst": ["Excel", "SQL", "Data Cleaning", "Statistics", "Python", "Pandas", "Visualization", "Tableau", "Power BI", "Dashboards"],
    "Business Analyst": ["Excel", "SQL", "Tableau", "Requirement Gathering", "Stakeholder Communication", "KPIs", "Reporting", "Process Mapping", "User Stories"],
    "Data Scientist": ["Python", "Numpy", "Pandas", "EDA", "Statistics", "Scikit-learn", "ML Models", "Model Evaluation", "SQL", "Visualization", "Deep Learning"],
    "ML Engineer": ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "Feature Engineering", "Model Serving", "MLOps", "Docker", "Kubernetes", "Monitoring"],
    "AI Engineer": ["Python", "Neural Networks", "TensorFlow", "PyTorch", "Computer Vision", "NLP", "Vector Databases", "Fine-tuning", "MLOps", "Deployment"],
    "AI Researcher": ["Linear Algebra", "Probability", "Optimization", "PyTorch", "TensorFlow", "Deep Learning", "Generative Models", "RL", "Paper Reproduction"],
    "Data Engineer": ["Python", "SQL", "ETL", "Airflow", "Spark", "Hadoop", "Data Warehousing", "Batch/Streaming", "Kafka", "dbt", "Cloud Data Platforms"],
    "Research Scientist": ["Python", "Statistics", "Experiment Design", "MATLAB", "Simulation", "ML Basics", "Bayesian Methods", "Publishing", "Reproducibility"],

    # DevOps / Cloud / Security
    "DevOps Engineer": ["Linux", "Networking Basics", "Git", "CI/CD", "Docker", "Kubernetes", "Terraform", "Monitoring", "AWS", "Azure", "GCP"],
    "Cloud Engineer": ["AWS", "Azure", "GCP", "VPC/Networking", "IAM/Security", "Serverless", "Containers", "Terraform", "Monitoring", "Cost Optimization"],
    "Cloud Architect": ["AWS", "Azure", "GCP", "Architecture Patterns", "Security", "Scalability", "High Availability", "Cost Control", "IaC", "Governance"],
    "Site Reliability Engineer": ["Linux", "Networking", "Observability", "Incident Response", "SLO/SLA/SLI", "Automation", "Kubernetes", "Chaos Engineering", "Capacity Planning"],
    "Cybersecurity Analyst": ["Networking", "Linux/Windows Security", "Firewalls", "Vulnerability Assessment", "Penetration Testing", "SIEM", "Threat Hunting", "Incident Response"],
    "Cybersecurity Engineer": ["Network Security", "Endpoint Security", "Identity & Access", "Cloud Security", "Secure SDLC", "Automation", "Threat Modeling", "Zero Trust"],
    "Ethical Hacker": ["Linux", "Networking", "Scripting", "Reconnaissance", "Exploitation", "Post-Exploitation", "Web App Security", "Reporting", "OSINT"],

    # Product / Design / QA
    "Product Manager": ["Product Discovery", "Roadmapping", "User Research", "Analytics", "Prioritization", "Stakeholder Mgmt", "OKRs", "A/B Testing", "Spec Writing"],
    "Project Manager": ["Agile/Scrum", "Planning", "Risk Management", "Budgeting", "Team Leadership", "Communication", "Resource Mgmt", "Reporting", "Change Mgmt"],
    "UI/UX Designer": ["Wireframing", "Figma", "Prototyping", "Design Systems", "Usability Testing", "Accessibility", "Interaction Design", "Handoff"],
    "QA Engineer": ["Test Design", "Manual Testing", "Bug Reporting", "Selenium", "API Testing", "CI Integration", "Performance Testing", "Automation Frameworks"],
    "Technical Writer": ["Technical Research", "Information Architecture", "API Docs", "Tutorials", "Style Guides", "Version Control", "Doc Automation"],

    # Marketing / Sales / Ops / Finance / HR
    "Digital Marketer": ["SEO", "SEM", "Content Marketing", "Social Media", "Email Marketing", "Analytics", "Funnels", "CRO", "Automation"],
    "Marketing Specialist": ["SEO", "Content", "Campaigns", "Branding", "Analytics", "Social Media", "Email Marketing", "Reporting"],
    "SEO Specialist": ["Keyword Research", "On-page SEO", "Technical SEO", "Link Building", "Analytics", "Site Audits", "Schema", "International SEO"],
    "Sales Manager": ["CRM", "Prospecting", "Negotiation", "Pipeline Mgmt", "Forecasting", "Presentation", "Closing", "Account Mgmt"],
    "Operations Manager": ["Process Mapping", "KPI Tracking", "Supply Chain Basics", "Resource Planning", "Automation", "Lean/Six Sigma", "Reporting"],
    "Financial Analyst": ["Excel", "Accounting Basics", "Financial Modeling", "Valuation", "Budgeting", "Forecasting", "SQL", "Dashboards"],
    "Accountant": ["Bookkeeping", "Accounts Payable/Receivable", "Taxation Basics", "Financial Statements", "Audits", "ERP", "Compliance"],
    "HR Manager": ["Recruitment", "Onboarding", "Employee Relations", "Performance Mgmt", "Policies", "Payroll Basics", "HRIS", "Talent Mgmt"],

    # Creative / Media
    "Graphic Designer": ["Visual Design", "Typography", "Color Theory", "Photoshop", "Illustrator", "Branding", "Layout", "Export Formats"],
    "Animator": ["2D Animation", "3D Animation", "Storyboarding", "After Effects", "Maya/Blender", "Rigging", "Motion Graphics", "Rendering"],
    "Video Editor": ["Storytelling", "Premiere/Resolve", "Cutting", "Color Grading", "Sound Design", "Motion Graphics", "Export/Codecs"],

    # Specialized & Emerging
    "Blockchain Developer": ["Solidity", "Ethereum", "Smart Contracts", "Web3.js/Ethers.js", "Hardhat/Truffle", "Security", "Gas Optimization", "DeFi Basics"],
    "AR/VR Developer": ["Unity/Unreal", "3D Math", "XR SDKs", "Interaction Design", "Optimization", "Shaders", "Spatial Audio"],
    "Computer Vision Engineer": ["Python", "OpenCV", "Image Processing", "CNNs", "Detection/Segmentation", "ONNX/TensorRT", "Deployment"],
    "NLP Engineer": ["Text Preprocessing", "Word Embeddings", "Transformers", "LLMs", "RAG", "Evaluation", "Serving"],
    "Big Data Engineer": ["HDFS", "Spark", "Hive", "Kafka", "Streaming", "Partitioning", "Performance Tuning", "Lakehouse"],
    "Bioinformatics Analyst": ["Biology Basics", "Python/R", "NGS Pipelines", "Sequence Analysis", "Statistics", "Visualization", "Reproducibility"],
    "Quantitative Analyst": ["Probability", "Stochastic Calculus", "Time Series", "Python", "Pandas", "Backtesting", "Risk Models", "Optimization"],
    "GIS Analyst": ["Cartography", "QGIS/ArcGIS", "Spatial Data", "Projections", "Geodatabases", "Spatial Analysis", "Python Scripting"],
    "Systems Analyst": ["Requirements", "Process Modeling", "UML", "SQL", "Integration", "Testing", "Change Mgmt", "Documentation"],
    "Solutions Architect": ["Requirements", "Architecture Patterns", "Integration", "Security", "Scalability", "Cloud", "Costing", "Governance"],
    "Support Engineer": ["Ticketing", "Troubleshooting", "Networking Basics", "OS Basics", "Scripting", "Customer Communication", "Runbooks"],
    "Systems Administrator": ["Linux Admin", "Windows Server", "Active Directory", "Scripting", "Backups", "Monitoring", "Hardening", "Virtualization"],
    "Network Engineer": ["TCP/IP", "Routing", "Switching", "VLANs", "Firewalls", "VPNs", "QoS", "Monitoring", "Automation (Ansible)"],
    "Database Administrator": ["SQL", "Normalization", "Indexes", "Backups/Restore", "Replication", "Tuning", "Security", "HA/DR"],
    "Economist (Data)": ["Micro/Macro", "Econometrics", "R/Python", "Time Series", "Causal Inference", "Visualization", "Reporting"],
}

# -------------------------
# Utilities (Modified for secure, in-memory processing)
# -------------------------
def extract_file_content(file_storage) -> str:
    """Extracts text from a file object using in-memory or temporary files."""
    filename = file_storage.filename.lower()
    
    # Reset file pointer to the beginning before reading
    file_storage.seek(0)
    
    if filename.endswith(".pdf"):
        # Use in-memory buffer for PDFs
        pdf_file = io.BytesIO(file_storage.read())
        try:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text() or ""
                text += page_text + " "
            return text
        except Exception as e:
            logger.error(f"Error reading PDF: {e}")
            return "" 

    elif filename.endswith(".docx"):
        # docx2txt requires a file path. Use a safe temporary file guaranteed to be deleted.
        with tempfile.NamedTemporaryFile(delete=True, suffix=".docx") as tmp_file:
            tmp_file.write(file_storage.read())
            tmp_file.flush()
            try:
                return docx2txt.process(tmp_file.name)
            except Exception as e:
                logger.error(f"Error reading DOCX: {e}")
                return ""
    
    return ""


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def recommend_next_two_skills(resume_text: str, role: str) -> list:
    """Return the next two missing skills for the chosen role."""
    ordered = job_skills.get(role, [])
    resume_words = set(preprocess_text(resume_text).split())
    # Filter for skills not found in the resume text
    missing = [s for s in ordered if preprocess_text(s) not in resume_words]
    return missing[:2]


def match_resume(resume_text: str) -> tuple:
    """Return (best_role, next_two_skills, other_roles[2])."""
    role_names = list(job_skills.keys())
    # Build descriptions by joining skills, separated by a unique token for better vectorization
    role_descs = [preprocess_text(" ".join(job_skills[r])) for r in role_names]

    # Create a vectorizer instance on every call (necessary since the input corpus changes)
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    
    # Fit and transform the resume and all job descriptions
    vectors = vectorizer.fit_transform([preprocess_text(resume_text)] + role_descs)

    resume_vec = vectors[0]
    job_vecs = vectors[1:]

    # Calculate similarity scores
    cos_scores = cosine_similarity(resume_vec, job_vecs)[0]
    best_idx = int(cos_scores.argmax())
    best_role = role_names[best_idx]

    # Find the next two top roles
    other_idxs = cos_scores.argsort()[::-1]
    other_roles = [role_names[i] for i in other_idxs if i != best_idx][:2]

    next_two = recommend_next_two_skills(resume_text, best_role)
    return best_role, next_two, other_roles


# -------------------------
# API endpoint
# -------------------------
@app.route('/check_resume', methods=['POST'])
def check_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    
    # Securely extract content
    resume_text = extract_file_content(file)

    if not resume_text:
        return jsonify({"error": "Unsupported file type, corrupt file, or empty content"}), 400

    # Analyze
    try:
        best_role, next_two, other_roles = match_resume(resume_text)
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return jsonify({"error": "Analysis failed due to internal error."}), 500

    # Return results
    return jsonify({
        "best_role": best_role,
        "recommend_next": next_two,
        "other_roles": other_roles
    })


if __name__ == "__main__":
    # --- Local Development Run Command ---
    # In production, this block is ignored, and a WSGI server (like Gunicorn) is used.
    # To run locally: python app.py
    port = int(os.environ.get("PORT", 5001))
    logger.info(f"Starting Flask app on 0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port)