import os
import psycopg2
from flask import Flask, jsonify, request, render_template

# CITIZEN_APP_TOKEN = os.getenv('CITIZEN_APP_TOKEN')
CITIZEN_APP_TOKEN = "123"

app = Flask(__name__)

# Danh sách giả lập để lưu trữ thông tin
citizens = []

def get_db_connection():
    connection = psycopg2.connect(
        host='localhost',
        database='bigdata',
        user='app_user',
        password='password',
        port=5432
    )
    return connection

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/collect', methods=['POST'])
def collect_citizen():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get("name")
    date_of_birth = data.get("date_of_birth")
    citizen_code = data.get("citizen_code")

    if not name or not date_of_birth or not citizen_code:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "INSERT INTO citizens (name, date_of_birth, citizen_code) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, date_of_birth, citizen_code))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Citizen data collected successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT name, date_of_birth, citizen_code FROM citizens")
        citizens = [{"name": row[0], "date_of_birth": row[1], "citizen_code": row[2]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify(citizens)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete', methods=['DELETE'])
def delete_citizen():
    citizen_code = request.json.get('citizen_code')
    if not citizen_code:
        return jsonify({"error": "Citizen code is required"}), 400
    
    password = request.json.get('password')
    if not password:
        return jsonify({"error": "Password is required"}), 400
    
    if password != CITIZEN_APP_TOKEN:
        return jsonify({"error": "Password is incorrect"}), 400
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "DELETE FROM citizens WHERE citizen_code = %s"
        cursor.execute(query, (citizen_code,))
        connection.commit()
        cursor.close()
        connection.close()
        return '', 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8079)
