# backend/user.py
from flask import Blueprint, jsonify
from database import get_connection

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/get_users', methods=['GET'])
def get_users():
    conn = get_connection()
    cursor = conn.cursor()

    # ✅ If your table has a `role` column, keep the WHERE clause. Otherwise, remove it.
    try:
        cursor.execute("SELECT first_name, last_name, email FROM users")  # Or add WHERE role != 'admin'
        users = cursor.fetchall()

        user_list = []
        for user in users:
            user_list.append({
                'firstName': user[0],
                'lastName': user[1],
                'email': user[2]
            })

        return jsonify(user_list)

    except Exception as e:
        print("DB Error:", e)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cursor.close()
        conn.close()
