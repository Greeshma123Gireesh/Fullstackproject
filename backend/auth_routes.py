from flask import Blueprint, request, jsonify, session
from database import get_connection
import mysql.connector

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    first = data.get("firstName")
    last = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not (first and last and email and password):
        return jsonify({"message": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)",
            (first, last, email, password)
        )
        conn.commit()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_id = cursor.fetchone()[0]

        return jsonify({"message": "Signup successful", "userId": user_id}), 200
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Email already exists"}), 409
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, first_name, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and user[2] == password:
        session['user_id'] = user[0]
        session['first_name'] = user[1]
        session['role'] = 'user'
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Login successful",
            "role": "user",
            "userId": user[0],
            "firstName": user[1]
        }), 200

    cursor.execute("SELECT id, username, password FROM admins WHERE username = %s", (email,))
    admin = cursor.fetchone()

    if admin and admin[2] == password:
        session['admin_id'] = admin[0]
        session['admin_name'] = admin[1]
        session['role'] = 'admin'
        cursor.close()
        conn.close()
        return jsonify({"message": "Admin login successful", "role": "admin"}), 200

    cursor.close()
    conn.close()
    return jsonify({"message": "Invalid credentials"}), 401

def init_auth_routes(app):
    app.register_blueprint(auth_bp)
