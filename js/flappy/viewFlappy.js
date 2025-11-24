class VistaFlappy {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.spriteMoneda = new Image();
    this.spriteMoneda.src = "img/moneda.png";

    this.sprite = new Image();
    this.sprite.src = "img/demo-spritesheet.png";

    this.spriteDemonio = new Image();              
    this.spriteDemonio.src = "img/demonio.png";

    this.frameWidth = 226;
    this.frameHeight = 220;
    this.totalFrames = 3;
    this.frameIndex = 0;
    this.tick = 0;
  }

  render(pajaro, monedas, tuberias, demonios) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar personaje
    const escala = 0.5;
    const ancho = this.frameWidth * escala;
    const alto = this.frameHeight * escala;

    this.tick++;
    if (this.tick % 10 === 0) {
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

    const xSprite = 27 + this.frameIndex * (this.frameWidth + 37);

    this.ctx.drawImage(
      this.sprite,
      xSprite, 0, this.frameWidth, this.frameHeight,
      pajaro.x - ancho / 2, pajaro.y - alto / 2,
      ancho, alto
    );

    // Dibujar monedas
    monedas.forEach(m => m.dibujar(this.ctx));

    // Dibujar tuberías
    tuberias.forEach(t => t.dibujar(this.ctx));

    // Dibujar demonios
    demonios.forEach(d => d.dibujar(this.ctx));
  }

  limpiarCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}