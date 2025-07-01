from flask import Blueprint, request, jsonify
from database import get_connection
import base64

profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # ✅ Convert resume blob to base64
    if user.get("resume"):
        user["resume"] = base64.b64encode(user["resume"]).decode("utf-8")
    else:
        user["resume"] = None

    return jsonify(user), 200


@profile_bp.route('/profile/<int:user_id>', methods=['POST'])
def update_profile(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    form = request.form

    first_name = form.get("firstName")
    last_name = form.get("lastName")
    email = form.get("email")
    about_me = form.get("aboutMe")
    job_title = form.get("jobTitle")
    dob = form.get("dob")
    country = form.get("country")
    phone = form.get("phoneNumber")
    linkedin = form.get("linkedin")
    github = form.get("github")
    skills = form.get("skills")
    experience = form.get("experience")
    resume_file = request.files.get("resume")
    resume_blob = resume_file.read() if resume_file else None

    try:
        if resume_blob:
            cursor.execute("""
                UPDATE users SET 
                    first_name=%s, last_name=%s, email=%s, about_me=%s, job_title=%s,
                    dob=%s, country=%s, phone=%s, linkedin=%s, github=%s,
                    skills=%s, experience=%s, resume=%s
                WHERE id=%s
            """, (
                first_name, last_name, email, about_me, job_title, dob, country,
                phone, linkedin, github, skills, experience, resume_blob, user_id
            ))
        else:
            cursor.execute("""
                UPDATE users SET 
                    first_name=%s, last_name=%s, email=%s, about_me=%s, job_title=%s,
                    dob=%s, country=%s, phone=%s, linkedin=%s, github=%s,
                    skills=%s, experience=%s
                WHERE id=%s
            """, (
                first_name, last_name, email, about_me, job_title, dob, country,
                phone, linkedin, github, skills, experience, user_id
            ))

        conn.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        print("Error updating profile:", e)
        return jsonify({"message": "Failed to update profile"}), 500
    finally:
        cursor.close()
        conn.close()
