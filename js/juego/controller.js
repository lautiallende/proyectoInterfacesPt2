import { ModeloPeg } from "./model.js";
import { VistaPeg } from "./view.js";

export class ControladorPeg {
  constructor(canvas, imagenes, nombreFicha = "ficha1") {
    this.modelo = new ModeloPeg(nombreFicha);
    this.vista = new VistaPeg(canvas, imagenes);
    this.seleccionada = null;
    this.movimientos = 0;
    this.intervalo = null; // ✅ importante
    this.arrastrando = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.loopArrastreID = null;

    this.configurarEventos();
    this.vista.dibujarTablero(this.modelo.tablero);
  }


  // Configura los eventos del usuario
configurarEventos() {
  const canvas = this.vista.canvas;

  canvas.addEventListener("mousedown", e => {
    const posicion = this.obtenerPosicion(e);
    if (this.modelo.tablero[posicion.y][posicion.x] === 1) {
      this.seleccionada = posicion;
      this.arrastrando = true;

      // 🖱️ Guardar posición del mouse
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      // 🎯 Filtrar movimientos válidos
      const sugerencias = this.modelo.obtenerMovimientosValidos(posicion.x, posicion.y)
        .filter(mov => this.modelo.tablero[mov.y][mov.x] === 0);

      // 🧼 Mostrar hints
      this.vista.animarHints(sugerencias);

      // 🖼️ Dibujar inmediatamente la ficha flotante
      this.vista.dibujarTablero(this.modelo.tablero, this.seleccionada);
      this.vista.dibujarFicha(this.mouseX, this.mouseY, this.vista.casillaSize / 2.5, 1.2, true);

      //  Iniciar bucle de arrastre visual
      const dibujarArrastre = () => {
        if (!this.arrastrando || !this.seleccionada || !this.vista.imagenCargada) return;

        this.vista.dibujarTablero(this.modelo.tablero, this.seleccionada);
        this.vista.dibujarFicha(this.mouseX, this.mouseY, this.vista.casillaSize / 2.5, 1.2, true);

        this.loopArrastreID = requestAnimationFrame(dibujarArrastre);
      };

      dibujarArrastre(); // inicia después del primer render
    }
  });

  canvas.addEventListener("mousemove", e => {
    if (!this.arrastrando || !this.seleccionada || !this.vista.imagenCargada) return;

    const rect = canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", e => {
    if (!this.seleccionada) return;
    this.arrastrando = false;

    if (this.loopArrastreID) {
      cancelAnimationFrame(this.loopArrastreID);
      this.loopArrastreID = null;
    }

    const destino = this.obtenerPosicion(e);
    const movimientoValido = this.modelo.moverFicha(this.seleccionada, destino);

    if (movimientoValido) {
      this.vista.animarMovimiento(this.seleccionada, destino, this.modelo.tablero, () => {
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
      });
    } else {
      this.vista.animarMovimiento(destino, this.seleccionada, this.modelo.tablero, () => {
        this.vista.dibujarTablero(this.modelo.tablero);
      }, true); // rebote
    }

    this.seleccionada = null;
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

    // ✅ Mostrar 0s inmediatamente
    document.getElementById("timer").textContent = `Tiempo: 0s`;

    this.intervalo = setInterval(() => {
      const transcurrido = Math.floor((Date.now() - this.inicioTiempo) / 1000);
      document.getElementById("timer").textContent = `Tiempo: ${transcurrido}s`;
    }, 1000);
  }


  // Reinicia el juego
  iniciarJuego(nombreFicha = "ficha1") {
    this.modelo = new ModeloPeg(nombreFicha); 
    window.modelo = this.modelo;
    this.movimientos = 0;
    this.seleccionada = null;
    this.vista.ocultarFin();
    this.iniciarTemporizador();
    this.vista.dibujarTablero(this.modelo.tablero);
  }

}