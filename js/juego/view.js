export class VistaPeg {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  // Dibuja el tablero y las fichas
  dibujarTablero(estadoTablero) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (let y = 0; y < estadoTablero.length; y++) {
    for (let x = 0; x < estadoTablero[y].length; x++) {
      const celda = estadoTablero[y][x];
      const posX = x * 100;
      const posY = y * 100;

      if (celda === -1) {
        // Casilla inválida: no se dibuja nada
        continue;
      }

      // Fondo de casilla jugable
      this.ctx.fillStyle = "#222";
      this.ctx.fillRect(posX, posY, 100, 100);

      // Borde de casilla
      this.ctx.strokeStyle = "#444";
      this.ctx.strokeRect(posX, posY, 100, 100);

      if (celda === 1) {
        // Ficha presente
        this.ctx.fillStyle = "#e11";
        this.ctx.beginPath();
        this.ctx.arc(posX + 50, posY + 50, 30, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
}

  // Muestra sugerencias como círculos blancos
  mostrarSugerencias(movimientos) {
    movimientos.forEach(mov => {
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(mov.x * 100 + 50, mov.y * 100 + 50, 10, 0, Math.PI * 2);
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
