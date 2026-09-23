
// IMPORTS

import "./style.css";

// Obtener elementos

const radioA = document.getElementById("routine-a") as HTMLInputElement;
const radioB = document.getElementById("routine-b") as HTMLInputElement;
const sessionDate = document.querySelector(".date-input") as HTMLInputElement;

const exercisesInputs = document.querySelector(".exercises") as HTMLFieldSetElement;

const submitBtn = document.querySelector(".submit-btn") as HTMLButtonElement;


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


// Listeners

submitBtn.addEventListener("click", (event: Event) => {
  event.preventDefault();

  const inputs = document.querySelectorAll("input[type='number']");
  console.log(radioA.checked)
  let routineValue: String = "";
  if (radioA) {
    routineValue = "A";
  } else if (radioB) {
    routineValue = "B"
  }
  console.log(routineValue)

  inputs.forEach(el => {
    console.log(el.valueAsNumber)
    const newSession: Session = {
      id: Date.now() + Math.floor(Math.random() * 500),
      date: sessionDate.value,
      routine: routineValue,
    }
  })


})

/**
radioA.addEventListener("change", (event: Event) => {

  event.preventDefault();


  if (radioA.checked) {

    // Formatear formulario
    exercisesInputs.innerHTML = "";

    // Crear inputs dinámicos



  }
})

radioB.addEventListener("change", (event: Event) => {

  event.preventDefault();

  console.log(sessionDate.value)
  if (radioB.checked) {
    console.log("Hola B")
  }
})

 */
