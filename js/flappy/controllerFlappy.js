class ControladorFlappy {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
    this.loopActivo = false;
    this.frame = 0;
    this.puntaje = 0;

    this.tuberias = [];
    this.monedas = [];
    this.demonios = []; 
  }

  iniciar() {
    this.loopActivo = true;
    this.modelo.reiniciar();

    document.addEventListener("keydown", e => {
      if (e.code === "Space"){
        e.preventDefault();
        this.modelo.saltar();
      } 
    });

    document.addEventListener("click", () => {
      this.modelo.saltar();
    });

    this.loop();
  }

  loop() {
    if (!this.loopActivo) return;

    this.frame++;
    this.modelo.actualizar();
    const estado = this.modelo.getEstado();

    // Render principal
    this.vista.render(estado, this.monedas, this.tuberias, this.demonios); 

    const hitbox = this.modelo.getHitbox();
    if (hitbox.y < 0 || hitbox.y + hitbox.height > this.modelo.canvas.height) {
      this.perder();
    }

    if (this.frame % 120 === 0) {
      this.generarTuberia();
    }

    if (this.frame % 180 === 0) {
      this.generarMoneda();
    }

    if (this.frame % 300 === 0) { // cada cierto tiempo generar demonio
      this.generarDemonio();
    }

    if (this.frame % 5 === 0) {
      this.monedas.forEach(m => m.animar());
      this.demonios.forEach(d => d.animar()); // ✅ animar demonios
    }

    this.monedas.forEach((m, i) => {
      m.mover();
      if (m.colisiona(this.modelo.getHitbox())) {
        this.puntaje += 5;
        this.monedas.splice(i, 1);
        document.getElementById("puntaje").textContent = `Puntaje: ${this.puntaje}`;
      }
    });

    this.tuberias.forEach((tubo, i) => {
      tubo.mover();
      if (!tubo.contado && tubo.x + tubo.width < this.modelo.getEstado().x) {
        tubo.contado = true;
        this.puntaje++;
        document.getElementById("puntaje").textContent = `Puntaje: ${this.puntaje}`;
      }
      if (tubo.colisiona(this.modelo.getHitbox())) {
        this.perder();
      }
    });

    // ✅ mover demonios y chequear colisión
    this.demonios.forEach((demonio, i) => {
      demonio.mover();
      if (demonio.colisiona(this.modelo.getHitbox())) {
        this.perder(); 
      }
    });

    requestAnimationFrame(() => this.loop());
  }

  generarMoneda() {
    const escala = 0.5;
    const alturaVisible = 208 * escala;
    const maxY = this.modelo.canvas.height - alturaVisible;
    const y = Math.floor(Math.random() * maxY);

    const moneda = new Moneda(this.modelo.canvas.width, y, this.vista.spriteMoneda, escala);
    this.monedas.push(moneda);
  }

  generarTuberia() {
    const espacio = 300;
    const alturaArriba = Math.floor(Math.random() * 150) + 50;
    const alturaAbajo = this.modelo.canvas.height - alturaArriba - espacio;

    const tubo = new Tuberia(this.modelo.canvas.width, alturaArriba, alturaAbajo, this.modelo.canvas.height);
    this.tuberias.push(tubo);
  }

  generarDemonio() {
    const escala = 0.5;
    const y = Math.floor(Math.random() * (this.modelo.canvas.height - 251));
    const demonio = new Demonio(this.modelo.canvas.width, y, this.vista.spriteDemonio, escala);
    this.demonios.push(demonio);
  }

  actualizar() {
    const hitbox = this.modelo.getHitbox();

    this.demonios.forEach((demonio) => {
      demonio.mover();
      demonio.animar();
      demonio.dibujar(this.vista.ctx);

      if (demonio.colisiona(hitbox)) {
        this.perder(); 
      }
    });
  }

  perder() {
    if (!this.loopActivo) return;
    this.loopActivo = false;

    // Detener parallax
    document.getElementById("parallax").classList.remove("animar-parallax");

    // Guardar récord en localStorage
    const record = localStorage.getItem("record") || 0;
    if (this.puntaje > record) {
      localStorage.setItem("record", this.puntaje);
    }

    
    let count = 0;
    const intervalo = setInterval(() => {
      this.vista.limpiarCanvas();

      // alterna entre mostrar y ocultar el pájaro
      if (count % 2 === 0) {
        this.vista.render(this.modelo.getEstado(), this.monedas, this.tuberias, this.demonios);
      }

      count++;
      if (count > 6) { // después de 3 parpadeos
        clearInterval(intervalo);

        // Mostrar cartel de "Perdiste"
        document.getElementById("texto-record").textContent = `Tu récord: ${localStorage.getItem("record")}`;
        document.getElementById("cartel-perdiste").style.display = "block";
      }
    }, 100);
  }
}