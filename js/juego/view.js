export class VistaPeg {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.casillaSize = canvas.width / 7; // cada casilla mide ~57.14 px
  }

  // Dibuja el tablero y las fichas
  dibujarTablero(estadoTablero) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < estadoTablero.length; y++) {
      for (let x = 0; x < estadoTablero[y].length; x++) {
        const celda = estadoTablero[y][x];
        const posX = x * this.casillaSize;
        const posY = y * this.casillaSize;

        if (celda === -1) continue;

        // Fondo de casilla jugable
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(posX, posY, this.casillaSize, this.casillaSize);

        // Borde de casilla
        this.ctx.strokeStyle = "#444";
        this.ctx.strokeRect(posX, posY, this.casillaSize, this.casillaSize);

        // Ficha presente
        if (celda === 1) {
          this.ctx.fillStyle = "#e11";
          this.ctx.beginPath();
          this.ctx.arc(
            posX + this.casillaSize / 2,
            posY + this.casillaSize / 2,
            this.casillaSize / 2.5,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
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
}
