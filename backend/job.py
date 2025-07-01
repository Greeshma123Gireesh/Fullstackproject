# backend/job.py

from flask import Blueprint, request, jsonify
from database import get_connection

job_bp = Blueprint('job_bp', __name__)

@job_bp.route('/add_job', methods=['POST'])
def add_job():
    data = request.get_json()
    db = get_connection()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO jobs (job_title, skills, learn_what, achieve_how, roadmap, salary, companies)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['jobTitle'], data['skills'], data['learnWhat'],
            data['achieveHow'], data['roadmap'], data['salary'], data['companies']
        ))
        db.commit()
        return jsonify({'message': 'Job added successfully'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        db.close()

@job_bp.route('/get_jobs', methods=['GET'])
def get_jobs():
    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM jobs")
        jobs = cursor.fetchall()
        return jsonify(jobs), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        db.close()
