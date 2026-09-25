
// IMPORTS

import "./style.css";

// Obtener elementos.

const addRoutineBtn = document.querySelector(".add-btn") as HTMLButtonElement;
const closeModalBtn = document.querySelector(".close-btn") as HTMLButtonElement;
const modalWindow = document.querySelector(".modal") as HTMLDivElement;

const selectRoutineBtn = document.querySelector(".initial-btn") as HTMLButtonElement;
const routine = document.querySelector("#routine") as HTMLSelectElement;

const formA = document.querySelector(".full-body-a") as HTMLFieldSetElement;
const formB = document.querySelector(".full-body-b") as HTMLFieldSetElement;



// Se definen las reglas de los datos a almacenar.

type Serie = number | { izquierda: number; derecha: number };

interface Exercise {
  name: string;
  series: Serie[]; // .length indica la cantidad de series y su value las repeticiones.
  weight: number;
  rest: number;
}

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
  event.preventDefault();
  if (event.target == modalWindow) {
    modalWindow.classList.add("hidden");
  }
})

// SELECCIONAR FORMULARIO

selectRoutineBtn.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault()
  console.log(routine.value)
  if (routine.value === "A") {
    formB.classList.add("hidden");
    formA.classList.remove("hidden");
  }
  else if (routine.value === "B") {
    formA.classList.add("hidden");
    formB.classList.remove("hidden");
  }
})




