import MySQLdb
from datetime import datetime, timedelta

config = {
    'host': 'bmep98y36qqqhmgejg4m-mysql.services.clever-cloud.com',
    'user': 'u4acqco7y9j4mxli',
    'password': 'aEylWzlm48xTommJxiFo',
    'db': 'bmep98y36qqqhmgejg4m',
    'port': 3306
}

def reset_db():
    conn = MySQLdb.connect(**config)
    cursor = conn.cursor()

    # Drop tables if they exist
    tables = [
        "inscripcion_actividad",
        "actividad",
        "recomendaciones_enfermeria",
        "recomendaciones_psicologia",
        "citas_enfermeria",
        "citas_psicologia",
        "user"
    ]
    for table in tables:
        cursor.execute(f"DROP TABLE IF EXISTS {table}")
        print(f"Dropped {table}")

    # Create user table
    cursor.execute("""
    CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        rol VARCHAR(20) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        identificacion VARCHAR(20) UNIQUE NOT NULL,
        correo VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        genero VARCHAR(10),
        tipo_documento VARCHAR(20),
        historial_clinico TEXT
    )
    """)
    print("Created user table")

    # Create citas_psicologia
    cursor.execute("""
    CREATE TABLE citas_psicologia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        sede VARCHAR(50) NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        motivo TEXT,
        estado VARCHAR(20) DEFAULT 'Programada',
        FOREIGN KEY (estudiante_id) REFERENCES user(id) ON DELETE CASCADE
    )
    """)
    
    # Create citas_enfermeria
    cursor.execute("""
    CREATE TABLE citas_enfermeria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        sede VARCHAR(50) NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        motivo TEXT,
        estado VARCHAR(20) DEFAULT 'Programada',
        FOREIGN KEY (estudiante_id) REFERENCES user(id) ON DELETE CASCADE
    )
    """)

    # Create recomendaciones_psicologia
    cursor.execute("""
    CREATE TABLE recomendaciones_psicologia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        psicologo_id INT NOT NULL,
        recomendacion TEXT NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (estudiante_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (psicologo_id) REFERENCES user(id) ON DELETE CASCADE
    )
    """)

    # Create recomendaciones_enfermeria
    cursor.execute("""
    CREATE TABLE recomendaciones_enfermeria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        enfermero_id INT NOT NULL,
        recomendacion TEXT NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (estudiante_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (enfermero_id) REFERENCES user(id) ON DELETE CASCADE
    )
    """)

    # Create actividad
    cursor.execute("""
    CREATE TABLE actividad (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        tipo VARCHAR(50),
        equipo VARCHAR(100),
        icono VARCHAR(50),
        cupo_total INT NOT NULL,
        cupo_disponible INT NOT NULL
    )
    """)
    print("Created actividad table")

    # Create inscripcion_actividad
    cursor.execute("""
    CREATE TABLE inscripcion_actividad (
        id INT AUTO_INCREMENT PRIMARY KEY,
        estudiante_id INT NOT NULL,
        actividad_id INT NOT NULL,
        semestre VARCHAR(20),
        sede VARCHAR(50),
        disponibilidad VARCHAR(50),
        experiencia TEXT,
        condicion_salud TEXT,
        fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudiante_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (actividad_id) REFERENCES actividad(id) ON DELETE CASCADE
    )
    """)
    print("Created inscripcion_actividad table")

    # Populate users (2 of each role)
    users = [
        ('admin1', 'admin123', 'admin', 'Carlos Gonzalez', '1000000001', 'admin1@uni.edu.co', '3000000001', 'M', 'CC', None),
        ('admin2', 'admin123', 'admin', 'Laura Ramirez', '1000000002', 'admin2@uni.edu.co', '3000000002', 'F', 'CC', None),
        ('estudiante1', 'estudiante123', 'estudiante', 'Juan Perez', '1000000003', 'juan@uni.edu.co', '3000000003', 'M', 'CC', 'Alergia al maní'),
        ('estudiante2', 'estudiante123', 'estudiante', 'Maria Lopez', '1000000004', 'maria@uni.edu.co', '3000000004', 'F', 'CC', 'Asma leve'),
        ('psicologo1', 'psicologo123', 'psicologo', 'Pedro Gomez', '1000000005', 'pedro@uni.edu.co', '3000000005', 'M', 'CC', None),
        ('psicologo2', 'psicologo123', 'psicologo', 'Ana Torres', '1000000006', 'ana@uni.edu.co', '3000000006', 'F', 'CC', None),
        ('enfermero1', 'enfermero123', 'enfermeria', 'Luis Martinez', '1000000007', 'luis@uni.edu.co', '3000000007', 'M', 'CC', None),
        ('enfermero2', 'enfermero123', 'enfermeria', 'Sofia Fernandez', '1000000008', 'sofia@uni.edu.co', '3000000008', 'F', 'CC', None),
        ('actividades1', 'actividades123', 'actividades', 'Carlos Ruiz', '1000000009', 'carlos@uni.edu.co', '3000000009', 'M', 'CC', None),
        ('actividades2', 'actividades123', 'actividades', 'Elena Castro', '1000000010', 'elena@uni.edu.co', '3000000010', 'F', 'CC', None)
    ]

    cursor.executemany("""
    INSERT INTO user (username, password, rol, nombre, identificacion, correo, telefono, genero, tipo_documento, historial_clinico)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, users)
    print("Inserted users")

    # Populate activities
    activities = [
        ('Fútbol', 'sport', 'deportiva', 'Equipo de Fútbol', 'fa-futbol', 30, 20),
        ('Voleibol', 'sport', 'deportiva equipo', 'Equipo de Voleibol', 'fa-volleyball-ball', 20, 5),
        ('Baloncesto', 'sport', 'deportiva equipo', 'Equipo de Baloncesto', 'fa-basketball-ball', 25, 0),
        ('Natación', 'sport', 'deportiva', None, 'fa-swimmer', 15, 10),
        ('Teatro', 'cultural', 'cultural', None, 'fa-theater-masks', 20, 15),
        ('Banda Musical', 'cultural', 'cultural', None, 'fa-music', 40, 12),
        ('Ajedrez', 'wellness', 'cultural equipo', 'Club de Ajedrez', 'fa-chess', 10, 8),
        ('Fotografía', 'cultural', 'cultural', None, 'fa-camera', 15, 2)
    ]
    cursor.executemany("""
    INSERT INTO actividad (nombre, categoria, tipo, equipo, icono, cupo_total, cupo_disponible)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, activities)
    print("Inserted activities")

    # Populate some citations
    today = datetime.now().date()
    cursor.execute("""
    INSERT INTO citas_psicologia (estudiante_id, sede, fecha, hora, motivo) VALUES
    (3, 'Principal', %s, '10:00', 'Ansiedad por examenes'),
    (4, 'Norte', %s, '14:00', 'Orientacion vocacional')
    """, (today + timedelta(days=1), today + timedelta(days=2)))

    cursor.execute("""
    INSERT INTO citas_enfermeria (estudiante_id, sede, fecha, hora, motivo) VALUES
    (3, 'Sur', %s, '08:00', 'Chequeo general'),
    (4, 'Principal', %s, '09:00', 'Vacunacion')
    """, (today + timedelta(days=1), today + timedelta(days=3)))

    # Populate recommendations
    cursor.execute("""
    INSERT INTO recomendaciones_psicologia (estudiante_id, psicologo_id, recomendacion, fecha) VALUES
    (3, 5, 'Realizar pausas activas cada hora. Ejercicios de respiracion.', %s),
    (4, 6, 'Continuar con las tecnicas de manejo del tiempo.', %s)
    """, (today, today - timedelta(days=5)))

    cursor.execute("""
    INSERT INTO recomendaciones_enfermeria (estudiante_id, enfermero_id, recomendacion, fecha) VALUES
    (3, 7, 'Mantener hidratacion adecuada y tomar medicamento prescrito.', %s),
    (4, 8, 'Reposo por 2 dias y aplicar fomentos calientes.', %s)
    """, (today - timedelta(days=1), today - timedelta(days=7)))

    conn.commit()
    cursor.close()
    conn.close()
    print("Database reset complete.")

if __name__ == '__main__':
    reset_db()
