import os
from flask import Flask, render_template, redirect, url_for
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from dotenv import load_dotenv

# Cargar variables de entorno antes de importar modulos que las requieran
load_dotenv()

from backend.database.db import init_db

# Importar Blueprints
from backend.routes.auth import auth_bp
from backend.routes.psychology import psi_bp
from backend.routes.nursing import enf_bp
from backend.routes.common import common_bp

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
CORS(app)

# Configuración
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-jwt-secret-key-fallback')
app.secret_key = os.environ.get('SECRET_KEY', 'default-flask-secret-key-fallback')

# Inicializar Base de Datos y JWT
init_db(app)
jwt = JWTManager(app)

# Registro de Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(psi_bp)
app.register_blueprint(enf_bp)
app.register_blueprint(common_bp)

# --- RUTAS DE NAVEGACIÓN (FRONTEND) ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
@jwt_required()
def admin_page(): 
    return render_template('html/admin.html')

@app.route('/estudiante')
@jwt_required()
def estudiante_page(): 
    return render_template('html/estudiantes.html')

@app.route('/psicologos')
@jwt_required()
def psicologos_page(): 
    return render_template('html/psicologos.html')

@app.route('/enfermeria')
@jwt_required()
def enfermeria_page(): 
    return render_template('html/enfermeria.html')

@app.route('/bienestar')
@jwt_required()
def bienestar_page(): 
    return render_template('html/bienestar.html')

@app.route('/recom_psicologo')
@jwt_required()
def recom_psi_page(): 
    return render_template('html/recom_psicologo.html')

@app.route('/recom_enfermeria')
@jwt_required()
def recom_enf_page(): 
    return render_template('html/recom_enfermeria.html')

@app.route('/actividades')
@jwt_required()
def actividades_page(): 
    return render_template('html/actividades.html')

@app.route('/encargado_actividades')
@jwt_required()
def encargado_actividades_page(): 
    return render_template('html/encargado_actividades.html')

if __name__ == "__main__":
    app.run(port=3000, debug=True)
