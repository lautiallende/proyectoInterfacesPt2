export class ModeloPeg {
  constructor() {
    this.tablero = this.inicializarTablero();
  }

  inicializarTablero() {
    const tablero = [
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1],
        [ 1,  1, 1, 1, 1,  1,  1],
        [ 1,  1, 1, 0, 1,  1,  1],
        [ 1,  1, 1, 1, 1,  1,  1],
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1]
        ];

    return tablero;
    }

  // Devuelve los movimientos válidos desde una posición
  obtenerMovimientosValidos(x, y) {
    const movimientos = [];
    const direcciones = [
      { dx: 0, dy: -1 }, // arriba
      { dx: 0, dy: 1 },  // abajo
      { dx: -1, dy: 0 }, // izquierda
      { dx: 1, dy: 0 }   // derecha
    ];

    if (this.tablero[y][x] === 1) {
      for (const { dx, dy } of direcciones) {
        const medioX = x + dx;
        const medioY = y + dy;
        const destinoX = x + dx * 2;
        const destinoY = y + dy * 2;

        if (
          this.estaDentro(destinoX, destinoY) &&
          this.tablero[medioY][medioX] === 1 &&
          this.tablero[destinoY][destinoX] === 0
        ) {
          movimientos.push({ x: destinoX, y: destinoY });
        }
      }
    }

    return movimientos;
  }

  // Ejecuta el movimiento si es válido
  moverFicha(origen, destino) {
    const movimientosValidos = this.obtenerMovimientosValidos(origen.x, origen.y);
    const esValido = movimientosValidos.some(m => m.x === destino.x && m.y === destino.y);

    if (esValido) {
      const medioX = Math.floor((origen.x + destino.x) / 2);
      const medioY = Math.floor((origen.y + destino.y) / 2);

      this.tablero[destino.y][destino.x] = 1;
      this.tablero[origen.y][origen.x] = 0;
      this.tablero[medioY][medioX] = 0;
      return true;
    }

    return false;
  }

  // Verifica si el juego terminó
  estaTerminado() {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.tablero[y][x] === 1 && this.obtenerMovimientosValidos(x, y).length > 0) {
            return false;
        }
      }
    }
    return true;
  }

  // Verifica si una posición está dentro del tablero
  estaDentro(x, y) {
    return x >= 0 && x < 7 && y >= 0 && y < 7;
  }
}