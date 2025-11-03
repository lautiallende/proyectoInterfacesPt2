export class ModeloPeg {
  constructor() {
    this.tamaño = 7;
    this.tablero = this.inicializarTablero();
  }

  inicializarTablero() {
    return [
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
      [ 1,  1, 1, 1, 1,  1,  1],
      [ 1,  1, 1, 0, 1,  1,  1],
      [ 1,  1, 1, 1, 1,  1,  1],
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1]
    ];
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
    for (let y = 0; y < this.tamaño; y++) {
      for (let x = 0; x < this.tamaño; x++) {
        if (this.tablero[y][x] === 1 && this.obtenerMovimientosValidos(x, y).length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  // Cuenta fichas restantes
  contarFichas() {
    let total = 0;
    for (let fila of this.tablero) {
      for (let celda of fila) {
        if (celda === 1) total++;
      }
    }
    return total;
  }

  // Verifica si una posición está dentro del tablero
  estaDentro(x, y) {
    return x >= 0 && x < this.tamaño && y >= 0 && y < this.tamaño;
  }

  // Reinicia el tablero
  resetear() {
    this.tablero = this.inicializarTablero();
  }
}