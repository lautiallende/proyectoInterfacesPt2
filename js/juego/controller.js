import { ModeloPeg } from "./model.js";
import { VistaPeg } from "./view.js";

export class ControladorPeg {
  constructor(canvas, imagenes) {
    this.modelo = new ModeloPeg();
    this.vista = new VistaPeg(canvas, imagenes);
    this.seleccionada = null;
    this.configurarEventos();
    this.iniciarTemporizador();
    this.vista.dibujarTablero(this.modelo.tablero);
    this.movimientos = 0;
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
            this.movimientos++; // contar movimiento
            this.vista.dibujarTablero(this.modelo.tablero);

            if (this.modelo.estaTerminado()) {
                const tiempo = Math.floor((Date.now() - this.inicioTiempo) / 1000);
                this.vista.mostrarFin(`¡Victoria!\nMovimientos: ${this.movimientos}\nTiempo: ${tiempo}s`);
            }
        }
    });

    document.getElementById("reiniciar").addEventListener("click", () => {
        this.modelo = new ModeloPeg();
        this.movimientos = 0;
        this.vista.ocultarFin();
        this.iniciarTemporizador();
        this.vista.dibujarTablero(this.modelo.tablero);
        this.seleccionada = null;
    });
  }

  // Convierte la posición del mouse en coordenadas del tablero
  obtenerPosicion(e) {
    const rect = this.vista.canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / 100),
      y: Math.floor((e.clientY - rect.top) / 100)
    };
  }

  // Inicia el temporizador del juego
  iniciarTemporizador() {
    if (this.intervalo) clearInterval(this.intervalo);
    this.inicioTiempo = Date.now(); // guardar inicio
    this.intervalo = setInterval(() => {
        const transcurrido = Math.floor((Date.now() - this.inicioTiempo) / 1000);
        document.getElementById("timer").textContent = `Tiempo: ${transcurrido}s`;
    }, 1000);
  }

}