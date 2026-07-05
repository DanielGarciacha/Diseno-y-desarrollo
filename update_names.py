from backend.database.db import mysql
from app import app

users = [
    ('admin1', 'Carlos Gonzalez'),
    ('admin2', 'Laura Ramirez'),
    ('estudiante1', 'Juan Perez'),
    ('estudiante2', 'Maria Lopez'),
    ('psicologo1', 'Pedro Gomez'),
    ('psicologo2', 'Ana Torres'),
    ('enfermero1', 'Luis Martinez'),
    ('enfermero2', 'Sofia Fernandez'),
    ('actividades1', 'Carlos Ruiz'),
    ('actividades2', 'Elena Castro')
]

with app.app_context():
    cur = mysql.connection.cursor()
    for username, nombre in users:
        cur.execute("UPDATE user SET nombre = %s WHERE username = %s", (nombre, username))
    mysql.connection.commit()
    cur.close()
    print("Nombres actualizados exitosamente.")
