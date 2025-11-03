import { ModeloPeg } from "./model.js";
import { VistaPeg } from "./view.js";

export class ControladorPeg {
  constructor(canvas, imagenes) {
    this.modelo = new ModeloPeg();
    this.vista = new VistaPeg(canvas, imagenes);
    this.seleccionada = null;
    this.movimientos = 0;
    this.configurarEventos();
    this.iniciarTemporizador();
    this.vista.dibujarTablero(this.modelo.tablero);
  }

  // Configura los eventos del usuario
  configurarEventos() {
    const canvas = this.vista.canvas;

    canvas.addEventListener("mousedown", e => {
      const posicion = this.obtenerPosicion(e);
      this.seleccionada = posicion;
      const sugerencias = this.modelo.obtenerMovimientosValidos(posicion.x, posicion.y);
      this.vista.dibujarTablero(this.modelo.tablero);
      this.vista.mostrarSugerencias(sugerencias);
    });

    canvas.addEventListener("mouseup", e => {
      const destino = this.obtenerPosicion(e);
      if (this.modelo.moverFicha(this.seleccionada, destino)) {
        this.movimientos++;
        this.vista.dibujarTablero(this.modelo.tablero);

        if (this.modelo.estaTerminado()) {
          const tiempo = Math.floor((Date.now() - this.inicioTiempo) / 1000);
          const restantes = this.modelo.contarFichas();
          const mensaje = restantes === 1
            ? `¡Victoria!\nMovimientos: ${this.movimientos}\nTiempo: ${tiempo}s`
            : `Sin movimientos.\nMovimientos: ${this.movimientos}\nTiempo: ${tiempo}s`;
          this.vista.mostrarFin(mensaje);
        }
      }
    });

    document.getElementById("reiniciar").addEventListener("click", () => {
      this.iniciarJuego();
    });
  }

  // Convierte la posición del mouse en coordenadas del tablero
  obtenerPosicion(e) {
    const casillaSize = this.vista.canvas.width / 7;
    const rect = this.vista.canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / casillaSize),
      y: Math.floor((e.clientY - rect.top) / casillaSize)
    };
  }

  // Inicia el temporizador del juego
  iniciarTemporizador() {
    if (this.intervalo) clearInterval(this.intervalo);
    this.inicioTiempo = Date.now();
    this.intervalo = setInterval(() => {
      const transcurrido = Math.floor((Date.now() - this.inicioTiempo) / 1000);
      document.getElementById("timer").textContent = `Tiempo: ${transcurrido}s`;
    }, 1000);
  }

  // Reinicia el juego
  iniciarJuego() {
    this.modelo = new ModeloPeg();
    this.movimientos = 0;
    this.seleccionada = null;
    this.vista.ocultarFin();
    this.iniciarTemporizador();
    this.vista.dibujarTablero(this.modelo.tablero);
  }
}