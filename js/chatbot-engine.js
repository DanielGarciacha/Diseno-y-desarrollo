// chatbot-engine.js — Motor de matching de síntomas para Bienestar Universitario
// Requiere knowledge_base.js cargado previamente

const ChatbotEngine = (() => {
  // Normalizar texto: minusculas, sin tildes, sin signos
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Tokenizar en palabras y bigramas
  function tokenize(text) {
    const words = normalize(text).split(' ').filter(w => w.length > 2);
    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push(words[i] + ' ' + words[i + 1]);
    }
    return [...new Set([...words, ...bigrams])];
  }

  // Calcular score de coincidencia de una condicion con el texto del usuario
  function scoreCondition(condition, userTokens) {
    let score = 0;
    const hits = [];

    const normNombre = normalize(condition.nombre);
    const sinonimos = (condition.sinonimos || []).map(normalize);
    const sintomas = (condition.sintomas || []).map(normalize);

    const conditionTokensArray = [...tokenize(condition.nombre)];
    sinonimos.forEach(s => conditionTokensArray.push(...tokenize(s)));
    sintomas.forEach(s => conditionTokensArray.push(...tokenize(s)));
    const conditionTokens = new Set(conditionTokensArray);

    for (const ut of userTokens) {
      if (conditionTokens.has(ut)) {
        const isBigram = ut.includes(' ');
        score += isBigram ? 4 : 1;

        // Bonus if the token is in the name or synonyms (more defining)
        if (normNombre.includes(ut) || sinonimos.some(s => s.includes(ut))) {
            score += isBigram ? 3 : 1;
        }

        // Registrar hits
        for (const sint of condition.sintomas || []) {
          if (normalize(sint).includes(ut)) hits.push(sint);
        }
        for (const sino of condition.sinonimos || []) {
          if (normalize(sino).includes(ut)) hits.push(sino);
        }
      }
    }

    return { score, hits: [...new Set(hits)] };
  }

  // Obtener las mejores coincidencias
  function getTopMatches(userText, topN = 3) {
    const userTokens = tokenize(userText);
    if (userTokens.length === 0) return [];

    const allConditions = [
      ...KNOWLEDGE_BASE.modulos.enfermeria.condiciones.map(c => ({ ...c, area: 'enfermeria' })),
      ...KNOWLEDGE_BASE.modulos.psicologia.condiciones.map(c => ({ ...c, area: 'psicologia' }))
    ];

    const scored = allConditions.map(cond => {
      const { score, hits } = scoreCondition(cond, userTokens);
      return { ...cond, score, hits };
    }).filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, topN);
  }

  // Colores y emojis por urgencia
  function urgenciaStyle(urgencia) {
    const map = {
      baja: { emoji: '🟢', label: 'Baja', color: '#10b981', bg: '#d1fae5', border: '#6ee7b7' },
      media: { emoji: '🟡', label: 'Media', color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
      alta: { emoji: '🔴', label: 'Alta — Requiere atención prioritaria', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }
    };
    return map[urgencia] || map['baja'];
  }

  // Icono por area
  function areaIcon(area) {
    return area === 'psicologia' ? '🧠' : '🏥';
  }

  // Generar HTML de respuesta para los matches
  function generateResponseHTML(matches) {
    if (matches.length === 0) {
      return {
        html: `<div class="cb-no-result">
          <p>No encontré una coincidencia clara con tus síntomas. Por favor, <strong>describe con más detalle</strong> cómo te sientes, o puedo ayudarte a <strong>agendar una cita directamente</strong>.</p>
          <button class="cb-chip" onclick="ChatbotUI.goToAgendarCita()">📅 Agendar cita general</button>
        </div>`,
        area: null,
        urgencia: null
      };
    }

    const top = matches[0];
    const style = urgenciaStyle(top.urgencia);
    const isUrgente = top.urgencia === 'alta';

    let html = '';

    // Banner de urgencia alta
    if (isUrgente) {
      html += `<div class="cb-alert-urgente">
        🚨 <strong>Situación que requiere atención prioritaria</strong><br>
        <small>Línea de Crisis Bienestar: <strong>Ext. 100</strong> | Emergencias: <strong>123</strong></small>
      </div>`;
    }

    // Resultado principal
    html += `<div class="cb-result-card" style="border-left: 3px solid ${style.color}; background: ${style.bg}">
      <div class="cb-result-header">
        <span class="cb-area-badge">${areaIcon(top.area)} ${top.area === 'psicologia' ? 'Psicología' : 'Enfermería'}</span>
        <span class="cb-urgencia-badge" style="background:${style.color}; color:#fff">${style.emoji} Urgencia ${style.label}</span>
      </div>
      <div class="cb-result-nombre">${top.nombre}</div>
      <div class="cb-result-diagnostico"><em>${top.diagnostico_sugerido}</em></div>
      <div class="cb-result-accion">
        <strong>Acción recomendada:</strong><br>${top.accion}
      </div>
    </div>`;

    // Alternativas
    if (matches.length > 1) {
      html += `<div class="cb-alternativas"><small><strong>También podría relacionarse con:</strong> `;
      html += matches.slice(1).map(m =>
        `<span class="cb-alt-chip">${areaIcon(m.area)} ${m.nombre}</span>`
      ).join(' ');
      html += `</small></div>`;
    }

    // Botón de agendar
    html += `<div class="cb-actions">
      <button class="cb-btn-agendar" onclick="ChatbotUI.goToAgendarCita('${top.area}', '${top.nombre}')">
        📅 Agendar cita en ${top.area === 'psicologia' ? 'Psicología' : 'Enfermería'}
      </button>
    </div>`;

    return { html, area: top.area, urgencia: top.urgencia };
  }

  // Flujo conversacional — estados
  const States = {
    INICIO: 'inicio',
    ESPERANDO_SINTOMAS: 'esperando_sintomas',
    MOSTRANDO_RESULTADO: 'mostrando_resultado',
    CONFIRMACION: 'confirmacion'
  };

  const MENSAJES_INICIO = [
    '¡Hola! 👋 Soy <strong>HealthBot</strong>, el asistente de Bienestar Universitario.<br><br>Puedo ayudarte a identificar qué tipo de atención necesitas según tus síntomas.<br><br>¿Cómo te has sentido últimamente? Descríbeme tus síntomas o malestar.',
  ];

  const QUICK_REPLIES_INICIO = [
    '😤 Me duele la cabeza', '🤒 Tengo fiebre', '😰 Estoy muy ansioso',
    '😢 Me siento deprimido', '🤧 Gripe o resfriado', '😴 No puedo dormir',
    '🫀 Me duele el estómago', '💪 Dolor de espalda'
  ];

  return {
    States,
    MENSAJES_INICIO,
    QUICK_REPLIES_INICIO,
    normalize,
    tokenize,
    getTopMatches,
    generateResponseHTML,
    urgenciaStyle,
    areaIcon
  };
})();
