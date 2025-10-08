// REGISTRO: botón "Registrar"
const mensaje =document.querySelector(".mensajeCaptcha");
const registrarBtn = document.getElementById("registrar-form");
const recaptchaBox = document.querySelector(".recaptcha");


if (registrarBtn) {
 registrarBtn.addEventListener("submit", function (e) {
    e.preventDefault(); // evita envío real
    const captcha = document.getElementById("fake-captcha");
    if (captcha && captcha.checked) {
      // activa el spinner
      recaptchaBox.classList.add("captcha-loading");
      mensaje.textContent = "Verificando...";
      mensaje.classList.remove("mensaje-error");
      mensaje.classList.add("mensaje-exito");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    }else{
      mensaje.textContent = "Verifica que eres un humano";
      mensaje.classList.remove("mensaje-exito");
      mensaje.classList.add("mensaje-error");
    }

  });

}
// BOTÓN "Iniciar sesión": redirige al index
const loginBtn = document.getElementById("login-form");
  if (loginBtn) {
    loginBtn.addEventListener("submit", function (e) {
      e.preventDefault(); // evita envío real
      window.location.href = "index.html";
    });
  } 
// BOTONES SOCIALES: redirigen al index
const socialButtons = document.querySelectorAll(".social-btn");
socialButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
//cambiar icono de ver
  const input = document.getElementById("registrar-contrasenia");
  const cambiar = document.querySelector(".cambiar-password");
  const icono = document.getElementById("icono-ojo");

  cambiar.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      icono.src = "iconos-imagenes/forms/esconder.png";
      icono.alt = "Ocultar contraseña";
    } else {
      input.type = "password";
      icono.src = "iconos-imagenes/forms/ver.png";
      icono.alt = "Mostrar contraseña";
    }
  });

