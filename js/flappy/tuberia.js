class Tuberia {
  constructor(x, alturaArriba, alturaAbajo, canvasHeight) {
    this.x = x;
    this.width = 60;
    this.alturaArriba = alturaArriba;
    this.alturaAbajo = alturaAbajo;
    this.canvasHeight = canvasHeight;
    this.contado = false;

    // ✅ Cargar imágenes separadas
    this.spriteArriba = new Image();
    this.spriteArriba.src = "img/img-tubo-arriba.png";

    this.spriteAbajo = new Image();
    this.spriteAbajo.src = "img/img-tubo-abajo.png";
  }

  mover() {
    this.x -= 4; 
  }

  dibujar(ctx) {
    // Dibujar tubería de arriba
    ctx.drawImage(
      this.spriteArriba,
      this.x, 0, this.width, this.alturaArriba
    );

    // Dibujar tubería de abajo
    ctx.drawImage(
      this.spriteAbajo,
      this.x, this.canvasHeight - this.alturaAbajo, this.width, this.alturaAbajo
    );
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