import React, { useState, useEffect, useRef, useCallback } from 'react';

// ===================== DATOS: CITAS Y TRADUCCIONES (idénticos al original) =====================
const quotesDB = [
  ["Cree en ti y todo será posible.", "Believe in yourself and anything is possible.", "Acredite em si mesmo e tudo será possível."],
  ["El éxito es la suma de pequeños esfuerzos repetidos.", "Success is the sum of small efforts repeated.", "O sucesso é a soma de pequenos esforços repetidos."],
  ["No te detengas hasta que te sientas orgulloso.", "Don't stop until you're proud.", "Não pare até se sentir orgulhoso."],
  ["La disciplina es el puente entre metas y logros.", "Discipline is the bridge between goals and accomplishment.", "A disciplina é a ponte entre metas e conquistas."],
  ["Hoy es un buen día para tener un gran día.", "Today is a good day to have a great day.", "Hoje é um bom dia para ter um ótimo dia."],
  ["Si puedes soñarlo, puedes hacerlo.", "If you can dream it, you can do it.", "Se você pode sonhar, você pode fazer."],
  ["El mejor momento para empezar es ahora.", "The best time to start is now.", "O melhor momento para começar é agora."],
  ["Eres más fuerte de lo que piensas.", "You are stronger than you think.", "Você é mais forte do que pensa."],
  ["La calidad no es un acto, es un hábito.", "Quality is not an act, it is a habit.", "A qualidade não é um ato, é um hábito."],
  ["El fracaso es solo la oportunidad de comenzar de nuevo.", "Failure is simply the opportunity to begin again.", "O fracasso é apenas a oportunidade de começar de novo."],
  ["Las grandes cosas nunca vienen de la zona de confort.", "Great things never came from comfort zones.", "Grandes coisas nunca vêm da zona de conforto."],
  ["Un viaje de mil millas comienza con un solo paso.", "A journey of a thousand miles begins with a single step.", "Uma jornada de mil milhas começa com um único passo."],
  ["Todo logro comienza con la decisión de intentarlo.", "Every accomplishment starts with the decision to try.", "Toda conquista começa com a decisão de tentar."],
  ["Gana si puedes, pierde si debes, pero nunca abandones.", "Win if you can, lose if you must, but never quit.", "Vença se puder, perca se dever, mas nunca desista."],
  ["Cada día es una nueva oportunidad para mejorar.", "Every day is a new chance to get better.", "Cada dia é uma nova oportunidade de melhorar."]
];

const translations = {
  es_la: {
    todo: "Por Hacer", doing: "En Progreso", done: "Hecho",
    placeholder: "Escribe una nueva tarea...", add: "+ Agregar", empty: "Nada por aquí...",
    btnInfo: "❓ Ayuda", btnDonate: "☕ Apoyar",
    msgAdded: "¡Tarea agregada!", msgMoved: "¡Avanzando! 🚀", msgDeleted: "Tarea eliminada",
    msgSave: "Guardado", msgAlreadyDone: "¡Ya está completada! 🎉",
    msgEmpty: "Escribe algo primero...", msgSaveError: "Error al guardar ⚠️",
    btnAdvance: "Avanzar", btnDelete: "Borrar",
    modalInfoTitle: "🚀 Bienvenido a Task Flow v2.0",
    modalInfoSec1T: "🧠 ¿Qué es Kanban y cómo te ayuda?",
    modalInfoSec1D: "Kanban es un método visual que te permite ver tu trabajo avanzar. Te da una sensación de logro increíble al llevar tareas hasta 'Hecho'.",
    modalInfoSec2T: "📌 ¿Cómo uso Task Flow?",
    modalInfoUse1: "➕ <b>Crea:</b> Escribe tu tarea, elige un color y presiona Enter o Agregar.",
    modalInfoUse2: "👆 <b>Mueve:</b> Arrastra y suelta tus notas, o usa el botón ✓ para avanzar.",
    modalInfoUse3: "✏️ <b>Edita:</b> Toca el texto de cualquier nota para corregirlo.",
    modalInfoSec3T: "💡 Tips Pro de Organización",
    modalInfoPro1: "⚡ <b>El Secreto:</b> Máximo 3 tareas en 'En Progreso'. ¡Termina antes de empezar!",
    modalInfoPro2: "🧹 <b>Limpieza:</b> Borra las completadas al final de la semana.",
    modalInfoBtn: "¡Entendido, a organizar!",
    modalDonTitle: "❤️ ¡Apoya a Task Flow!",
    modalDonDesc: "Si esta herramienta te ayuda a organizar tu día, considera invitarme un café ☕. Tu apoyo mantiene el proyecto gratuito.",
    modalDonPpDesc: "Rápido y seguro con tarjeta o saldo.", modalDonPpBtn: "Donar con PayPal"
  },
  es_es: {
    todo: "Pendientes", doing: "En Curso", done: "Completadas",
    placeholder: "Nueva tarea...", add: "+ Añadir", empty: "Lista vacía...",
    btnInfo: "❓ Ayuda", btnDonate: "☕ Apoyar",
    msgAdded: "¡Tarea añadida!", msgMoved: "¡Avanzando! 🚀", msgDeleted: "Tarea eliminada",
    msgSave: "Guardado", msgAlreadyDone: "¡Ya está completada! 🎉",
    msgEmpty: "Escribe algo primero...", msgSaveError: "Error al guardar ⚠️",
    btnAdvance: "Avanzar", btnDelete: "Borrar",
    modalInfoTitle: "🚀 Bienvenido a Task Flow v2.0",
    modalInfoSec1T: "🧠 ¿Qué es Kanban?",
    modalInfoSec1D: "Kanban es un método visual. Evita saturarte y te da logro al llevar tareas hasta 'Completadas'.",
    modalInfoSec2T: "📌 ¿Cómo uso Task Flow?",
    modalInfoUse1: "➕ <b>Crea:</b> Escribe la tarea, elige color y presiona Enter.",
    modalInfoUse2: "👆 <b>Mueve:</b> Arrastra notas o usa el botón ✓.",
    modalInfoUse3: "✏️ <b>Edita:</b> Toca el texto para modificarlo.",
    modalInfoSec3T: "💡 Consejos Pro",
    modalInfoPro1: "⚡ <b>El Secreto:</b> Máximo 3 tareas 'En Curso'. ¡Empieza a terminar!",
    modalInfoPro2: "🧹 <b>Limpieza:</b> Borra las completadas semanalmente.",
    modalInfoBtn: "¡Entendido, a organizar!",
    modalDonTitle: "❤️ ¡Apoya a Task Flow!",
    modalDonDesc: "Si esta herramienta te ayuda, considera invitarme a un café ☕.",
    modalDonPpDesc: "Rápido y seguro.", modalDonPpBtn: "Donar con PayPal"
  },
  en: {
    todo: "To Do", doing: "Doing", done: "Done",
    placeholder: "Type a new task...", add: "+ Add Task", empty: "No tasks here...",
    btnInfo: "❓ Help", btnDonate: "☕ Support",
    msgAdded: "Task added!", msgMoved: "Moving forward! 🚀", msgDeleted: "Task deleted",
    msgSave: "Saved", msgAlreadyDone: "Already done! 🎉",
    msgEmpty: "Write something first...", msgSaveError: "Save error ⚠️",
    btnAdvance: "Advance", btnDelete: "Delete",
    modalInfoTitle: "🚀 Welcome to Task Flow v2.0",
    modalInfoSec1T: "🧠 What is Kanban?",
    modalInfoSec1D: "Kanban is a visual method to see your workflow. It gives you a great sense of achievement when you move tasks to 'Done'.",
    modalInfoSec2T: "📌 How to use Task Flow?",
    modalInfoUse1: "➕ <b>Create:</b> Type a task, pick a color, and press Enter.",
    modalInfoUse2: "👆 <b>Move:</b> Drag and drop notes, or click ✓ to move forward.",
    modalInfoUse3: "✏️ <b>Edit:</b> Tap the text of any note to change it.",
    modalInfoSec3T: "💡 Pro Tips",
    modalInfoPro1: "⚡ <b>The Secret:</b> Limit 'Doing' to 3 tasks. Stop starting, start finishing!",
    modalInfoPro2: "🧹 <b>Clean Up:</b> Delete completed tasks weekly.",
    modalInfoBtn: "Got it, let's go!",
    modalDonTitle: "❤️ Support Task Flow!",
    modalDonDesc: "If this tool helps you stay productive, consider buying me a coffee ☕.",
    modalDonPpDesc: "Fast and secure.", modalDonPpBtn: "Donate with PayPal"
  },
  pt: {
    todo: "A Fazer", doing: "Em Progresso", done: "Concluído",
    placeholder: "Nova tarefa...", add: "+ Adicionar", empty: "Nada aqui...",
    btnInfo: "❓ Ajuda", btnDonate: "☕ Apoiar",
    msgAdded: "Tarefa adicionada!", msgMoved: "Avançando! 🚀", msgDeleted: "Tarefa removida",
    msgSave: "Salvo", msgAlreadyDone: "Já concluída! 🎉",
    msgEmpty: "Escreva algo primeiro...", msgSaveError: "Erro ao salvar ⚠️",
    btnAdvance: "Avançar", btnDelete: "Excluir",
    modalInfoTitle: "🚀 Bem-vindo ao Task Flow v2.0",
    modalInfoSec1T: "🧠 O que é Kanban?",
    modalInfoSec1D: "Kanban é um método visual. Evita exaustão e dá uma ótima sensação de conquista.",
    modalInfoSec2T: "📌 Como usar?",
    modalInfoUse1: "➕ <b>Criar:</b> Escreva a tarefa, escolha a cor e aperte Enter.",
    modalInfoUse2: "👆 <b>Mover:</b> Arraste as notas ou use o botão ✓.",
    modalInfoUse3: "✏️ <b>Editar:</b> Toque no texto para modificar.",
    modalInfoSec3T: "💡 Dicas Pro",
    modalInfoPro1: "⚡ <b>O Segredo:</b> Máximo 3 tarefas 'Em Progresso'. Pare de começar!",
    modalInfoPro2: "🧹 <b>Limpeza:</b> Apague tarefas concluídas semanalmente.",
    modalInfoBtn: "Entendido, vamos lá!",
    modalDonTitle: "❤️ Apoie o Task Flow!",
    modalDonDesc: "Se esta ferramenta te ajuda, considere me pagar um café ☕.",
    modalDonPpDesc: "Rápido e seguro.", modalDonPpBtn: "Doar com PayPal"
  }
};

const COLORS = ['bg-yellow', 'bg-blue', 'bg-green', 'bg-pink', 'bg-purple', 'bg-orange', 'bg-cyan', 'bg-red'];
const COLOR_TITLES = { 'bg-yellow': 'Amarillo', 'bg-blue': 'Azul', 'bg-green': 'Verde', 'bg-pink': 'Rosa', 'bg-purple': 'Morado', 'bg-orange': 'Naranja', 'bg-cyan': 'Cian', 'bg-red': 'Rojo' };
const COLS = ['todo', 'doing', 'done'];

const uid = () => 'task-' + Date.now() + Math.random().toString(16).slice(2);

function detectBrowserLanguage() {
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  for (const l of langs) {
    const code = l.toLowerCase();
    if (code === 'es-es' || code === 'es_es') return 'es_es';
    if (code.startsWith('es')) return 'es_la';
    if (code.startsWith('pt')) return 'pt';
    if (code.startsWith('en')) return 'en';
  }
  return 'en';
}

// ===================== TARJETA DE TAREA =====================
const Task = React.memo(function Task({ task, colId, index, onStartDrag, onDelete, onAdvance, onEdit, dragging }) {
  const [text, setText] = useState(task.text);
  const spanRef = useRef(null);

  useEffect(() => { setText(task.text); }, [task.text]);

  const commitEdit = () => {
    const clean = (spanRef.current?.innerText || '').trim().slice(0, 500);
    if (!clean) { onDelete(colId, task.id); return; }
    if (clean !== task.text) onEdit(colId, task.id, clean);
  };

  return (
    <div
      className={`task ${task.color}${dragging ? ' dragging' : ''}`}
      onPointerDown={(e) => onStartDrag(e, colId, index, task.id)}
    >
      <span
        ref={spanRef}
        className="task-text"
        contentEditable
        suppressContentEditableWarning
        onBlur={commitEdit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
        onPaste={(e) => {
          e.preventDefault();
          const plain = (e.clipboardData || window.clipboardData).getData('text/plain').slice(0, 500);
          document.execCommand('insertText', false, plain);
        }}
      >{text}</span>
      <div className="task-footer">
        <button className="icon-btn check-btn" onClick={() => onAdvance(colId, task.id)}>✓</button>
        <button className="icon-btn del-btn" onClick={() => onDelete(colId, task.id)}>✕</button>
      </div>
    </div>
  );
});

// ===================== APP PRINCIPAL =====================
export default function App() {
  const [board, setBoard] = useState({ todo: [], doing: [], done: [] });
  const [lang, setLang] = useState('es_la');
  const [dark, setDark] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-yellow');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [toast, setToast] = useState(null);
  const [quote, setQuote] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  const t = translations[lang] || translations.es_la;
  const toastTimerRef = useRef(null);
  const quoteTimerRef = useRef(null);
  const loadedRef = useRef(false);

  // ---------- Cargar tablero guardado (misma clave/forma que la versión HTML) ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem('taskFlowData');
      if (raw) {
        const data = JSON.parse(raw);
        const withIds = (arr) => (arr || []).map(x => ({ id: uid(), text: x.text, color: x.color || 'bg-yellow' }));
        setBoard({ todo: withIds(data.todo), doing: withIds(data.doing), done: withIds(data.done) });
        setLang(data.lang || detectBrowserLanguage());
        setDark(data.theme === 'dark');
      } else {
        setLang(detectBrowserLanguage());
      }
    } catch (e) {
      try { localStorage.removeItem('taskFlowData'); } catch (_) {}
      setLang(detectBrowserLanguage());
    }
    loadedRef.current = true;
    setQuote(quotesDB[Math.floor(Math.random() * quotesDB.length)]);
    quoteTimerRef.current = setInterval(() => {
      setQuote(quotesDB[Math.floor(Math.random() * quotesDB.length)]);
    }, 25 * 60 * 1000);
    return () => clearInterval(quoteTimerRef.current);
  }, []);

  // ---------- Guardar automáticamente (misma forma que el original) ----------
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      const strip = (arr) => arr.map(x => ({ text: x.text, color: x.color }));
      localStorage.setItem('taskFlowData', JSON.stringify({
        todo: strip(board.todo), doing: strip(board.doing), done: strip(board.done),
        lang, theme: dark ? 'dark' : 'light'
      }));
    } catch (e) { showToast('error'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, lang, dark]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
    const htmlLangMap = { es_la: 'es', es_es: 'es-ES', en: 'en', pt: 'pt' };
    document.documentElement.lang = htmlLangMap[lang] || 'en';
    const titles = { es_la: 'Task Flow - Tablero Kanban', es_es: 'Task Flow - Tablero Kanban', en: 'Task Flow - Kanban Board', pt: 'Task Flow - Quadro Kanban' };
    document.title = titles[lang] || 'Task Flow - Kanban Board';
  }, [dark, lang]);

  const showToast = useCallback((type) => {
    const icons = { add: '➕', move: '✅', delete: '🗑️', save: '💾', done: '🎉', empty: '✏️', error: '⚠️' };
    const keys = { add: 'msgAdded', move: 'msgMoved', delete: 'msgDeleted', save: 'msgSave', done: 'msgAlreadyDone', empty: 'msgEmpty', error: 'msgSaveError' };
    clearTimeout(toastTimerRef.current);
    setToast(`${icons[type] || '💾'} ${translations[lang][keys[type] || 'msgSave']}`);
    toastTimerRef.current = setTimeout(() => setToast(null), 2400);
  }, [lang]);

  // ---------- Acciones sobre tareas ----------
  const addTask = () => {
    const text = inputValue.trim().slice(0, 500);
    if (!text) {
      setInputError(true); setTimeout(() => setInputError(false), 500);
      showToast('empty'); return;
    }
    setBoard(prev => ({ ...prev, todo: [...prev.todo, { id: uid(), text, color: selectedColor }] }));
    setInputValue('');
    showToast('add');
  };

  const deleteTask = (colId, taskId) => {
    setBoard(prev => ({ ...prev, [colId]: prev[colId].filter(x => x.id !== taskId) }));
    showToast('delete');
  };

  const editTask = (colId, taskId, newText) => {
    setBoard(prev => ({ ...prev, [colId]: prev[colId].map(x => x.id === taskId ? { ...x, text: newText } : x) }));
  };

  const celebrate = () => {
    if (window.confetti) {
      window.confetti({ particleCount: 160, spread: 85, origin: { y: 0.6 }, colors: ['#ff7675', '#fdcb6e', '#55efc4', '#74b9ff', '#a29bfe'], disableForReducedMotion: true });
    }
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
  };

  const advanceTask = (colId, taskId) => {
    const order = ['todo', 'doing', 'done'];
    const idx = order.indexOf(colId);
    const next = order[idx + 1];
    if (!next) { showToast('done'); return; }
    const task = board[colId].find(x => x.id === taskId);
    setBoard(prev => ({
      ...prev,
      [colId]: prev[colId].filter(x => x.id !== taskId),
      [next]: [...prev[next], task]
    }));
    if (next === 'done') celebrate();
    showToast('move');
  };

  const changeLanguage = (e) => setLang(e.target.value);
  const toggleTheme = () => setDark(v => !v);

  // ===================== ARRASTRE UNIFICADO (Pointer Events + throttle por frame) =====================
  // A diferencia del HTML original (drag nativo de HTML5 para mouse + un sistema táctil aparte,
  // cada uno con su propio código), aquí un solo camino de código maneja mouse, dedo y lápiz óptico
  // por igual. El punto clave para el rendimiento: el cálculo de "qué hay debajo del dedo"
  // (elementFromPoint + medir todas las tarjetas) es costoso, así que se limita a ejecutarse como
  // máximo una vez por fotograma con requestAnimationFrame, en vez de en cada evento crudo de
  // movimiento — eso era justo lo que causaba el atasco al arrastrar en el celular.
  const dragRef = useRef(null);
  const pendingPointRef = useRef(null);
  const rafRef = useRef(null);
  const ghostElRef = useRef(null);
  const [dragTaskId, setDragTaskId] = useState(null);
  const boardRef = useRef(board);
  useEffect(() => { boardRef.current = board; }, [board]);

  const startDrag = (e, colId, index, taskId) => {
    if (e.target.closest('.task-text') || e.target.closest('.icon-btn')) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      taskId, fromCol: colId, fromIndex: index,
      width: rect.width, height: rect.height,
      offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top
    };
    setDragTaskId(taskId);
    el.setPointerCapture(e.pointerId);
    if (navigator.vibrate) navigator.vibrate(30);

    const ghost = document.createElement('div');
    ghost.className = 'task task-ghost';
    COLORS.forEach(c => { if (el.classList.contains(c)) ghost.classList.add(c); });
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    ghost.innerHTML = el.innerHTML;
    document.body.appendChild(ghost);
    ghostElRef.current = ghost;
  };

  const processPendingMove = () => {
    rafRef.current = null;
    const pt = pendingPointRef.current;
    const drag = dragRef.current;
    if (!pt || !drag || !ghostElRef.current) return;

    ghostElRef.current.style.left = (pt.x - drag.offsetX) + 'px';
    ghostElRef.current.style.top = (pt.y - drag.offsetY) + 'px';

    ghostElRef.current.style.visibility = 'hidden';
    const below = document.elementFromPoint(pt.x, pt.y);
    ghostElRef.current.style.visibility = '';
    const targetListEl = below ? below.closest('.task-list') : null;
    document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
    if (!targetListEl) return;
    targetListEl.closest('.column')?.classList.add('drag-over');
    const targetCol = targetListEl.dataset.col;

    const cards = [...targetListEl.querySelectorAll('.task:not(.task-ghost)')]
      .filter(c => c.dataset.taskId !== drag.taskId);
    let insertIndex = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const box = cards[i].getBoundingClientRect();
      if (pt.y < box.top + box.height / 2) { insertIndex = i; break; }
    }

    const current = boardRef.current;
    const curIndexInTarget = current[targetCol].findIndex(x => x.id === drag.taskId);
    if (targetCol === drag.fromCol && curIndexInTarget === insertIndex) return;

    setBoard(prev => {
      const task = COLS.map(c => prev[c].find(x => x.id === drag.taskId)).find(Boolean);
      if (!task) return prev;
      const withoutTask = {};
      COLS.forEach(c => { withoutTask[c] = prev[c].filter(x => x.id !== drag.taskId); });
      const destArr = [...withoutTask[targetCol]];
      const idx = Math.min(insertIndex, destArr.length);
      destArr.splice(idx, 0, task);
      return { ...withoutTask, [targetCol]: destArr };
    });
    dragRef.current.fromCol = targetCol;
  };

  const onDragMove = (e) => {
    if (!dragRef.current) return;
    pendingPointRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(processPendingMove);
  };

  const endDrag = () => {
    if (!dragRef.current) return;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const finalCol = dragRef.current.fromCol;
    if (ghostElRef.current) { ghostElRef.current.remove(); ghostElRef.current = null; }
    document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
    setDragTaskId(null);
    dragRef.current = null;
    pendingPointRef.current = null;
    if (finalCol === 'done') celebrate();
    showToast('move');
  };

  // ===================== RENDER =====================
  return (
    <>
      <header>
        <div className="header-spacer"></div>
        <div className="logo">✨ Task Flow <span className="version-tag">v2.0</span></div>
        <div className="controls">
          <button className="control-btn" onClick={() => setInfoOpen(true)}>{t.btnInfo}</button>
          <button className="control-btn btn-donate" onClick={() => setDonateOpen(true)}>{t.btnDonate}</button>
          <select value={lang} onChange={changeLanguage}>
            <option value="es_la">Español (Latino)</option>
            <option value="es_es">Español (España)</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
          <button className="control-btn" onClick={toggleTheme}>{dark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <div className="add-task-area">
        <div className="motivation-quote">{quote ? quote[lang === 'pt' ? 2 : lang === 'en' ? 1 : 0] : ''}</div>
        <div className="input-wrapper">
          <input
            type="text" maxLength="500" placeholder={t.placeholder} autoComplete="off" autoCorrect="on" spellCheck="true"
            className={inputError ? 'input-error' : ''}
            value={inputValue} onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
          />
          <div className="color-selector">
            {COLORS.map(c => (
              <div key={c} className={`color-dot ${c}${selectedColor === c ? ' selected' : ''}`} title={COLOR_TITLES[c]} onClick={() => setSelectedColor(c)}></div>
            ))}
          </div>
          <button className="add-btn" onClick={addTask}>{t.add}</button>
        </div>
      </div>

      <div className="board" onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
        {COLS.map(colId => (
          <div className="column" key={colId}>
            <div className="column-header"><span>{t[colId]}</span><span className="count-badge">{board[colId].length}</span></div>
            <div className="task-list" data-col={colId}>
              {board[colId].map((task, index) => (
                <div data-task-id={task.id} key={task.id} style={dragTaskId === task.id ? { opacity: 0 } : undefined}>
                  <Task
                    task={task} colId={colId} index={index}
                    onStartDrag={startDrag} onDelete={deleteTask} onAdvance={advanceTask} onEdit={editTask}
                    dragging={dragTaskId === task.id}
                  />
                </div>
              ))}
              {board[colId].length === 0 && <div className="empty-message">{t.empty}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>

      {infoOpen && (
        <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setInfoOpen(false); }}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setInfoOpen(false)}>&times;</button>
            <h2 className="modal-title">{t.modalInfoTitle}</h2>
            <div className="info-section">
              <h3>{t.modalInfoSec1T}</h3>
              <p>{t.modalInfoSec1D}</p>
            </div>
            <div className="info-section">
              <h3>{t.modalInfoSec2T}</h3>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: t.modalInfoUse1 }}></li>
                <li dangerouslySetInnerHTML={{ __html: t.modalInfoUse2 }}></li>
                <li dangerouslySetInnerHTML={{ __html: t.modalInfoUse3 }}></li>
              </ul>
            </div>
            <div className="info-section">
              <h3>{t.modalInfoSec3T}</h3>
              <ul>
                <li dangerouslySetInnerHTML={{ __html: t.modalInfoPro1 }}></li>
                <li dangerouslySetInnerHTML={{ __html: t.modalInfoPro2 }}></li>
              </ul>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="add-btn" onClick={() => setInfoOpen(false)}>{t.modalInfoBtn}</button>
            </div>
          </div>
        </div>
      )}

      {donateOpen && (
        <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setDonateOpen(false); }}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setDonateOpen(false)}>&times;</button>
            <h2 className="modal-title">{t.modalDonTitle}</h2>
            <p className="donate-text">{t.modalDonDesc}</p>
            <div className="payment-box">
              <h3 style={{ marginTop: 0 }}>PayPal</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t.modalDonPpDesc}</p>
              <a href="https://www.paypal.me/TaskFlowPost" target="_blank" rel="noreferrer" className="paypal-link">{t.modalDonPpBtn}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
