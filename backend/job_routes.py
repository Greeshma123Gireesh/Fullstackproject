# job_routes.py

from flask import Blueprint, jsonify
from database import get_connection

job_display_bp = Blueprint('job_display_bp', __name__)

@job_display_bp.route('/get_jobs', methods=['GET'])
def get_jobs():
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id, job_title, skills, learn_what, achieve_how, roadmap, salary, companies 
            FROM jobs
        """)
        jobs = cursor.fetchall()
        return jsonify(jobs), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        db.close()
