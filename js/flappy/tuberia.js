class Tuberia {
  constructor(x, alturaArriba, alturaAbajo, canvasHeight) {
    this.x = x;
    this.width = 60;
    this.alturaArriba = alturaArriba;
    this.alturaAbajo = alturaAbajo;
    this.canvasHeight = canvasHeight;
    this.contado = false;
  }

  mover() {
    this.x -= 2;
  }

  dibujar(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, 0, this.width, this.alturaArriba);
    ctx.fillRect(this.x, this.canvasHeight - this.alturaAbajo, this.width, this.alturaAbajo);
  }

  colisiona(hitbox) {
    return (
      (hitbox.x < this.x + this.width &&
       hitbox.x + hitbox.width > this.x &&
       hitbox.y < this.alturaArriba) ||
      (hitbox.x < this.x + this.width &&
       hitbox.x + hitbox.width > this.x &&
       hitbox.y + hitbox.height > this.canvasHeight - this.alturaAbajo)
    );
  }
}