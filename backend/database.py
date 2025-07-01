# backend/database.py

import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  
        database="job_portal",
        port=3306
    )
