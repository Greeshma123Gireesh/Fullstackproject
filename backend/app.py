from flask import Flask, request, jsonify, session, render_template, redirect
from flask_cors import CORS
import fitz  # PyMuPDF

from auth_routes import init_auth_routes
from user_profile import profile_bp  
from resource import resource_bp
from job import job_bp
from user import user_bp
from language_resource import language_resource_bp  
from job_routes import job_display_bp 

app = Flask(__name__, template_folder='templates')
app.secret_key = 'your-secret-key'
CORS(app, supports_credentials=True)

# Register Blueprints
init_auth_routes(app)
app.register_blueprint(profile_bp)
app.register_blueprint(resource_bp)
app.register_blueprint(job_bp)
app.register_blueprint(user_bp)
app.register_blueprint(language_resource_bp) 
app.register_blueprint(job_display_bp)

# Resume analysis logic...
known_skills = ["Java", "Python", "JavaScript", "React", "HTML", "CSS", "SQL", "Spring Boot",
                "TensorFlow", "Keras", "Machine Learning", "Deep Learning", "Responsive Design",
                "NLP", "Flask", "Django", "AI", "C++", "Git", "Data Visualization", "Excel",
                "Pandas", "NumPy"]

@app.route('/')
def home():
    if 'first_name' not in session:
        return redirect('/login')
    return render_template("home.html", user=session['first_name'])

@app.route('/login')
def login_page():
    return render_template("login.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect("/login")

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        pdf_file = request.files['resume']
        text = extract_text_from_pdf(pdf_file)
        skills = extract_skills_from_text(text)
        return jsonify({'extracted_skills': skills}), 200

    except Exception as e:
        print("Resume analysis error:", e)
        return jsonify({"error": "Internal server error"}), 500

def extract_text_from_pdf(pdf_file):
    text = ""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text

def extract_skills_from_text(text):
    lower_text = text.lower()
    return [skill for skill in known_skills if skill.lower() in lower_text]

if __name__ == '__main__':
    app.run(debug=True)
