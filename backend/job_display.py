# job_display.py

from flask import Blueprint, request, jsonify
from database import get_connection

job_display_bp = Blueprint('job_display_bp', __name__)

@job_display_bp.route('/get_job_by_title', methods=['GET'])
def get_job_by_title():
    title = request.args.get('title')
    if not title:
        return jsonify({'error': 'Missing job title'}), 400

    db = get_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM jobs WHERE job_title = %s", (title,))
        job = cursor.fetchone()
        if job:
            return jsonify(job), 200
        else:
            return jsonify({'error': 'Job not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()
