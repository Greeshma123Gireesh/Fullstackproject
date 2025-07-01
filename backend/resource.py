from flask import Blueprint, request, jsonify
from database import get_connection
import json

resource_bp = Blueprint('resource_bp', __name__)

@resource_bp.route("/save_resources", methods=["POST"])
def save_resources():
    data = request.get_json()
    lang = data.get("language")
    resources = json.dumps(data.get("resources", []))
    checklist = json.dumps(data.get("checklist", []))

    conn = get_connection()
    cursor = conn.cursor()

    query = "INSERT INTO language_data (language, resource, checklist) VALUES (%s, %s, %s)"
    cursor.execute(query, (lang, resources, checklist))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Saved successfully"}), 200

@resource_bp.route("/get_all_languages", methods=["GET"])
def get_all_languages():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM language_data")
    rows = cursor.fetchall()

    result = [{
        "id": row["id"],
        "language": row["language"],
        "resources": json.loads(row["resource"]),
        "checklist": json.loads(row["checklist"])
    } for row in rows]

    cursor.close()
    conn.close()

    return jsonify(result)

@resource_bp.route("/update_resources", methods=["PUT"])
def update_resources():
    data = request.get_json()
    lang = data.get("language")
    resources = json.dumps(data.get("resources", []))
    checklist = json.dumps(data.get("checklist", []))

    conn = get_connection()
    cursor = conn.cursor()

    query = "UPDATE language_data SET resource = %s, checklist = %s WHERE language = %s"
    cursor.execute(query, (resources, checklist, lang))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Updated successfully"}), 200

@resource_bp.route("/delete_language", methods=["DELETE"])
def delete_language():
    lang = request.args.get("language")

    conn = get_connection()
    cursor = conn.cursor()

    query = "DELETE FROM language_data WHERE language = %s"
    cursor.execute(query, (lang,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": f"{lang} deleted."})
