import { ControladorPeg } from "./controller.js";
let controlador = null;

document.getElementById("comenzar").addEventListener("click", () => {
  document.getElementById("menu-inicial").style.display = "none";
  document.querySelector(".contenedor-juego-peg").style.display = "block";

  const canvas = document.getElementById("canvas-juego");
  canvas.width = 400;
  canvas.height = 400;

  // ✅ Limpiar temporizador anterior si existe
  if (controlador && controlador.intervalo) {
    clearInterval(controlador.intervalo);
  }

  controlador = new ControladorPeg(canvas);
  controlador.iniciarJuego(); // ✅ iniciar correctamente
});


document.getElementById("reintentar").addEventListener("click", () => {
  if (controlador) controlador.iniciarJuego();
});

document.getElementById("volver-menu").addEventListener("click", () => {
  document.querySelector(".contenedor-juego-peg").style.display = "none";
  document.getElementById("menu-inicial").style.display = "flex";
});

document.getElementById("reiniciar").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
  if (controlador) controlador.iniciarJuego();
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas-juego");
  new ControladorPeg(canvas);
});