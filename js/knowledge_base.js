// v2.0 - 40 condiciones: 20 Enfermería + 20 Psicología

const KNOWLEDGE_BASE = {
  version: "2.0",
  modulos: {
    enfermeria: {
      nombre: "Enfermeria",
      condiciones: [
        {
          id: "ENF-001", nombre: "Resfriado Comun",
          sinonimos: ["catarro", "congestion nasal", "gripe leve", "moquera", "resfrio", "rinitis", "mocos"],
          sintomas: ["congestion nasal", "moco claro", "moco amarillento", "irritacion garganta", "raspado garganta", "estornudos frecuentes", "malestar general leve", "temperatura levemente elevada", "tos seca", "tos con flema leve", "lagrimeo", "perdida leve del apetito", "voz ronca", "dolor de cabeza leve", "inicio gradual"],
          diagnostico_sugerido: "Infeccion viral de vias respiratorias altas (resfriado comun)",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria en las proximas 24 a 48 horas. Reposo, hidratacion y vitamina C. Derivar si fiebre sube o persiste mas de 7 dias."
        },
        {
          id: "ENF-002", nombre: "Gripe (Influenza)",
          sinonimos: ["influenza", "gripe fuerte", "fiebre alta con tos", "flu", "gripa", "gripas"],
          sintomas: ["fiebre alta", "fiebre mayor a 38", "fiebre brusca", "escalofrios intensos", "dolor muscular generalizado", "cefalea frontal", "cansancio extremo", "tos seca persistente", "congestion nasal", "dolor de garganta", "sudoracion profusa", "perdida del apetito", "nauseas", "vomitos", "inicio abrupto"],
          diagnostico_sugerido: "Influenza estacional",
          urgencia: "media",
          accion: "Agendar cita de enfermeria el mismo dia. Aislamiento preventivo. Si fiebre supera 39.5 grados o persiste mas de 5 dias, derivar a urgencias medicas."
        },
        {
          id: "ENF-003", nombre: "Cefalea Tensional",
          sinonimos: ["dolor de cabeza", "cabeza apretada", "jaqueca por estres", "cefalea por postura", "dolor cabeza tension", "presion en la cabeza"],
          sintomas: ["dolor de cabeza tipo presion", "banda apretando la cabeza", "dolor bilateral", "dolor en nuca", "tension en cuello", "rigidez cuello", "tension en hombros", "dolor leve a moderado", "frente a pantalla", "periodo de examenes", "no empeora con actividad", "sensibilidad leve al ruido", "mejora con masaje"],
          diagnostico_sugerido: "Cefalea tensional por carga academica y postura inadecuada",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria. Pausas activas cada hora, correccion de postura e hidratacion. Derivar a neurologo si es recurrente mas de 3 veces por semana."
        },
        {
          id: "ENF-004", nombre: "Migraña",
          sinonimos: ["jaqueca", "dolor de cabeza pulsatil", "migrana con aura", "hemicranea", "migraña", "jaqueca intensa"],
          sintomas: ["dolor pulsatil", "dolor palpitante", "dolor unilateral", "nauseas", "vomitos", "fotofobia", "sensibilidad a la luz", "fonofobia", "sensibilidad al ruido", "empeora con movimiento", "duracion 4 a 72 horas", "aura visual", "destellos luminosos", "puntos ciegos", "hormigueo en cara", "mareo", "vertigo"],
          diagnostico_sugerido: "Posible migraña episodica - requiere evaluacion medica",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. Derivar a medico o neurologo. Si es el primer episodio muy severo o hay rigidez de nuca, derivar urgente."
        },
        {
          id: "ENF-005", nombre: "Gastritis Aguda",
          sinonimos: ["dolor de estomago", "acidez", "ardor gastrico", "malestar digestivo", "estomago inflamado", "gastritis", "reflujo", "acido"],
          sintomas: ["ardor epigastrio", "dolor boca del estomago", "dolor antes de comer", "dolor despues de comer", "nauseas", "llenura rapida", "acidez", "reflujo", "eructos frecuentes", "perdida de apetito", "vomitos", "omitir comidas", "comer a deshoras", "alcohol", "cafe", "comida picante", "antiinflamatorios", "estres"],
          diagnostico_sugerido: "Gastritis aguda por habitos alimentarios inadecuados o estres",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. Si hay sangre en vomito o heces negras, ir a urgencias inmediatamente. Comidas regulares y evitar irritantes."
        },
        {
          id: "ENF-006", nombre: "Sindrome de Intestino Irritable",
          sinonimos: ["colon irritable", "dolor de colon", "intestino irritable", "problema de colon", "SII", "colon sensible"],
          sintomas: ["dolor abdominal recurrente", "dolor mejora al defecar", "cambios frecuencia deposiciones", "cambios consistencia heces", "distension abdominal", "gases", "urgencia para defecar", "evacuacion incompleta", "mucosidad en heces", "empeora con estres", "mas de 3 meses"],
          diagnostico_sugerido: "Posible Sindrome de Intestino Irritable (SII)",
          urgencia: "baja",
          accion: "Agendar cita con enfermeria y derivar a medico. Manejo del estres y dieta. Si hay sangre en heces o perdida de peso, urgente."
        },
        {
          id: "ENF-007", nombre: "Contractura Muscular y Lumbalgia",
          sinonimos: ["dolor de espalda", "tension muscular", "cuello rigido", "contractura", "dolor lumbar", "espalda rigida", "cervicalgia"],
          sintomas: ["dolor localizado cuello", "dolor espalda alta", "dolor espalda baja", "rigidez muscular al despertar", "dolor sentado mas de 2 horas", "nudo en el musculo", "dificultad girar cuello", "dificultad doblar espalda", "mejora con calor", "postura encorvada", "tension trapecio", "tension hombros"],
          diagnostico_sugerido: "Contractura muscular o lumbalgia postural",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria. Ejercicios de estiramiento y pausas activas. Derivar a fisioterapia si persiste mas de 2 semanas."
        },
        {
          id: "ENF-008", nombre: "Conjuntivitis",
          sinonimos: ["ojo rojo", "ojo irritado", "infeccion ocular", "ojo pegado", "ojos rojos", "infeccion de ojo"],
          sintomas: ["ojo rojo", "ojo rosado", "secrecion amarilla ojo", "secrecion verde ojo", "secrecion transparente", "picazon ocular", "ardor ocular", "sensacion arenilla", "cuerpo extrano ojo", "lagrimeo excesivo", "parpados pegados", "inflamacion parpado", "sensibilidad a la luz"],
          diagnostico_sugerido: "Conjuntivitis viral, bacteriana o alergica",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. No tocarse los ojos. No compartir objetos personales. No usar lentes de contacto."
        },
        {
          id: "ENF-009", nombre: "Infeccion Urinaria (Cistitis)",
          sinonimos: ["cistitis", "ardor al orinar", "infeccion de vejiga", "infeccion urinaria", "cistitis aguda", "ardor orina"],
          sintomas: ["ardor al orinar", "disuria", "urgencia urinaria", "orinar muy seguido", "orina turbia", "orina mal olor", "orina oscura", "dolor parte baja abdomen", "presion pelvis", "vejiga llena", "sangre en orina", "hematuria", "fiebre leve"],
          diagnostico_sugerido: "Infeccion del tracto urinario bajo (cistitis aguda)",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy para toma de muestra. Si hay fiebre alta y dolor lumbar, derivar urgente por posible pielonefritis."
        },
        {
          id: "ENF-010", nombre: "Anemia Ferropenica",
          sinonimos: ["anemia", "falta de hierro", "sangre baja", "hemoglobina baja", "anemia por hierro"],
          sintomas: ["cansancio persistente", "fatiga sin causa", "palidez en piel", "palidez labios", "palpitaciones", "corazon acelerado", "mareos frecuentes", "mareo al levantarse", "dolor de cabeza recurrente", "falta de concentracion", "falta de aire", "manos frias", "pies frios", "unas fragiles", "deseo de comer hielo"],
          diagnostico_sugerido: "Posible anemia ferropenica - requiere hemograma",
          urgencia: "media",
          accion: "Agendar cita de enfermeria. Solicitar hemograma completo. Derivar a medico para suplemento de hierro."
        },
        {
          id: "ENF-011", nombre: "Dermatitis",
          sinonimos: ["eczema", "piel irritada", "alergia en la piel", "sarpullido", "piel seca con picazon", "dermatitis", "alergia cutanea"],
          sintomas: ["picazon intensa piel", "prurito", "enrojecimiento", "piel seca", "piel descamada", "ronchas", "placas rojizas", "piel engrosada", "costras por rascado", "ampollas pequenas", "empeora con calor", "empeora con sudor", "empeora con estres"],
          diagnostico_sugerido: "Dermatitis atopica o de contacto",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria. Evitar rascado. Derivar a dermatologo si es extenso."
        },
        {
          id: "ENF-012", nombre: "Acne Severo",
          sinonimos: ["granitos severos", "acne inflamatorio", "acne quistica", "barros grandes", "acne", "barros dolorosos"],
          sintomas: ["puntos negros", "puntos blancos", "comedones", "papulas rojas inflamadas", "pustulas con pus", "nodulos profundos", "quistes dolorosos", "piel grasa", "cicatrices", "manchas rojizas", "empeora con estres", "afecta autoestima"],
          diagnostico_sugerido: "Acne inflamatorio moderado a severo",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria. Derivar a dermatologo. Valorar impacto emocional y derivar a psicologia si afecta autoestima."
        },
        {
          id: "ENF-013", nombre: "Asma Bronquial",
          sinonimos: ["asma", "broncoespasmo", "silbido en el pecho", "dificultad respiratoria recurrente", "pito en el pecho", "asma bronquial"],
          sintomas: ["dificultad para respirar episodios", "silbidos al respirar", "sibilancias", "tos seca nocturna", "opresion en el pecho", "empeora con ejercicio", "empeora con polvo", "mejora con inhalador", "broncodilatador", "cambios de clima", "alergia rinitis antecedente"],
          diagnostico_sugerido: "Posible asma bronquial - requiere espirometria",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. Si hay crisis aguda severa, ir a urgencias. Derivar a medico para espirometria e inhalador."
        },
        {
          id: "ENF-014", nombre: "Hipertension Arterial",
          sinonimos: ["presion alta", "hipertension", "tension alta", "presion elevada", "tension arterial alta"],
          sintomas: ["dolor de cabeza en nuca", "dolor nuca manana", "zumbido oidos", "tinnitus", "vision borrosa", "mareos frecuentes", "palpitaciones", "rubor facial", "cara roja", "cansancio sin justificacion", "dificultad respirar", "presion 140 90"],
          diagnostico_sugerido: "Posible hipertension arterial - requiere evaluacion medica",
          urgencia: "media",
          accion: "Agendar cita de enfermeria para toma de presion. Si presion mayor a 180/110, derivar a urgencias."
        },
        {
          id: "ENF-015", nombre: "Hipoglucemia",
          sinonimos: ["azucar baja", "desmayo por no comer", "baja de azucar", "mareo por hambre", "glucosa baja", "hipoglucemia"],
          sintomas: ["temblor manos", "temblor cuerpo", "sudoracion fria repentina", "sensacion de mareo", "palpitaciones rapidas", "palidecer", "hambre intensa urgente", "irritabilidad brusca", "dificultad concentrarse repentina", "vision borrosa transitoria", "debilidad piernas", "no comer hace horas", "mejora al comer dulce"],
          diagnostico_sugerido: "Hipoglucemia reactiva por ayuno o habitos alimentarios irregulares",
          urgencia: "media",
          accion: "Asistir a enfermeria de inmediato para toma de glucemia. Dar azucar rapida. Si hay perdida de consciencia, llamar emergencias."
        },
        {
          id: "ENF-016", nombre: "Mareo y Lipotimia",
          sinonimos: ["casi desmayo", "presion baja", "mareo al pararse", "sensacion de desmayo", "hipotension ortostatica", "casi me desmayo", "vahido"],
          sintomas: ["mareo intenso al levantarse", "todo da vueltas", "vision oscura al levantarse", "vision con puntitos", "debilidad repentina", "sudoracion fria", "nausea leve", "palidez repentina", "zumbido momentaneo", "necesidad sentarse", "poco descanso", "deshidratacion", "ayuno"],
          diagnostico_sugerido: "Lipotimia vasovagal o hipotension ortostatica",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. Hidratacion y no levantarse bruscamente. Si hay perdida de conciencia, activar emergencias."
        },
        {
          id: "ENF-017", nombre: "Herida o Lesion Traumatica Menor",
          sinonimos: ["cortadura", "rasguño", "golpe", "hematoma", "herida leve", "torcedura", "esguince leve", "cortada", "morado"],
          sintomas: ["herida superficial", "sangrado leve", "sangrado moderado", "rasguño", "abrasion en piel", "hematoma", "morado por golpe", "dolor localizado lesion", "inflamacion leve", "calor local", "dificultad mover zona afectada", "sangrado controlable con presion"],
          diagnostico_sugerido: "Lesion traumatica menor: herida, contusion o esguince",
          urgencia: "baja",
          accion: "Asistir a enfermeria para curacion y vendaje. Si herida es profunda o sangrado abundante, derivar a urgencias."
        },
        {
          id: "ENF-018", nombre: "Dismenorrea (Dolor Menstrual)",
          sinonimos: ["dolor de la regla", "colicos menstruales", "dolor periodo", "crampos menstruales", "colicos", "regla dolorosa", "menstruacion dolorosa"],
          sintomas: ["dolor calambriforme", "dolor tipo colico", "abdomen bajo", "inicio el primer dia menstruacion", "dolor irradia espalda", "nauseas ciclo", "vomitos ciclo", "diarrea periodo", "estreñimiento periodo", "dolor de cabeza ciclo", "fatiga aumentada", "irritabilidad premenstrual", "inflamacion abdominal"],
          diagnostico_sugerido: "Dismenorrea primaria o secundaria",
          urgencia: "baja",
          accion: "Agendar cita de enfermeria para valoracion y manejo del dolor. Si es incapacitante, derivar a ginecologia."
        },
        {
          id: "ENF-019", nombre: "Bronquitis Aguda",
          sinonimos: ["tos con flema", "bronquitis", "catarro de pecho", "inflamacion de bronquios", "bronquitis aguda", "pecho cargado"],
          sintomas: ["tos persistente mas de 5 dias", "expectoracion", "flema blanca", "flema amarilla", "flema verde", "opresion pecho", "fiebre moderada", "cansancio malestar general", "silbido leve al respirar", "ronquera", "inicio tras resfriado", "dolor detras esternon al toser"],
          diagnostico_sugerido: "Bronquitis aguda de probable origen viral o bacteriano",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy. Derivar a medico si hay sospecha bacteriana. Si hay dificultad respiratoria, urgente."
        },
        {
          id: "ENF-020", nombre: "Faringitis o Amigdalitis",
          sinonimos: ["infeccion de garganta", "anginas", "dolor de garganta severo", "garganta inflamada", "amigdalitis", "faringitis", "dolor al tragar"],
          sintomas: ["dolor de garganta intenso al tragar", "garganta roja", "garganta inflamada", "amigdalas inflamadas", "placas en amigdalas", "pus en garganta", "fiebre alta", "ganglios inflamados", "ganglios dolorosos", "mal aliento", "voz apagada", "dificultad abrir boca", "perdida del apetito por dolor"],
          diagnostico_sugerido: "Faringoamigdalitis viral o bacteriana",
          urgencia: "media",
          accion: "Agendar cita de enfermeria hoy para valoracion y posible hisopado. Derivar a medico para definir si requiere antibioticos."
        }
      ]
    },
    psicologia: {
      nombre: "Psicologia",
      condiciones: [
        {
          id: "PSI-001", nombre: "Estres Academico Situacional",
          sinonimos: ["estres por examenes", "presion academica", "agotamiento por estudio", "ansiedad de parciales", "estres parciales", "nervios examen", "angustia por notas"],
          sintomas: ["tension muscular examenes", "dificultad concentrarse en clase", "irritabilidad en temporada de parciales", "problemas para dormir antes de evaluaciones", "tiempo no alcanza", "dolores de cabeza en examenes", "fatiga a pesar de dormir", "procrastinacion", "culpa intensa", "bloqueo mental", "descuido alimentacion por estudio", "asociado al calendario academico"],
          diagnostico_sugerido: "Estres academico situacional",
          urgencia: "baja",
          accion: "Agendar cita con psicologia para tecnicas de manejo del tiempo, relajacion y estrategias de estudio efectivas."
        },
        {
          id: "PSI-002", nombre: "Trastorno de Ansiedad Generalizada",
          sinonimos: ["ansiedad cronica", "preocupacion constante", "nerviosismo permanente", "ansiedad sin causa", "TAG", "ansiedad generalizada", "siempre ansioso"],
          sintomas: ["preocupacion excesiva multiple areas", "preocupacion casi todos los dias", "tension muscular cronica", "dificultad conciliar sueno", "irritabilidad constante", "fatiga cronica", "dificultad concentrarse", "mente en blanco", "sensacion que algo malo va a suceder", "inquietud interior", "molestias fisicas sin causa organica", "interfiere con desempeno academico"],
          diagnostico_sugerido: "Posible Trastorno de Ansiedad Generalizada (TAG)",
          urgencia: "media",
          accion: "Agendar cita prioritaria con psicologia universitaria. Terapia cognitivo-conductual es el tratamiento de primera eleccion."
        },
        {
          id: "PSI-003", nombre: "Trastorno de Panico",
          sinonimos: ["crisis de panico", "ataque de ansiedad", "crisis de angustia", "miedo intenso repentino", "ataque de panico", "crisis ansiedad"],
          sintomas: ["episodio brusco de miedo", "malestar intenso", "palpitaciones taquicardia", "sudoracion intensa fria", "temblores", "falta de aire", "ahogo", "dolor pecho", "nauseas malestar abdominal", "mareo desmayo inminente", "irrealidad", "desconectado del cuerpo", "despersonalizacion", "miedo a morir", "miedo perder el control", "ansiedad anticipatoria", "evitar lugares"],
          diagnostico_sugerido: "Posible Trastorno de Panico - requiere evaluacion urgente",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Agendar cita con psicologia hoy. Si el episodio esta ocurriendo, ir a enfermeria. Respiracion diafragmatica lenta: inhala 4s, retiene 4s, exhala 6s."
        },
        {
          id: "PSI-004", nombre: "Episodio Depresivo Mayor",
          sinonimos: ["depresion", "tristeza profunda", "anhedonia", "desgano total", "melancosia", "me siento vacio", "sin ganas de nada", "deprimido"],
          sintomas: ["animo deprimido", "tristeza casi todos los dias", "perdida de interes", "perdida de placer", "anhedonia", "cambios en el apetito", "perdida de peso", "aumento de peso", "insomnio", "hipersomnia", "dormir demasiado", "fatiga perdida de energia", "inutilidad", "culpa excesiva", "dificultad pensar", "dificultad concentrarse", "llanto frecuente", "aislamiento social", "2 semanas de sintomas"],
          diagnostico_sugerido: "Posible Episodio Depresivo Mayor - requiere atencion urgente",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Agendar cita con psicologia hoy mismo. Si hay pensamientos de hacerse dano, llama a la linea de crisis de Bienestar o ext. 100."
        },
        {
          id: "PSI-005", nombre: "Ansiedad Social",
          sinonimos: ["miedo a hablar en publico", "timidez extrema", "miedo a ser juzgado", "fobia social", "verguenza patologica", "pavor social"],
          sintomas: ["miedo situaciones sociales", "miedo a ser evaluado", "miedo hablar en publico", "miedo exponer", "miedo trabajar en grupo", "miedo participar en clase", "evitacion situaciones sociales", "ansiedad anticipatoria exposiciones", "rubor al hablar", "temblor de voz", "temblor de manos", "nauseas antes de situaciones sociales", "sudoracion excesiva frente a grupos"],
          diagnostico_sugerido: "Posible Trastorno de Ansiedad Social (Fobia Social)",
          urgencia: "media",
          accion: "Agendar cita con psicologia. La terapia cognitivo-conductual con exposicion gradual es muy efectiva."
        },
        {
          id: "PSI-006", nombre: "Burnout Academico",
          sinonimos: ["agotamiento total", "burnout estudiantil", "desgaste academico", "queme academico", "burn out", "burnout", "quemado academicamente"],
          sintomas: ["agotamiento emocional profundo", "cinismo hacia las materias", "indiferencia hacia la carrera", "esfuerzos no sirven para nada", "baja eficacia academica", "dolores de cabeza recurrentes", "molestias gastrointestinales sin causa", "insomnio persistente", "distanciamiento de companeros", "irritabilidad intensa temas estudio", "ausentismo academico", "perdida sentido por la carrera", "varios meses consecutivos"],
          diagnostico_sugerido: "Posible Sindrome de Burnout Academico",
          urgencia: "media",
          accion: "Agendar cita con psicologia urgente. Evaluar carga academica y estrategias de autocuidado."
        },
        {
          id: "PSI-007", nombre: "Insomnio Cronico",
          sinonimos: ["no puedo dormir", "falta de sueno cronica", "dificultad para dormir", "sueno malo constante", "insomnio", "me desvelo", "no duermo bien"],
          sintomas: ["dificultad conciliar sueno", "tarda mas de 30 minutos", "despertares frecuentes noche", "despertar muy temprano", "sueno no reparador", "fatiga somnolencia diurna", "dificultad concentrarse por falta de sueno", "memoria reducida", "irritabilidad por falta sueno", "ansiedad por no poder dormir", "uso movil en cama", "3 noches por semana mas de 3 meses"],
          diagnostico_sugerido: "Insomnio cronico primario o asociado a ansiedad o depresion",
          urgencia: "media",
          accion: "Agendar cita con psicologia para higiene del sueno e identificacion de causa subyacente."
        },
        {
          id: "PSI-008", nombre: "TDAH en Adultos",
          sinonimos: ["deficit de atencion adulto", "hiperactividad adultos", "no puedo concentrarme cronica", "TDAH no diagnosticado", "ADD adultos", "deficit atencion"],
          sintomas: ["dificultad mantener atencion en tareas largas", "se distrae extremadamente facil", "olvida compromisos frecuentes", "olvida fechas", "dificultad organizar tareas", "pospone tareas indefinidamente", "inquietud interna constante", "habla excesiva", "interrumpe conversaciones", "impulsividad en decisiones", "comenzar muchos proyectos sin terminar", "hiperfoco actividades interes", "problemas desde la infancia", "bajo rendimiento academico"],
          diagnostico_sugerido: "Posible TDAH en adulto - requiere evaluacion neuropsicologica formal",
          urgencia: "baja",
          accion: "Agendar cita con psicologia para evaluacion. Puede requerir derivacion a neuropsiquiatria."
        },
        {
          id: "PSI-009", nombre: "Trastorno Obsesivo Compulsivo",
          sinonimos: ["TOC", "pensamientos repetitivos", "rituales compulsivos", "obsesiones y compulsiones", "OCD", "obsesiones", "compulsiones"],
          sintomas: ["pensamientos intrusos repetitivos", "miedo excesivo germenes", "miedo suciedad", "miedo enfermedades", "duda puertas abiertas", "duda gas encendido", "pensamientos agresivos involuntarios", "necesidad simetria orden", "lavarse manos repetidamente", "revisar puertas multiples veces", "contar objetos", "repetir acciones", "reconoce que es irracional pero no puede parar", "consume mas de 1 hora diaria"],
          diagnostico_sugerido: "Posible Trastorno Obsesivo Compulsivo (TOC)",
          urgencia: "media",
          accion: "Agendar cita con psicologia. La terapia de exposicion con prevencion de respuesta (EPR) es el tratamiento mas efectivo."
        },
        {
          id: "PSI-010", nombre: "Estres Postraumatico",
          sinonimos: ["trauma", "TEPT", "PTSD", "estres por trauma", "flashbacks", "pesadillas recurrentes por evento", "trauma psicologico"],
          sintomas: ["recuerdos intrusivos evento traumatico", "flashbacks", "pesadillas recurrentes trauma", "angustia al recordar", "evitacion personas relacionadas al trauma", "evitacion lugares relacionados al trauma", "amnesia parcial", "creencias negativas sobre uno mismo", "incapacidad emociones positivas", "embotamiento emocional", "hipervigilancia", "respuesta sobresalto exagerada", "dificultad concentrarse", "irritabilidad arrebatos ira", "evento traumatico claro"],
          diagnostico_sugerido: "Posible Trastorno por Estres Postraumatico (TEPT)",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Agendar cita con psicologia universitaria. Requiere terapia trauma-focalizada. Si hay ideacion suicida, activar protocolo de crisis ext. 100."
        },
        {
          id: "PSI-011", nombre: "Trastorno Bipolar",
          sinonimos: ["bipolar", "cambios de humor extremos", "mania y depresion", "estados euforia y tristeza alternados", "trastorno bipolar"],
          sintomas: ["tristeza profunda dias semanas", "perdida energia e interes", "hipersomnia", "lentitud de pensamiento", "periodos de euforia grandiosidad", "irritabilidad elevada inusual", "disminucion necesidad dormir sin cansancio", "pensamiento acelerado", "habla muy rapida", "distractibilidad extrema", "conductas impulsivas alto riesgo", "gastos desmedidos", "alternancia episodios animo bajo y alto", "historia episodios previos"],
          diagnostico_sugerido: "Posible Trastorno Bipolar - requiere evaluacion psiquiatrica",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Agendar cita con psicologia para derivacion a psiquiatria. El trastorno bipolar requiere estabilizadores del animo."
        },
        {
          id: "PSI-012", nombre: "Trastorno Alimentario",
          sinonimos: ["anorexia", "bulimia", "problema con la comida", "restriccion de alimentos", "atracones y purgas", "trastorno alimenticio", "no como", "vomito despues de comer"],
          sintomas: ["preocupacion excesiva por el peso", "preocupacion por calorias", "preocupacion por figura corporal", "restriccion severa de alimentos", "dietas extremas", "episodios de atracones", "comer grandes cantidades rapido", "vomitos autoprovocados", "uso de laxantes", "exceso de ejercicio para compensar", "miedo intenso subir de peso", "imagen corporal distorsionada", "evitacion comer en publico", "pesarse multiples veces", "amenorrea", "irregularidades menstruales"],
          diagnostico_sugerido: "Posible Trastorno de la Conducta Alimentaria - requiere atencion urgente interdisciplinaria",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Agendar cita con psicologia y enfermeria de forma simultanea. Puede requerir intervencion medica, nutricional y psiquiatrica."
        },
        {
          id: "PSI-013", nombre: "Duelo y Trastorno de Adaptacion",
          sinonimos: ["perdida de familiar", "separacion", "duelo", "crisis emocional por perdida", "ruptura amorosa severa", "duelo complicado", "perdi a alguien"],
          sintomas: ["tristeza intensa por perdida reciente", "llanto frecuente prolongado", "dificultad aceptar la perdida", "pensamientos intrusivos sobre persona perdida", "aislamiento social tras la perdida", "dificultad concentrarse en actividades", "alteraciones del sueno", "alteraciones del apetito", "sensacion de vacio", "perdida sentido", "irritabilidad hacia personas cercanas", "mas de 6 semanas sin mejoria", "inicio relacionado con evento identificable"],
          diagnostico_sugerido: "Duelo complicado o Trastorno de Adaptacion",
          urgencia: "media",
          accion: "Agendar cita con psicologia para acompanamiento en el proceso de duelo y prevencion de depresion mayor."
        },
        {
          id: "PSI-014", nombre: "Consumo Problematico de Sustancias",
          sinonimos: ["abuso de alcohol", "consumo de drogas", "dependencia sustancias", "adiccion", "consumo marihuana problematico", "alcoholismo", "drogadiccion"],
          sintomas: ["consumo frecuente alcohol para manejar estres", "consumo marihuana para manejar emociones", "aumento cantidad consumida", "tolerancia", "intentos fallidos reducir consumo", "interfiere con obligaciones academicas", "consecuencias negativas continua consumiendo", "sintomas abstinencia", "temblor sin sustancia", "sudoracion sin sustancia", "mucho tiempo conseguir sustancia", "abandono actividades por consumo"],
          diagnostico_sugerido: "Posible Trastorno por Uso de Sustancias",
          urgencia: "alta",
          accion: "⚠️ Agendar cita urgente con psicologia en modalidad confidencial. Puede requerir programa de adicciones. Absoluta reserva y sin juicios."
        },
        {
          id: "PSI-015", nombre: "Autolesion No Suicida",
          sinonimos: ["cortarse", "hacerse dano sin querer morir", "autolesion", "quemarse a proposito", "rasguños intencionales", "me lastimo", "me corto"],
          sintomas: ["cortarse deliberadamente", "quemarse a proposito", "golpearse a proposito", "autolesion para aliviar tension", "sensacion de alivio tras autolesion", "culpa y verguenza despues", "ocultar marcas heridas", "ropa larga para tapar cicatrices", "historial de autolesiones previas", "tension emocional intensa que precede"],
          diagnostico_sugerido: "Autolesion no suicida - requiere atencion psicologica urgente",
          urgencia: "alta",
          accion: "⚠️ URGENTE: Contactar al equipo de psicologia de Bienestar ahora. Linea de crisis ext. 100. No estas solo/a."
        },
        {
          id: "PSI-016", nombre: "Ideacion Suicida",
          sinonimos: ["pensamientos de morir", "quiero morirme", "no quiero vivir", "pensamientos suicidas", "ideacion suicida", "suicidio"],
          sintomas: ["pensamientos recurrentes de muerte", "deseo de morir", "pensamientos de hacerse daño", "ideacion suicida", "plan para hacerse daño", "siento que todos estarian mejor sin mi", "no tiene sentido seguir", "busqueda de metodos"],
          diagnostico_sugerido: "⚠️ CRISIS - Ideacion suicida activa",
          urgencia: "alta",
          accion: "🚨 EMERGENCIA: Llama ahora a la Linea de Crisis de Bienestar ext. 100. Si estas en peligro inmediato llama al 123. No estas solo/a."
        },
        {
          id: "PSI-017", nombre: "Baja Autoestima",
          sinonimos: ["me siento mal conmigo mismo", "no me quiero", "baja autoestima", "me odio", "inseguridad extrema", "poca confianza en mi mismo"],
          sintomas: ["critica persistente hacia uno mismo", "sensacion de no ser suficiente", "comparacion constante con otros", "miedo al rechazo", "miedo al fracaso", "evitacion de retos por miedo a fallar", "dependencia emocional de la aprobacion de otros", "dificultad aceptar cumplidos", "sentimientos de inferioridad", "retraimiento social"],
          diagnostico_sugerido: "Baja autoestima con posible impacto en bienestar emocional",
          urgencia: "baja",
          accion: "Agendar cita con psicologia para trabajo en autoconcepto y habilidades emocionales."
        },
        {
          id: "PSI-018", nombre: "Dificultades de Pareja o Familia",
          sinonimos: ["problemas de pareja", "conflicto familiar", "crisis de pareja", "discusiones constantes", "separacion", "violencia en la relacion"],
          sintomas: ["conflictos frecuentes con pareja", "discusiones que escalan", "dificultad comunicarse con familia", "sensacion de incomprension familiar", "aislamiento familiar", "control excesivo de la pareja", "manipulacion en la relacion", "celos extremos", "miedo a reaccion de la pareja", "afecta el rendimiento academico"],
          diagnostico_sugerido: "Dificultades interpersonales significativas en el area de pareja o familia",
          urgencia: "media",
          accion: "Agendar cita con psicologia para orientacion y estrategias de comunicacion. Si hay violencia, activar ruta de atencion."
        },
        {
          id: "PSI-019", nombre: "Soledad y Aislamiento Social",
          sinonimos: ["me siento solo", "soledad", "no tengo amigos", "aislamiento", "no pertenezco", "excluido"],
          sintomas: ["sensacion de soledad profunda", "falta de relaciones significativas", "dificultad hacer amigos", "sentirse diferente a los demas", "sentirse excluido del grupo", "evitacion de actividades sociales", "tristeza sin acompanante", "sensacion de que nadie entiende", "pasar mucho tiempo solo voluntariamente", "reduccion de contacto social progresiva"],
          diagnostico_sugerido: "Aislamiento social con impacto en bienestar emocional",
          urgencia: "baja",
          accion: "Agendar cita con psicologia. Participar en actividades grupales de Bienestar puede ayudar."
        },
        {
          id: "PSI-020", nombre: "Dificultades de Aprendizaje",
          sinonimos: ["no entiendo nada", "dislexia", "me cuesta aprender", "dificultad de aprendizaje", "no puedo con el estudio", "aprendizaje lento"],
          sintomas: ["dificultad significativa para leer y comprender", "confusion de letras o numeros", "dificultad con matematicas", "necesita mucho mas tiempo que otros para aprender", "instrucciones escritas son muy dificiles", "no retiene la informacion", "frustacion constante en el estudio", "historial de reprobacion", "ha funcionado mejor con apoyo personalizado"],
          diagnostico_sugerido: "Posibles dificultades especificas de aprendizaje - requiere evaluacion neuropsicologica",
          urgencia: "baja",
          accion: "Agendar cita con psicologia para evaluacion de estilos y posibles dificultades de aprendizaje. El apoyo academico es disponible."
        }
      ]
    }
  }
};

// Hacer disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KNOWLEDGE_BASE };
}
