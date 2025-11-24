class Moneda {
  constructor(x, y, sprite) { 
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.frame = 0;
    this.totalFrames = 9;

    this.anchoFrame = 236;   // ancho real del frame
    this.altoFrame = 242;    // alto real del frame
    this.espacioEntreFrames = 8;
  }

  mover() {
    this.x -= 2;
  }

  animar() {
    this.frame = (this.frame + 1) % this.totalFrames;
  }

  dibujar(ctx) {
    // cálculo del recorte horizontal
    const offsetX = this.frame * (this.anchoFrame + this.espacioEntreFrames);

    ctx.drawImage(
      this.sprite,
      offsetX, 0, this.anchoFrame, this.altoFrame, // recorte exacto del spritesheet
      this.x, this.y, this.anchoFrame * 0.3, this.altoFrame * 0.3 // render en canvas con escala
    );
  }

  colisiona(hitbox) {
    const ancho = this.anchoFrame * 0.3;
    const alto = this.altoFrame * 0.3;

    return (
      hitbox.x < this.x + ancho &&
      hitbox.x + hitbox.width > this.x &&
      hitbox.y < this.y + alto &&
      hitbox.y + hitbox.height > this.y
    );
  }
}