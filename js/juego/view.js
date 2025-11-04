export class VistaPeg {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.casillaSize = canvas.width / 7;
    this.animacionHintsID = null;
    this.fondoCanvas = new Image();
    this.fondoCanvas.src = "img/tablero.png";

    // Imagen por defecto (no se usa para fichas aleatorias, pero puede servir para fallback)
    this.imagenFicha = document.getElementById("ficha-img");
    this.imagenCargada = this.imagenFicha.complete && this.imagenFicha.naturalWidth > 0;
    this.imagenFicha.onload = () => {
      this.imagenCargada = true;
    };

    // Precargar imágenes de fichas aleatorias
    this.imagenesPrecargadas = {};
    for (let i = 1; i <= 4; i++) {
      const nombre = `ficha${i}`;
      const img = new Image();
      img.src = `img/${nombre}.png`;
      this.imagenesPrecargadas[nombre] = img;
    }
    // Fondo del canvas
    this.fondoCanvas = new Image();
    this.fondoCanvas.src = "img/tablero.png";
  }

  // Dibuja el tablero y las fichas
  dibujarTablero(estadoTablero, fichaSeleccionada = null) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 🖼️ Dibujar fondo del canvas
    if (this.fondoCanvas.complete) {
      this.ctx.drawImage(this.fondoCanvas, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.fondoCanvas.onload = () => {
        this.ctx.drawImage(this.fondoCanvas, 0, 0, this.canvas.width, this.canvas.height);
      };
    }

    for (let y = 0; y < estadoTablero.length; y++) {
      for (let x = 0; x < estadoTablero[y].length; x++) {
        const celda = estadoTablero[y][x];
        const posX = x * this.casillaSize;
        const posY = y * this.casillaSize;

        if (celda === -1) continue;

        // ❌ Sin fondo de casilla
        // ✅ Solo borde
        //this.ctx.strokeStyle = none;
        //this.ctx.strokeRect(posX, posY, this.casillaSize, this.casillaSize);

        // 🎲 Dibujar ficha si está presente y no es la seleccionada
        if (celda === 1 && !(fichaSeleccionada?.x === x && fichaSeleccionada?.y === y)) {
          const nombre = window.modelo?.imagenesFichas?.[y]?.[x];
          const img = this.imagenesPrecargadas[nombre];

          if (img && img.complete) {
            this.ctx.drawImage(
              img,
              posX + this.casillaSize / 2 - this.casillaSize / 2.5,
              posY + this.casillaSize / 2 - this.casillaSize / 2.5,
              this.casillaSize / 1.25,
              this.casillaSize / 1.25
            );
          }
        }
      }
    }
  }

  // Muestra sugerencias como círculos blancos
  mostrarSugerencias(movimientos) {
    movimientos.forEach(mov => {
      const posX = mov.x * this.casillaSize + this.casillaSize / 2;
      const posY = mov.y * this.casillaSize + this.casillaSize / 2;
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(posX, posY, this.casillaSize / 7, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // Muestra mensaje de fin de juego
  mostrarFin(mensaje) {
    const overlay = document.getElementById("overlay");
    const mensajeFinal = document.getElementById("mensaje-final");
    mensajeFinal.innerText = mensaje;
    overlay.style.display = "flex";
  }

  // Oculta el mensaje de fin de juego
  ocultarFin() {
    document.getElementById("overlay").style.display = "none";
  }

  dibujarFicha(x, y, radio, scale = 1, shadow = false, nombre = null) {
    const size = radio * 2 * scale;
    this.ctx.save();
    if (shadow) {
      this.ctx.shadowColor = "rgba(0,0,0,0.5)";
      this.ctx.shadowBlur = 15;
    }

    const img = nombre ? this.imagenesPrecargadas[nombre] : this.imagenFicha;
    if (img && img.complete) {
      this.ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    }

    this.ctx.restore();
  }


animarMovimiento(origen, destino, tablero, callback, rebote = false) {
  const startX = origen.x * this.casillaSize + this.casillaSize / 2;
  const startY = origen.y * this.casillaSize + this.casillaSize / 2;
  const endX = destino.x * this.casillaSize + this.casillaSize / 2;
  const endY = destino.y * this.casillaSize + this.casillaSize / 2;

  const duracion = 400;
  const inicio = performance.now();

  const easeOutBounce = (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  };

  const animar = (tiempo) => {
    const t = Math.min((tiempo - inicio) / duracion, 1);
    const progreso = rebote ? easeOutBounce(t) : t;
    const x = startX + (endX - startX) * progreso;
    const y = startY + (endY - startY) * progreso;

    this.dibujarTablero(tablero, origen); // oculta ficha original
    this.dibujarFicha(x, y, this.casillaSize / 2.5, 1.2, true);

    if (t < 1) {
      requestAnimationFrame(animar);
    } else {
      callback?.();
    }
  };

  requestAnimationFrame(animar);
}
animarHints(movimientos) {
  if (this.animacionHintsID) cancelAnimationFrame(this.animacionHintsID);

let frame = 0;
const maxFrames = 60;

const animar = () => {
  this.dibujarTablero(window.modelo.tablero, window.controlador?.seleccionada);

  const scale = 1 + 0.2 * Math.sin(frame / 10);
  movimientos.forEach(mov => {
    const x = mov.x * this.casillaSize + this.casillaSize / 2;
    const y = mov.y * this.casillaSize + this.casillaSize / 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, (this.casillaSize / 7) * scale, 0, Math.PI * 2);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
  });

  frame++;
  if (frame < maxFrames) {
    this.animacionHintsID = requestAnimationFrame(animar);
  } else {
    this.animacionHintsID = null;
  }
};

this.animacionHintsID = requestAnimationFrame(animar);
}
}
