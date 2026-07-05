from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.database.db import mysql

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, username, rol, identificacion, nombre, genero FROM user WHERE username = %s AND password = %s", 
                    (data['username'], data['password']))
        user = cur.fetchone()
        cur.close()
        
        if user:
            token = create_access_token(identity={'username': user[1], 'role': user[2], 'identificacion': user[3]})
            return jsonify({
                'success': True, 'token': token, 'username': user[1], 'role': user[2], 
                'identificacion': user[3], 'nombre': user[4], 'genero': user[5]
            })
        return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/getAll', methods=['GET'])
@auth_bp.route('/getAllUsers', methods=['GET'])
def get_users():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, identificacion, correo, telefono, username, rol FROM user")
        resultado = cur.fetchall()
        cur.close()
        tabla = [{"id": r[0], "nombre": r[1], "identificacion": r[2], "correo": r[3], "telefono": r[4], "username": r[5], "rol": r[6]} for r in resultado]
        return jsonify(tabla)
    except Exception as e:
        return jsonify({"mensaje": str(e)}), 500

@auth_bp.route('/add_contact', methods=['POST'])
def add_user():
    try:
        data = request.json
        cur = mysql.connection.cursor()
        query = """
            INSERT INTO user (username, password, rol, nombre, identificacion, correo, telefono, genero, tipo_documento, historial_clinico)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (data['username'], data['password'], data['rol'], data['nombre'], data['identificacion'], data['correo'], data.get('telefono'), data.get('genero'), data.get('tipo_documento'), data.get('historial_clinico'))
        cur.execute(query, params)
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Registro exitoso"})
    except Exception as e:
        return jsonify({"informacion": str(e)}), 500

@auth_bp.route('/update/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        data = request.json
        cur = mysql.connection.cursor()
        
        # Build dynamic query
        fields = []
        values = []
        
        allowed_fields = ['nombre', 'rol', 'identificacion', 'correo', 'telefono', 'username', 'password']
        for field in allowed_fields:
            if field in data and data[field] != "":
                fields.append(f"{field} = %s")
                values.append(data[field])
                
        if not fields:
            return jsonify({"informacion": "No hay datos para actualizar"}), 400
            
        values.append(id)
        query = f"UPDATE user SET {', '.join(fields)} WHERE id = %s"
        
        cur.execute(query, tuple(values))
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Usuario actualizado correctamente"})
    except Exception as e:
        return jsonify({"informacion": str(e)}), 500

@auth_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM user WHERE id = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Usuario eliminado"})
    except Exception as e:
        return jsonify({"informacion": str(e)}), 500

@auth_bp.route('/getAllById/<id>', methods=['GET'])
def get_user_by_id(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, identificacion, correo, telefono, username, rol FROM user WHERE id = %s", (id,))
        r = cur.fetchone()
        cur.close()
        if r:
            return jsonify([{
                "id": r[0], "nombre": r[1], "identificacion": r[2], "correo": r[3], "telefono": r[4], "username": r[5], "rol": r[6]
            }])
        return jsonify([]), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@auth_bp.route('/my_profile', methods=['GET'])
def my_profile():
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username requerido"}), 400
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, identificacion, correo, telefono, username, rol, genero, tipo_documento, historial_clinico FROM user WHERE username = %s", (username,))
        r = cur.fetchone()
        cur.close()
        if r:
            return jsonify({
                "id": r[0], "nombre": r[1], "identificacion": r[2], "correo": r[3], "telefono": r[4], 
                "username": r[5], "rol": r[6], "genero": r[7], "tipo_documento": r[8], "historial_clinico": r[9]
            })
        return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/update_my_profile', methods=['PUT'])
def update_my_profile():
    try:
        data = request.json
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"informacion": "ID de usuario requerido"}), 400
        
        cur = mysql.connection.cursor()
        
        fields = []
        values = []
        
        # Un usuario normal no puede cambiar su rol
        allowed_fields = ['nombre', 'identificacion', 'correo', 'telefono', 'username', 'password', 'genero', 'tipo_documento', 'historial_clinico']
        for field in allowed_fields:
            if field in data and data[field] != "":
                fields.append(f"{field} = %s")
                values.append(data[field])
                
        if not fields:
            return jsonify({"informacion": "No hay datos para actualizar"}), 400
            
        values.append(user_id)
        query = f"UPDATE user SET {', '.join(fields)} WHERE id = %s"
        
        cur.execute(query, tuple(values))
        mysql.connection.commit()
        cur.close()
        return jsonify({"informacion": "Perfil actualizado correctamente"})
    except Exception as e:
        return jsonify({"informacion": str(e)}), 500
