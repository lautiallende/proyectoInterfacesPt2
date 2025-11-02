import { ControladorPeg } from "./controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas-juego");
  new ControladorPeg(canvas);
});