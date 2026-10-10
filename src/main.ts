import "./style.css";

// ---------- TIPOS ----------
type Serie = number | { left: number; right: number } | number[];
interface RepsExercise { type: "reps"; name: string; series: Serie[]; weight: number; rest: number }
interface TimeExercise { type: "time"; name: string; duration: number; rest: number }
type Exercise = RepsExercise | TimeExercise;
type RoutineId = "A" | "B";
interface Session { id: number; date: string; routine: RoutineId; exercises: Exercise[] }

// ---------- STORAGE ----------
const KEY = "sessions";
const save = (s: Session[]): void => localStorage.setItem(KEY, JSON.stringify(s));
function load(): Session[] {
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Session[]) : []; }
  catch { return []; }
}
let sessions: Session[] = load();

// ---------- FORMULARIO: cada rutina descrita como datos (los ids son los de tu HTML) ----------
type Spec =
  | { kind: "time"; name: string; timeId: string; restId: string }
  | { kind: "uniform"; name: string; id: string; weight: number } // ids: `${id}-series|reps|rest`
  | { kind: "list"; name: string; repIds: string[]; restId: string; weight: number }
  | { kind: "pairs"; name: string; ids: [string, string][]; restId: string; weight: number };

const n4 = [1, 2, 3, 4];
const ROUTINES: Record<RoutineId, Spec[]> = {
  A: [
    { kind: "time", name: "Planchas", timeId: "planches-time-a", restId: "planches-rest-a" },
    { kind: "uniform", name: "Sentadilla Goblet", id: "goblet", weight: 6 },
    { kind: "list", name: "Flexiones de Brazo", repIds: n4.map(n => `pushups-reps-${n}`), restId: "pushups-rest", weight: 0 },
    { kind: "uniform", name: "Remo con Mancuerna", id: "dumbbell", weight: 6 },
    { kind: "pairs", name: "Curl de Bíceps", ids: n4.map(n => [`biceps-s${n}-izq`, `biceps-s${n}-der`] as [string, string]), restId: "biceps-rest", weight: 6 },
    { kind: "uniform", name: "Fondo de Tríceps", id: "triceps", weight: 0 },
  ],
  B: [
    { kind: "time", name: "Planchas", timeId: "planches-time-b", restId: "planches-rest-b" },
    { kind: "uniform", name: "Sentadillas Búlgara", id: "bulgarian", weight: 0 },
    { kind: "uniform", name: "Peso Muerto Rumano", id: "deadlift", weight: 0 },
    { kind: "uniform", name: "Elevación lateral de Hombros", id: "shoulder", weight: 0 },
    { kind: "uniform", name: "Bird Dog", id: "birddog", weight: 0 },
    { kind: "uniform", name: "Elevación de Piernas", id: "elevation", weight: 0 },
  ],
};

const num = (id: string): number => (document.getElementById(id) as HTMLInputElement).valueAsNumber;
const repsToArray = (reps: number, series: number): number[] => Array.from({ length: Math.max(0, series || 0) }, () => reps);

function readExercise(s: Spec): Exercise {
  switch (s.kind) {
    case "time": return { type: "time", name: s.name, duration: num(s.timeId), rest: num(s.restId) };
    case "uniform": return { type: "reps", name: s.name, series: repsToArray(num(`${s.id}-reps`), num(`${s.id}-series`)), weight: s.weight, rest: num(`${s.id}-rest`) };
    case "list": return { type: "reps", name: s.name, series: s.repIds.map(num), weight: s.weight, rest: num(s.restId) };
    case "pairs": return { type: "reps", name: s.name, series: s.ids.map(([l, r]) => ({ left: num(l), right: num(r) })), weight: s.weight, rest: num(s.restId) };
  }
}

// ---------- CÁLCULOS (Fase 5) ----------
function repsDeSerie(s: Serie): number {
  if (typeof s === "number") return s;           // type narrowing
  if (Array.isArray(s)) return s.reduce((a, b) => a + b, 0);
  return s.left + s.right;
}
const volumenEjercicio = (e: Exercise): number =>
  e.type === "time" ? e.duration : e.series.reduce<number>((acc, s) => acc + repsDeSerie(s), 0);

const byDate = (a: Session, b: Session): number => a.date.localeCompare(b.date) || a.id - b.id;

function historialEjercicio(name: string): { fecha: string; volumen: number }[] {
  return [...sessions].sort(byDate).flatMap(s => {
    const e = s.exercises.find(x => x.name === name);
    return e ? [{ fecha: s.date, volumen: volumenEjercicio(e) }] : [];
  });
}
// Meseta: en las últimas n sesiones, ninguna superó el volumen de la más antigua de ese grupo.
function detectarMeseta(name: string, n = 3): boolean {
  const h = historialEjercicio(name);
  if (h.length < n) return false;
  const w = h.slice(-n);
  return w.slice(1).every(p => p.volumen <= w[0].volumen);
}

// ---------- VALIDACIÓN (Fase 7) ----------
function isValid(e: Exercise): boolean {
  const ok = (x: number): boolean => Number.isFinite(x) && x >= 0;
  if (!ok(e.rest)) return false;
  if (e.type === "time") return ok(e.duration) && e.duration > 0;
  return e.series.length > 0 && e.series.every(s => ok(repsDeSerie(s)));
}

// ---------- RENDER (Fase 4) ----------
const $ = <T extends HTMLElement>(sel: string): T => document.querySelector(sel) as T;
const fmtDate = (d: string): string => d.split("-").reverse().join("/");
const serieTxt = (s: Serie): string => (typeof s === "number" ? String(s) : Array.isArray(s) ? s.join("+") : `${s.left}/${s.right}`);

function exerciseRow(e: Exercise): string {
  let detail: string;
  if (e.type === "time") detail = `<p class="reps">${e.duration}x${e.rest} seg</p>`;
  else if (e.series.some(s => typeof s === "object" && !Array.isArray(s))) {
    const side = (k: "left" | "right") => e.series.map(s => (typeof s === "object" && !Array.isArray(s) ? s[k] : "-")).join(" ");
    detail = `<div class="curl-info"><p class="left reps">I: ${side("left")}</p><p class="right reps">D: ${side("right")}</p></div>`;
  } else detail = `<p class="reps">${e.series.map(serieTxt).join(" ")}</p>`;
  return `<div class="exercise-info"><p class="exercise-name">${e.name}</p>${detail}</div>`;
}
const cardHTML = (s: Session): string => `
  <div class="routine-card card-${s.routine.toLowerCase()}">
    <header class="card-header">
      <h4 class="routine-name">Full Body ${s.routine}</h4>
      <p class="routine-date">${fmtDate(s.date)}</p>
      <button class="delete-btn" type="button" data-id="${s.id}" aria-label="Eliminar sesión">🗑</button>
    </header>
    <section class="card-main">
      <header class="table-header"><p class="table-header__title">Ejercicio</p><p class="table-header__title">Desglose</p></header>
      <main class="table-contain">${s.exercises.map(exerciseRow).join("")}</main>
    </section>
  </div>`;

function render(): void {
  const recent = [...sessions].sort(byDate).reverse(); // más reciente primero
  // .record usa *-reverse en tu CSS: el DOM va de más antigua a más nueva
  $(".record").innerHTML = recent.length
    ? recent.slice(0, 5).reverse().map(cardHTML).join("")
    : `<p class="empty">Aún no registras sesiones</p>`;
  $("#history-list").innerHTML = recent.map(cardHTML).join("");
  $("#more-btn").classList.toggle("hidden", recent.length <= 5);

  const names = [...new Set(sessions.flatMap(s => s.exercises.map(e => e.name)))];
  const stalled = names.filter(n => detectarMeseta(n));
  $("#notices").innerHTML = stalled.map(n => `<p class="notice">⚠ Llevas 3 sesiones sin progresar en ${n}</p>`).join("");
}

// ---------- MODALES ----------
function setupModal(modal: HTMLElement, openBtn: HTMLElement): void {
  const close = (): void => modal.classList.add("hidden");
  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  modal.querySelector(".close-btn")?.addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}
const formModal = $("#form-modal");
setupModal(formModal, $(".add-btn"));
setupModal($("#history-modal"), $("#more-btn"));

// ---------- FORMULARIO ----------
const form = $<HTMLFormElement>(".session-form");
const routineSel = $<HTMLSelectElement>("#routine");
const fieldsets: Record<RoutineId, HTMLElement> = { A: $(".full-body-a"), B: $(".full-body-b") };
const errorEl = $("#form-error");

$(".initial-btn").addEventListener("click", e => {
  e.preventDefault();
  const r = routineSel.value;
  if (r === "A" || r === "B") {            // valida en ejecución y de paso angosta el tipo a "A" | "B"
    fieldsets.A.classList.toggle("hidden", r !== "A");
    fieldsets.B.classList.toggle("hidden", r !== "B");
  }
});

function register(r: RoutineId): void {
  const date = $<HTMLInputElement>("#date").value;
  const exercises = ROUTINES[r].map(readExercise);
  if (!date || !exercises.every(isValid)) {
    errorEl.textContent = "Completa la fecha y todos los campos con números válidos (sin negativos).";
    return;
  }
  errorEl.textContent = "";
  sessions.push({ id: Date.now(), date, routine: r, exercises });
  save(sessions);
  form.reset();
  fieldsets.A.classList.add("hidden");
  fieldsets.B.classList.add("hidden");
  formModal.classList.add("hidden");
  render();
}
$(".input-btn-a").addEventListener("click", () => register("A"));
$(".input-btn-b").addEventListener("click", () => register("B"));

// Eliminar 
document.addEventListener("click", e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>(".delete-btn");
  if (!btn || !confirm("¿Eliminar esta sesión?")) return;
  sessions = sessions.filter(s => s.id !== Number(btn.dataset.id));
  save(sessions);
  render();
});

render();