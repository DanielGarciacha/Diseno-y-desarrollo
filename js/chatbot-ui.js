// chatbot-ui.js — Interfaz de usuario del chatbot de Bienestar Universitario
// Requiere: knowledge_base.js, chatbot-engine.js y chatbot.css

const ChatbotUI = (() => {
  let state = ChatbotEngine.States.INICIO;
  let isOpen = false;
  let autoOpenDone = false;
  let accumulatedSymptoms = [];
  const MSG_DELAY = 900;

  // ───────────────────────────── INIT ─────────────────────────────
  function init({ autoOpen = false, targetServicio = null, targetMotivo = null } = {}) {
    injectHTML();
    bindEvents();

    if (autoOpen && !autoOpenDone) {
      setTimeout(() => {
        openPanel();
        autoOpenDone = true;
      }, 2000);
    }

    // Si hay valores precargados desde localStorage
    if (targetServicio) window._cb_targetServicio = targetServicio;
    if (targetMotivo) window._cb_targetMotivo = targetMotivo;
  }

  // ───────────────────────────── HTML INJECTION ─────────────────────────────
  function injectHTML() {
    const el = document.createElement('div');
    el.id = 'cb-wrapper';
    el.innerHTML = `
      <!-- Burbuja flotante -->
      <button id="cb-bubble" class="cb-pulse" aria-label="Abrir chatbot de síntomas" title="Asistente de Salud">
        💬
        <div id="cb-badge">1</div>
      </button>

      <!-- Panel del chat -->
      <div id="cb-panel" role="dialog" aria-label="Chatbot de Bienestar Universitario">
        <!-- Header -->
        <div id="cb-header">
          <div class="cb-avatar">🤖</div>
          <div class="cb-header-info">
            <div class="cb-header-name">HealthBot — Bienestar</div>
            <div class="cb-header-status">
              <div class="cb-status-dot"></div>
              En línea · Orientación de salud
            </div>
          </div>
          <div class="cb-header-actions">
            <button class="cb-btn-icon" id="cb-reset-btn" title="Reiniciar conversación">🔄</button>
            <button class="cb-btn-icon" id="cb-close-btn" title="Cerrar">✕</button>
          </div>
        </div>

        <!-- Mensajes -->
        <div id="cb-messages"></div>

        <!-- Quick replies -->
        <div id="cb-quick-replies"></div>

        <!-- Input -->
        <div id="cb-input-area">
          <textarea id="cb-input" placeholder="Describe tus síntomas…" rows="1" maxlength="400"></textarea>
          <button id="cb-send" title="Enviar">➤</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
  }

  // ───────────────────────────── EVENTS ─────────────────────────────
  function bindEvents() {
    document.getElementById('cb-bubble').addEventListener('click', togglePanel);
    document.getElementById('cb-close-btn').addEventListener('click', closePanel);
    document.getElementById('cb-reset-btn').addEventListener('click', resetChat);
    document.getElementById('cb-send').addEventListener('click', handleSend);

    const input = document.getElementById('cb-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 90) + 'px';
    });
  }

  // ───────────────────────────── PANEL TOGGLE ─────────────────────────────
  function togglePanel() {
    isOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    isOpen = true;
    document.getElementById('cb-panel').classList.add('cb-open');
    document.getElementById('cb-bubble').classList.remove('cb-pulse');
    const badge = document.getElementById('cb-badge');
    if (badge) badge.remove();

    if (state === ChatbotEngine.States.INICIO) {
      startConversation();
    }
    setTimeout(() => document.getElementById('cb-input').focus(), 350);
  }

  function closePanel() {
    isOpen = false;
    document.getElementById('cb-panel').classList.remove('cb-open');
  }

  function resetChat() {
    state = ChatbotEngine.States.INICIO;
    document.getElementById('cb-messages').innerHTML = '';
    document.getElementById('cb-quick-replies').innerHTML = '';
    startConversation();
  }

  // ───────────────────────────── CONVERSATION FLOW ─────────────────────────────
  function startConversation() {
    state = ChatbotEngine.States.ESPERANDO_SINTOMAS;
    accumulatedSymptoms = [];
    showTyping(() => {
      appendBotMessage(ChatbotEngine.MENSAJES_INICIO[0]);
      showQuickReplies(ChatbotEngine.QUICK_REPLIES_INICIO);
    }, 600);
  }

  function handleSend() {
    const input = document.getElementById('cb-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    clearQuickReplies();
    appendUserMessage(text);
    processUserInput(text);
  }

  function handleQuickReply(text) {
    clearQuickReplies();
    appendUserMessage(text);
    processUserInput(text);
  }

  function processUserInput(text) {
    const sendBtn = document.getElementById('cb-send');
    sendBtn.disabled = true;

    // Detectar palabras clave de crisis inmediata
    const crisisWords = ['suicidio','suicida','quiero morir','no quiero vivir','hacerme daño','matarme','matarme','morirme','emergencia'];
    const normText = ChatbotEngine.normalize(text);
    const isCrisis = crisisWords.some(w => normText.includes(w));

    if (isCrisis) {
      showTyping(() => {
        appendBotMessage(`🚨 <strong>Esto me preocupa y quiero que estés seguro/a.</strong><br><br>
          Por favor contacta ahora con el equipo de Bienestar:<br>
          📞 <strong>Línea de Crisis: Ext. 100</strong><br>
          🆘 Emergencias: <strong>123</strong><br><br>
          También puedes ir directamente a la oficina de Bienestar Universitario. <strong>No estás solo/a.</strong>`);
        showQuickReplies(['📅 Agendar cita urgente', '🔄 Empezar de nuevo']);
        state = ChatbotEngine.States.MOSTRANDO_RESULTADO;
        sendBtn.disabled = false;
      }, MSG_DELAY);
      return;
    }

    // Acumular síntomas
    accumulatedSymptoms.push(text);

    if (state === ChatbotEngine.States.ESPERANDO_SINTOMAS || state === 'ACUMULANDO_SINTOMAS') {
      state = 'ACUMULANDO_SINTOMAS';
      showTyping(() => {
        appendBotMessage("He anotado eso. ¿Tienes algún <strong>otro síntoma</strong> o quieres que analice tu caso con lo que me has dicho?");
        showQuickReplies(['🔍 Analizar síntomas', 'No, eso es todo']);
        sendBtn.disabled = false;
      }, MSG_DELAY);
      return;
    }

    if (state === ChatbotEngine.States.MOSTRANDO_RESULTADO) {
      analyzeSymptoms();
    }
  }

  function analyzeSymptoms() {
    const sendBtn = document.getElementById('cb-send');
    sendBtn.disabled = true;
    const allText = accumulatedSymptoms.join(' ');

    const matches = ChatbotEngine.getTopMatches(allText, 3);
    const { html, area, urgencia } = ChatbotEngine.generateResponseHTML(matches);

    showTyping(() => {
      appendBotMessage(html);

      if (area) {
        const replies = ['📅 Agendar esta cita', '➕ Añadir otro síntoma', '🔄 Empezar de nuevo'];
        showQuickReplies(replies);
        window._cb_lastMatch = { area, urgencia, diagnostico: matches[0].nombre };
      } else {
        showQuickReplies(['➕ Añadir otro síntoma', '📅 Agendar cita directamente', '🔄 Empezar de nuevo']);
      }

      state = ChatbotEngine.States.MOSTRANDO_RESULTADO;
      sendBtn.disabled = false;
    }, MSG_DELAY);
  }

  // ───────────────────────────── RENDER HELPERS ─────────────────────────────
  function appendBotMessage(html) {
    const msgs = document.getElementById('cb-messages');
    const div = document.createElement('div');
    div.className = 'cb-msg cb-bot';
    div.innerHTML = `
      <div class="cb-msg-avatar">🤖</div>
      <div class="cb-bubble">${html}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendUserMessage(text) {
    const msgs = document.getElementById('cb-messages');
    const div = document.createElement('div');
    div.className = 'cb-msg cb-user';
    div.innerHTML = `<div class="cb-bubble">${escapeHTML(text)}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(callback, delay = MSG_DELAY) {
    const msgs = document.getElementById('cb-messages');
    const typing = document.createElement('div');
    typing.className = 'cb-msg cb-bot';
    typing.id = 'cb-typing-indicator';
    typing.innerHTML = `
      <div class="cb-msg-avatar">🤖</div>
      <div class="cb-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
      const t = document.getElementById('cb-typing-indicator');
      if (t) t.remove();
      callback();
    }, delay);
  }

  function showQuickReplies(replies) {
    const container = document.getElementById('cb-quick-replies');
    container.innerHTML = '';
    replies.forEach(r => {
      const chip = document.createElement('button');
      chip.className = 'cb-chip';
      chip.textContent = r;
      chip.addEventListener('click', () => {
        // Manejo especial de chips de acción
        if (r.includes('Agendar')) {
          const match = window._cb_lastMatch;
          goToAgendarCita(match ? match.area : null, r.includes('urgente') ? 'Atención urgente requerida' : (match ? match.diagnostico : null));
        } else if (r.includes('Empezar de nuevo') || r.includes('otra cosa')) {
          resetChat();
        } else if (r.includes('Analizar') || r.includes('eso es todo')) {
          clearQuickReplies();
          appendUserMessage(r);
          analyzeSymptoms();
        } else if (r.includes('Añadir otro')) {
          clearQuickReplies();
          appendUserMessage(r);
          state = 'ACUMULANDO_SINTOMAS';
          const sendBtn = document.getElementById('cb-send');
          sendBtn.disabled = true;
          showTyping(() => {
            appendBotMessage("Dime, ¿qué otro síntoma tienes?");
            sendBtn.disabled = false;
          }, MSG_DELAY);
        } else {
          handleQuickReply(r);
        }
      });
      container.appendChild(chip);
    });
  }

  function clearQuickReplies() {
    document.getElementById('cb-quick-replies').innerHTML = '';
  }

  // ───────────────────────────── AGENDAR CITA ─────────────────────────────
  function goToAgendarCita(area = null, nombreCondicion = null) {
    // Intentar pre-llenar el formulario si estamos en bienestar.html
    const servicioSelect = document.getElementById('servicio');
    const motivoInput = document.getElementById('motivo');

    if (servicioSelect && area) {
      servicioSelect.value = area;
      servicioSelect.dispatchEvent(new Event('change'));
    }

    if (motivoInput && nombreCondicion) {
      motivoInput.value = `Síntomas relacionados con: ${nombreCondicion}`;
    }

    // Si hay formulario en la página, hacer scroll y cerrar el chat
    if (servicioSelect) {
      closePanel();
      servicioSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      servicioSelect.focus();
      // Feedback visual
      servicioSelect.style.borderColor = '#4361ee';
      setTimeout(() => servicioSelect.style.borderColor = '', 2000);
      return;
    }

    // Si no, navegar a bienestar.html con parámetros URL
    const params = new URLSearchParams();
    if (area) params.set('servicio', area);
    if (nombreCondicion) params.set('motivo', `Síntomas relacionados con: ${nombreCondicion}`);

    const basePath = window.location.pathname.includes('/html/') ? 'bienestar.html' : 'html/bienestar.html';
    window.location.href = `${basePath}?${params.toString()}`;
  }

  // ───────────────────────────── UTILS ─────────────────────────────
  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { init, openPanel, closePanel, goToAgendarCita, resetChat };
})();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Leer config del script tag o atributos del body
  const autoOpen = document.body.getAttribute('data-chatbot-auto') === 'true';

  // Leer parámetros URL para pre-llenar (cuando se navega desde el chatbot)
  const params = new URLSearchParams(window.location.search);
  const servicioParam = params.get('servicio');
  const motivoParam = params.get('motivo');

  ChatbotUI.init({
    autoOpen,
    targetServicio: servicioParam,
    targetMotivo: motivoParam
  });

  // Pre-llenar formulario si hay params en URL
  if (servicioParam || motivoParam) {
    setTimeout(() => {
      const servicioSelect = document.getElementById('servicio');
      const motivoInput = document.getElementById('motivo');
      if (servicioSelect && servicioParam) {
        servicioSelect.value = servicioParam;
      }
      if (motivoInput && motivoParam) {
        motivoInput.value = motivoParam;
      }
    }, 300);
  }
});
