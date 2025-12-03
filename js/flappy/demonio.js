class Demonio {
  constructor(x, y, sprite, escala = 0.25) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.escala = escala;

    this.frame = 0;
    this.totalFrames = 5;   // ✅ ahora son 5 frames

    this.anchoFrame = 302;  // ancho real del frame
    this.altoFrame = 251;   // alto real del frame
    this.separacion = 1;    // separación entre frames
    this.velocidad = 5;     // velocidad de movimiento
  }

  mover() {
    this.x -= this.velocidad;
  }

  animar() {
    this.frame = (this.frame + 1) % this.totalFrames;
  }

  dibujar(ctx) {
    // ✅ offset correcto con separación de 1px
    const offsetX = this.frame * (this.anchoFrame + this.separacion);

    ctx.drawImage(
      this.sprite,
      offsetX, 0, this.anchoFrame, this.altoFrame, // recorte exacto
      this.x, this.y, this.anchoFrame * 0.25, this.altoFrame * 0.25 // render en canvas
    );
  }

  colisiona(hitbox) {
    const ancho = this.anchoFrame * 0.2;
    const alto = this.altoFrame * 0.2;

    return (
      hitbox.x < this.x + ancho &&
      hitbox.x + hitbox.width > this.x &&
      hitbox.y < this.y + alto &&
      hitbox.y + hitbox.height > this.y
    );
  }
}