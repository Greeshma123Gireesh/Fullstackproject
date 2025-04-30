from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import re

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# A more comprehensive list of skills
known_skills = [
    "Java", "Python", "JavaScript", "React", "HTML", "CSS", "SQL",
    "Spring Boot", "TensorFlow", "Keras", "Machine Learning", 
    "Deep Learning", "Responsive Design", "NLP", "Flask", "Django",
    "AI", "C++", "Git", "Data Visualization", "Excel", "Pandas", "NumPy"
]

# Function to extract text from a PDF file using PyMuPDF
def extract_text_from_pdf(pdf_file):
    text = ""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text

# Function to extract known skills from the resume text
def extract_skills_from_text(text):
    found_skills = []
    lower_text = text.lower()

    for skill in known_skills:
        if skill.lower() in lower_text:  # Case-insensitive check
            found_skills.append(skill)

    return list(set(found_skills))  # Remove duplicates and return

# API endpoint for analyzing uploaded resume and extracting skills
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    resume = request.files['resume']
    text = extract_text_from_pdf(resume)
    skills = extract_skills_from_text(text)

    return jsonify({'extracted_skills': skills})

if __name__ == '__main__':
    app.run(debug=True)
