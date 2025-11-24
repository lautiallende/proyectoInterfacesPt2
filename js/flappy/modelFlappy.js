class ModeloFlappy {
  constructor(canvas) {
    this.canvas = canvas;
    this.pajaro = { x: 50, y: canvas.height / 2, velocidad: 0 };
    this.gravedad = 0.5;
    this.impulso = -8;
  }

  actualizar() {
    this.pajaro.velocidad += this.gravedad;
    this.pajaro.y += this.pajaro.velocidad;
  }

  saltar() {
    this.pajaro.velocidad = this.impulso;
  }

  getEstado() {
    return this.pajaro;
  }

  getHitbox() {
    const escala = 0.4;
    const ancho = 226 * escala;
    const alto = 220 * escala;

    return {
      x: this.pajaro.x - ancho / 2,
      y: this.pajaro.y - alto / 2,
      width: ancho,
      height: alto
    };
  }

  reiniciar() {
    this.pajaro.y = this.canvas.height / 2;
    this.pajaro.velocidad = 0;
  }
}