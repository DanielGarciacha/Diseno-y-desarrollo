from flask import Blueprint, request, jsonify
from backend.database.db import mysql
from datetime import date, datetime, timedelta

common_bp = Blueprint('common', __name__)

@common_bp.route('/get_citas_by_id/<identificacion>', methods=['GET'])
def get_student_citas(identificacion):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM user WHERE identificacion = %s", (identificacion,))
        user = cur.fetchone()
        if not user: return jsonify([]), 200
        user_id = user[0]

        query = """
            SELECT 'Psicologia' as Tipo, id, sede, fecha, 'Atencion' as Info FROM citas_psicologia WHERE estudiante_id = %s
            UNION ALL
            SELECT 'Enfermeria' as Tipo, id, sede, fecha, 'Atencion' as Info FROM citas_enfermeria WHERE estudiante_id = %s
        """
        cur.execute(query, (user_id, user_id))
        rv = cur.fetchall()
        cur.close()
        
        payload = [{
            'Tipo_Cita': r[0], 'ID_De_Cita': r[1], 'sede': r[2], 
            'fecha': r[3].strftime('%Y-%m-%d'), 'Nombre_Completo': r[4]
        } for r in rv]
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route('/get_recommendations_by_id/<identificacion>', methods=['GET'])
def get_student_recoms(identificacion):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM user WHERE identificacion = %s", (identificacion,))
        user = cur.fetchone()
        if not user: return jsonify([]), 200
        user_id = user[0]

        query = """
            SELECT 'Psicologia', r.id, r.recomendacion, r.fecha, u.nombre
            FROM recomendaciones_psicologia r JOIN user u ON r.psicologo_id = u.id WHERE r.estudiante_id = %s
            UNION ALL
            SELECT 'Enfermeria', r.id, r.recomendacion, r.fecha, u.nombre
            FROM recomendaciones_enfermeria r JOIN user u ON r.enfermero_id = u.id WHERE r.estudiante_id = %s
        """
        cur.execute(query, (user_id, user_id))
        rv = cur.fetchall()
        cur.close()
        
        payload = [{
            'Tipo_Recomendacion': r[0], 'ID_De_Recomendacion': r[1], 'recomendacion': r[2], 
            'fecha': r[3].strftime('%Y-%m-%d'), 'Nombre_Profesional': r[4], 'Tipo_Profesional': 'Profesional'
        } for r in rv]
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route('/disponibilidad', methods=['GET'])
def check_availability():
    fecha = request.args.get('fecha')
    sede = request.args.get('sede')
    cur = mysql.connection.cursor()
    cur.execute("SELECT hora FROM citas_psicologia WHERE fecha = %s AND sede = %s", (fecha, sede))
    ocupadas = [str(r[0]) for r in cur.fetchall()]
    cur.execute("SELECT hora FROM citas_enfermeria WHERE fecha = %s AND sede = %s", (fecha, sede))
    ocupadas.extend([str(r[0]) for r in cur.fetchall()])
    cur.close()
    
    todas = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
    disponibles = [h for h in todas if h not in ocupadas]
    return jsonify({"horas_disponibles": disponibles})

@common_bp.route('/estadisticas_citas', methods=['GET'])
def stats():
    cur = mysql.connection.cursor()
    cur.execute("SELECT COUNT(*) FROM citas_psicologia")
    p = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM citas_enfermeria")
    e = cur.fetchone()[0]
    cur.close()
    return jsonify({"success": True, "total_psicologia": p, "total_enfermeria": e})

import pandas as pd
import io
from flask import send_file

@common_bp.route("/exportUsers", methods=["GET"])
def export_users():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, identificacion, correo, telefono, username, rol FROM user")
        resultado = cur.fetchall()
        cur.close()
        df = pd.DataFrame(resultado, columns=["ID", "Nombre", "Identificación", "Correo", "Teléfono", "Username", "Rol"])
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Usuarios')
        output.seek(0)
        return send_file(output, download_name="usuarios.xlsx", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/exportar_reporte_citas", methods=["GET"])
def export_citas_report():
    try:
        cur = mysql.connection.cursor()
        query = """
            SELECT 'Psicologia', u.nombre, a.sede, a.fecha, a.hora, a.motivo FROM citas_psicologia a JOIN user u ON a.estudiante_id = u.id
            UNION ALL
            SELECT 'Enfermeria', u.nombre, a.sede, a.fecha, a.hora, a.motivo FROM citas_enfermeria a JOIN user u ON a.estudiante_id = u.id
        """
        cur.execute(query)
        datos = cur.fetchall()
        datos_limpios = []
        for f in datos:
            f = list(f)
            if isinstance(f[4], timedelta):
                t = f[4].total_seconds()
                f[4] = f"{int(t//3600):02}:{int((t%3600)//60):02}"
            datos_limpios.append(f)
        df = pd.DataFrame(datos_limpios, columns=["Área", "Paciente", "Sede", "Fecha", "Hora", "Motivo"])
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Citas')
        output.seek(0)
        return send_file(output, download_name="reporte_citas.xlsx", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/exportar_reporte_recomendaciones", methods=["GET"])
def export_recom_report():
    try:
        cur = mysql.connection.cursor()
        query = """
            SELECT 'Psicologia', ue.nombre, up.nombre, cr.recomendacion, cr.fecha
            FROM recomendaciones_psicologia cr JOIN user ue ON cr.estudiante_id = ue.id JOIN user up ON cr.psicologo_id = up.id
            UNION ALL
            SELECT 'Enfermeria', ue.nombre, up.nombre, cr.recomendacion, cr.fecha
            FROM recomendaciones_enfermeria cr JOIN user ue ON cr.estudiante_id = ue.id JOIN user up ON cr.enfermero_id = up.id
        """
        cur.execute(query)
        datos = cur.fetchall()
        df = pd.DataFrame(datos, columns=["Área", "Paciente", "Especialista", "Recomendación", "Fecha"])
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Recomendaciones')
        output.seek(0)
        return send_file(output, download_name="reporte_recomendaciones.xlsx", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/get_actividades", methods=["GET"])
def get_actividades():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, categoria, tipo, equipo, icono, cupo_total, cupo_disponible FROM actividad")
        actividades = cur.fetchall()
        cur.close()
        
        result = []
        for a in actividades:
            result.append({
                "id": a[0],
                "nombre": a[1],
                "categoria": a[2],
                "tipo": a[3],
                "equipo": a[4],
                "icono": a[5],
                "cupo_total": a[6],
                "cupo_disponible": a[7]
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/get_inscripciones", methods=["GET"])
def get_inscripciones():
    try:
        cur = mysql.connection.cursor()
        query = """
            SELECT i.id, u.nombre, u.identificacion, a.nombre, i.semestre, i.sede, i.disponibilidad, i.experiencia, i.condicion_salud, i.fecha_inscripcion
            FROM inscripcion_actividad i
            JOIN user u ON i.estudiante_id = u.id
            JOIN actividad a ON i.actividad_id = a.id
            ORDER BY i.fecha_inscripcion DESC
        """
        cur.execute(query)
        inscripciones = cur.fetchall()
        cur.close()
        
        result = []
        for i in inscripciones:
            result.append({
                "id": i[0],
                "estudiante": i[1],
                "identificacion": i[2],
                "actividad": i[3],
                "semestre": i[4],
                "sede": i[5],
                "disponibilidad": i[6],
                "experiencia": i[7],
                "condicion": i[8],
                "fecha": i[9].strftime('%Y-%m-%d %H:%M:%S') if i[9] else ""
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/inscripcion_actividades", methods=["POST"])
def inscripcion_actividades():
    try:
        datos = request.json
        cur = mysql.connection.cursor()
        
        # Obtener estudiante_id a partir de la identificacion (si viene) o desde un campo username
        estudiante_id = None
        if 'identificacion' in datos:
            cur.execute("SELECT id FROM user WHERE identificacion = %s", (datos['identificacion'],))
            user_row = cur.fetchone()
            if user_row:
                estudiante_id = user_row[0]
        
        if not estudiante_id:
            # Fallback a un ID temporal para que no falle si no esta autenticado (en un entorno real usar JWT)
            cur.execute("SELECT id FROM user WHERE rol = 'estudiante' LIMIT 1")
            user_row = cur.fetchone()
            if user_row:
                estudiante_id = user_row[0]
            else:
                return jsonify({"error": "No hay estudiantes en la BD"}), 400

        actividades_nombres = datos.get('actividades', [])
        
        for nombre_actividad in actividades_nombres:
            # Buscar el id de la actividad
            cur.execute("SELECT id, cupo_disponible FROM actividad WHERE nombre = %s", (nombre_actividad,))
            act_row = cur.fetchone()
            if act_row and act_row[1] > 0:
                actividad_id = act_row[0]
                nuevo_cupo = act_row[1] - 1
                
                # Insertar inscripcion
                cur.execute("""
                    INSERT INTO inscripcion_actividad (estudiante_id, actividad_id, semestre, sede, disponibilidad, experiencia, condicion_salud)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (estudiante_id, actividad_id, datos.get('semestre'), datos.get('sede'), datos.get('disponibilidad'), datos.get('experiencia'), datos.get('condicion')))
                
                # Actualizar cupos
                cur.execute("UPDATE actividad SET cupo_disponible = %s WHERE id = %s", (nuevo_cupo, actividad_id))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({
            "success": True, 
            "informacion": "Inscripción registrada correctamente",
            "datos_recibidos": datos
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/crear_actividad", methods=["POST"])
def crear_actividad():
    try:
        datos = request.json
        cur = mysql.connection.cursor()
        
        nombre = datos.get("nombre")
        categoria = datos.get("categoria")
        tipo = datos.get("tipo", "")
        equipo = datos.get("equipo", "")
        icono = datos.get("icono", "fa-star")
        cupo_total = int(datos.get("cupo_total", 0))
        cupo_disponible = int(datos.get("cupo_disponible", cupo_total))
        
        cur.execute("""
            INSERT INTO actividad (nombre, categoria, tipo, equipo, icono, cupo_total, cupo_disponible)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nombre, categoria, tipo, equipo, icono, cupo_total, cupo_disponible))
        
        mysql.connection.commit()
        actividad_id = cur.lastrowid
        cur.close()
        
        return jsonify({
            "success": True, 
            "informacion": "Actividad creada correctamente",
            "id": actividad_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@common_bp.route("/actualizar_cupos/<int:actividad_id>", methods=["POST"])
def actualizar_cupos(actividad_id):
    try:
        datos = request.json
        cur = mysql.connection.cursor()
        
        cupo_total = int(datos.get("cupo_total"))
        cupo_disponible = int(datos.get("cupo_disponible"))
        
        cur.execute("""
            UPDATE actividad 
            SET cupo_total = %s, cupo_disponible = %s 
            WHERE id = %s
        """, (cupo_total, cupo_disponible, actividad_id))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({
            "success": True, 
            "informacion": "Cupos actualizados correctamente"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
