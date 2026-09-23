
// IMPORTS

import "./style.css";



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

