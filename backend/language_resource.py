from flask import Blueprint, jsonify
from database import get_connection

language_resource_bp = Blueprint('language_resource_bp', __name__)

@language_resource_bp.route('/get_resources/<language>', methods=['GET'])
def get_resources(language):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT content FROM language_data WHERE language = %s", (language,))
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        resources = [row[0] for row in rows]
        return jsonify(resources)

    except Exception as e:
        print("Error fetching resources:", e)
        return jsonify({"error": "Internal server error"}), 500
