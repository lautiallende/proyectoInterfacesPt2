window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas-flappy");
  canvas.width = 1709;
  canvas.height = 815;

  const modelo = new ModeloFlappy(canvas);
  const vista = new VistaFlappy(canvas);
  window.controlador = new ControladorFlappy(modelo, vista);
  

  // Botón de inicio
  const botonInicio = document.getElementById("boton-iniciar");
  botonInicio.addEventListener("click", () => {
    document.getElementById("menu-inicio").style.display = "none";
    document.getElementById("cartel-instrucciones").style.display = "none";
    document.getElementById("puntaje").style.display = "block";
    document.getElementById("parallax").classList.add("animar-parallax");
    controlador.iniciar();
  });

  // Botón reintentar
  document.getElementById("btn-reintentar").addEventListener("click", () => {
    document.getElementById("cartel-perdiste").style.display = "none";
    document.getElementById("puntaje").textContent = "Puntaje: 0";

    // Reinicio de arrays
    window.controlador.tuberias = [];
    window.controlador.monedas = [];
    window.controlador.demonios = []; // ✅ reiniciar demonios también

    // Reinicio de estado
    window.controlador.puntaje = 0;
    window.controlador.frame = 0;
    window.controlador.loopActivo = true;
    window.controlador.modelo.reiniciar();

    document.getElementById("parallax").classList.add("animar-parallax");
    window.controlador.loop();
  });

  // Botón volver al menú
  document.getElementById("btn-menu").addEventListener("click", () => {
    document.getElementById("cartel-perdiste").style.display = "none";
    document.getElementById("menu-inicio").style.display = "block";
    document.getElementById("puntaje").style.display = "none";

    // Reinicio completo
    document.getElementById("puntaje").textContent = "Puntaje: 0";
    window.controlador.puntaje = 0;
    window.controlador.frame = 0;
    window.controlador.tuberias = [];
    window.controlador.monedas = [];
    window.controlador.demonios = []; // ✅ reiniciar demonios también
    window.controlador.loopActivo = false;
    window.controlador.modelo.reiniciar();
    window.controlador.vista.limpiarCanvas();
  });
  const btnInstrucciones = document.getElementById("btn-instrucciones");
  document.getElementById("btn-instrucciones").addEventListener("click", () => {
    document.getElementById("cartel-instrucciones").style.display = "block";
  });
  
  const cartelInstrucciones = document.getElementById("cartel-instrucciones");
  
  const btnCerrarInstrucciones = document.getElementById("btn-cerrar-instrucciones");
  document.getElementById("btn-cerrar-instrucciones").addEventListener("click", () => {
    document.getElementById("cartel-instrucciones").style.display = "none";
  });


});