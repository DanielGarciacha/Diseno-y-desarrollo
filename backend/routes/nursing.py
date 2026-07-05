from flask import Blueprint, request, jsonify
from backend.database.db import mysql
from datetime import date, datetime, timedelta

enf_bp = Blueprint('nursing', __name__)

@enf_bp.route('/citas_enfermeria', methods=['POST'])
def register_appointment():
    try:
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM user WHERE identificacion = %s", (data['identificacion'],))
        user = cur.fetchone()
        if not user: return jsonify({"informacion": "Estudiante no encontrado"}), 404
        
        cur.execute("INSERT INTO citas_enfermeria (estudiante_id, motivo, fecha, hora, sede) VALUES (%s, %s, %s, %s, %s)", 
                    (user[0], data['motivo'], data['fecha'], data['hora'], data['sede']))
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Cita registrada"})
    except Exception as e:
        return jsonify({"informacion": str(e)}), 500

@enf_bp.route('/getAll_enfer', methods=['GET'])
def get_all():
    try:
        cur = mysql.connection.cursor()
        query = """
            SELECT a.id, u.identificacion, u.nombre, u.correo, u.genero, a.motivo, a.fecha, a.hora, a.sede
            FROM citas_enfermeria a
            JOIN user u ON a.estudiante_id = u.id
            WHERE a.estado = 'Programada'
        """
        cur.execute(query)
        rv = cur.fetchall()
        cur.close()
        
        payload = []
        for r in rv:
            hora_str = str(r[7])
            if isinstance(r[7], timedelta):
                total = r[7].total_seconds()
                hora_str = f"{int(total//3600):02}:{int((total%3600)//60):02}"
            payload.append({
                'id': r[0], 'user_id': r[1], 'nombre_apellidos': r[2], 'correo': r[3], 
                'genero': r[4], 'motivo': r[5], 'fecha_reserva': r[6].strftime('%Y-%m-%d'), 
                'hora_reserva': hora_str, 'sede': r[8]
            })
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@enf_bp.route('/registrar_recomendacion_ef', methods=['POST'])
def register_recom():
    try:
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM user WHERE identificacion = %s", (data['id_enfermero'],))
        prof = cur.fetchone()
        cur.execute("SELECT id FROM user WHERE identificacion = %s", (data['id_estudiante'],))
        est = cur.fetchone()
        
        if not prof or not est: return jsonify({"message": "No encontrado"}), 404
        
        cur.execute("INSERT INTO recomendaciones_enfermeria (estudiante_id, enfermero_id, recomendacion) VALUES (%s, %s, %s)", 
                    (est[0], prof[0], data['recomendacion']))
        
        # Eliminar cita
        cur.execute("DELETE FROM citas_enfermeria WHERE estudiante_id = %s AND estado = 'Programada' LIMIT 1", (est[0],))
        
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Recomendación registrada"})
    except Exception as e:
        return jsonify({"message": str(e)}), 500
