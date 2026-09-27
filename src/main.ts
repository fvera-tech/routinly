
// IMPORTS

import "./style.css";

// Obtener elementos.

const form = document.querySelector(".session-form") as HTMLFormElement

const addRoutineBtn = document.querySelector(".add-btn") as HTMLButtonElement;
const closeModalBtn = document.querySelector(".close-btn") as HTMLButtonElement;
const modalWindow = document.querySelector(".modal") as HTMLDivElement;

const dateInput = document.querySelector("#date") as HTMLInputElement;
const selectRoutineBtn = document.querySelector(".initial-btn") as HTMLButtonElement;
const routine = document.querySelector("#routine") as HTMLSelectElement;

// Inputs A
const planchesDurationA = document.querySelector("#planches-time-a") as HTMLInputElement;
const planchesRestA = document.querySelector("#planches-rest-a") as HTMLInputElement;

const gobletSeries = document.querySelector("#goblet-series") as HTMLInputElement;
const gobletReps = document.querySelector("#goblet-reps") as HTMLInputElement;
const gobletRest = document.querySelector("#goblet-rest") as HTMLInputElement;

const pushupsSeries = document.querySelector("#pushups-series") as HTMLInputElement;
const pushupsReps1 = document.querySelector("#pushups-reps-1") as HTMLInputElement;
const pushupsReps2 = document.querySelector("#pushups-reps-2") as HTMLInputElement;
const pushupsReps3 = document.querySelector("#pushups-reps-3") as HTMLInputElement;
const pushupsReps4 = document.querySelector("#pushups-reps-4") as HTMLInputElement;
const pushupsRest = document.querySelector("#pushups-rest") as HTMLInputElement;

const dumbbellSeries = document.querySelector("#dumbbell-series") as HTMLInputElement;
const dumbbellReps = document.querySelector("#dumbbell-reps") as HTMLInputElement;
const dumbbellRest = document.querySelector("#dumbbell-rest") as HTMLInputElement;

const curlRest = document.querySelector("#biceps-rest") as HTMLInputElement;

const curlLeft1 = document.querySelector("#biceps-s1-izq") as HTMLInputElement;
const curlLeft2 = document.querySelector("#biceps-s2-izq") as HTMLInputElement;
const curlLeft3 = document.querySelector("#biceps-s3-izq") as HTMLInputElement;
const curlLeft4 = document.querySelector("#biceps-s4-izq") as HTMLInputElement;

const curlRight1 = document.querySelector("#biceps-s1-der") as HTMLInputElement;
const curlRight2 = document.querySelector("#biceps-s2-der") as HTMLInputElement;
const curlRight3 = document.querySelector("#biceps-s3-der") as HTMLInputElement;
const curlRight4 = document.querySelector("#biceps-s4-der") as HTMLInputElement;

const tricepsSeries = document.querySelector("#triceps-series") as HTMLInputElement;
const tricepsReps = document.querySelector("#triceps-reps") as HTMLInputElement;
const tricepsRest = document.querySelector("#triceps-rest") as HTMLInputElement;

const formA = document.querySelector(".full-body-a") as HTMLFieldSetElement;
const formB = document.querySelector(".full-body-b") as HTMLFieldSetElement;

// Inputs B

const planchesDurationB = document.querySelector("#planches-time-b") as HTMLInputElement;
const planchesRestB = document.querySelector("#planches-rest-b") as HTMLInputElement;

const bulgarianSeries = document.querySelector("#bulgarian-series") as HTMLInputElement;
const bulgarianReps = document.querySelector("#bulgarian-reps") as HTMLInputElement;
const bulgarianRest = document.querySelector("#bulgarian-rest") as HTMLInputElement;

const deadliftSeries = document.querySelector("#deadlift-series") as HTMLInputElement;
const deadliftReps = document.querySelector("#deadlift-reps") as HTMLInputElement;
const deadliftRest = document.querySelector("#deadlift-rest") as HTMLInputElement;

const shoulderSeries = document.querySelector("#shoulder-series") as HTMLInputElement;
const shoulderReps = document.querySelector("#shoulder-reps") as HTMLInputElement;
const shoulderRest = document.querySelector("#shoulder-rest") as HTMLInputElement;

const birdDogSeries = document.querySelector("#birddog-series") as HTMLInputElement;
const birdDogReps = document.querySelector("#birddog-reps") as HTMLInputElement;
const birdDogRest = document.querySelector("#birddog-rest") as HTMLInputElement;

const elevationSeries = document.querySelector("#elevation-series") as HTMLInputElement;
const elevationReps = document.querySelector("#elevation-reps") as HTMLInputElement;
const elevationRest = document.querySelector("#elevation-rest") as HTMLInputElement;

const inputBtnA = document.querySelector(".input-btn-a") as HTMLButtonElement;
const inputBtnB = document.querySelector(".input-btn-b") as HTMLButtonElement;

// Functions

function repsToArray(reps: number, series: number) {

  let result: number[] = [];
  for (let i = 1; i <= series; i++) {
    result.push(reps)
  }

  return result
}

function curlsToArray(series: number): Serie[] {

  let result: Serie[] = []


  console.log(result)
}

function createListOfExercises(...exercises: Exercise[]): Exercise[] {
  return exercises;
}

// Se definen las reglas de los datos a almacenar.

type Serie = number | { left: number; right: number } | Number[]

interface RepsExercise {
  type: "reps";
  name: string;
  series: Serie[];
  weight: number;
  rest: number;
}

interface TimeExercise {
  type: "time";
  name: string;
  duration: number; // segundos
  rest: number;
}

type Exercise = RepsExercise | TimeExercise;

interface Session {
  id: number; // Date.now()
  date: string; // (xx-xx-xxxx)
  routine: "A" | "B";
  exercises: Exercise[];
};

let sessions: Session[] = [];

// VENTANA MODAL

addRoutineBtn.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();
  modalWindow.classList.remove("hidden");
})

closeModalBtn.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();
  modalWindow.classList.add("hidden");
})

modalWindow.addEventListener("click", (event: MouseEvent) => {

  if (event.target == modalWindow) {
    event.preventDefault();
    modalWindow.classList.add("hidden");
  }
})

// SELECCIONAR FORMULARIO

selectRoutineBtn.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault()
  if (routine.value === "A") {
    formB.classList.add("hidden");
    formA.classList.remove("hidden");
  }
  else if (routine.value === "B") {
    formA.classList.add("hidden");
    formB.classList.remove("hidden");
  }
})

// Registrar rutinas

inputBtnA.addEventListener("click", () => {
  const routineDate: String = dateInput.value;
  const routineType: String = routine.value;

  const planches: TimeExercise = {
    type: "time",
    name: "Planchas",
    duration: planchesDurationA.valueAsNumber,
    rest: planchesRestA.valueAsNumber
  }

  const goblet: RepsExercise = {
    type: "reps",
    name: "Sentadilla Goblet",
    series: repsToArray(gobletReps.valueAsNumber, gobletSeries.valueAsNumber),
    weight: 6,
    rest: gobletRest.valueAsNumber,
  }

  const pushups: RepsExercise = {
    type: "reps",
    name: "Flexiones de Brazo",
    series: [pushupsReps1.valueAsNumber, pushupsReps2.valueAsNumber, pushupsReps3.valueAsNumber, pushupsReps4.valueAsNumber],
    weight: 0,
    rest: pushupsRest.valueAsNumber,
  }

  const dumbbell: RepsExercise = {
    type: "reps",
    name: "Remo con Mancuerna",
    series: repsToArray(dumbbellReps.valueAsNumber, dumbbellSeries.valueAsNumber),
    weight: 6,
    rest: dumbbellRest.valueAsNumber,
  }

  const curls: RepsExercise = {
    type: "reps",
    name: "Remo con Mancuerna",
    series: [
      { left: curlLeft1.valueAsNumber, right: curlRight1.valueAsNumber },
      { left: curlLeft2.valueAsNumber, right: curlRight2.valueAsNumber },
      { left: curlLeft3.valueAsNumber, right: curlRight3.valueAsNumber },
      { left: curlLeft4.valueAsNumber, right: curlRight4.valueAsNumber },
    ],
    weight: 6,
    rest: curlRest.valueAsNumber,
  }

  const triceps: RepsExercise = {
    type: "reps",
    name: "Remo con Mancuerna",
    series: repsToArray(tricepsReps.valueAsNumber, tricepsSeries.valueAsNumber),
    weight: 0,
    rest: tricepsRest.valueAsNumber,
  }

  const routineResults: Session = {
    id: Date.now() + Math.floor(Math.random()),
    date: routineDate,
    routine: routineType,
    exercises: createListOfExercises(planches, goblet, pushups, dumbbell, curls, triceps),
  }
  console.log(routineResults)

  form.reset();

})

inputBtnB.addEventListener("click", () => {
  const routineDate: String = dateInput.value;
  const routineType: String = routine.value;

  const planches: TimeExercise = {
    type: "time",
    name: "Planchas",
    duration: planchesDurationB.valueAsNumber,
    rest: planchesRestB.valueAsNumber
  }

  const bulgarian: RepsExercise = {
    type: "reps",
    name: "Sentadillas Búlgara",
    series: repsToArray(bulgarianReps.valueAsNumber, bulgarianSeries.valueAsNumber),
    weight: 0,
    rest: bulgarianRest.valueAsNumber
  }

  const deadlift: RepsExercise = {
    type: "reps",
    name: "Peso Muerto Rumano",
    series: repsToArray(deadliftReps.valueAsNumber, deadliftSeries.valueAsNumber),
    weight: 0,
    rest: deadliftRest.valueAsNumber
  }

  const shoulder: RepsExercise = {
    type: "reps",
    name: "Elevació lateral de Hombros",
    series: repsToArray(shoulderReps.valueAsNumber, shoulderSeries.valueAsNumber),
    weight: 0,
    rest: shoulderRest.valueAsNumber
  }

  const birdDog: RepsExercise = {
    type: "reps",
    name: "Bird Dog",
    series: repsToArray(birdDogReps.valueAsNumber, birdDogSeries.valueAsNumber),
    weight: 0,
    rest: birdDogRest.valueAsNumber
  }

  const elevation: RepsExercise = {
    type: "reps",
    name: "Elevación de Piernas",
    series: repsToArray(elevationReps.valueAsNumber, elevationSeries.valueAsNumber),
    weight: 0,
    rest: elevationRest.valueAsNumber
  }

  const routineResults: Session = {
    id: Date.now() + Math.floor(Math.random()),
    date: routineDate,
    routine: routineType,
    exercises: createListOfExercises(planches, bulgarian, deadlift, shoulder, birdDog, elevation),
  }

  console.log(routineResults)
  form.reset();

})






