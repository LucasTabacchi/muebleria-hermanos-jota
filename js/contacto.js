const formulario =
    document.querySelector(
        "#formulario-contacto"
    );


const nombre =
    document.querySelector(
        "#nombre"
    );


const email =
    document.querySelector(
        "#email"
    );


const mensaje =
    document.querySelector(
        "#mensaje"
    );


const errorNombre =
    document.querySelector(
        "#error-nombre"
    );


const errorEmail =
    document.querySelector(
        "#error-email"
    );


const errorMensaje =
    document.querySelector(
        "#error-mensaje"
    );


const mensajeExito =
    document.querySelector(
        "#mensaje-exito"
    );


function validarEmail(email) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expresion.test(email);

}


function limpiarErrores() {

    errorNombre.textContent = "";

    errorEmail.textContent = "";

    errorMensaje.textContent = "";

    mensajeExito.textContent = "";

    nombre.removeAttribute("aria-invalid");

    email.removeAttribute("aria-invalid");

    mensaje.removeAttribute("aria-invalid");

}


formulario.addEventListener(
    "submit",
    (evento) => {

        evento.preventDefault();

        limpiarErrores();


        let formularioValido =
            true;


        const nombreValor =
            nombre.value.trim();


        const emailValor =
            email.value.trim();


        const mensajeValor =
            mensaje.value.trim();


        if (
            nombreValor.length < 2
        ) {

            errorNombre.textContent =
                "Ingresá un nombre válido.";

            nombre.setAttribute("aria-invalid", "true");

            formularioValido =
                false;

        }


        if (
            !validarEmail(emailValor)
        ) {

            errorEmail.textContent =
                "Ingresá un email válido.";

            email.setAttribute("aria-invalid", "true");

            formularioValido =
                false;

        }


        if (
            mensajeValor.length < 10
        ) {

            errorMensaje.textContent =
                "El mensaje debe tener al menos 10 caracteres.";

            mensaje.setAttribute("aria-invalid", "true");

            formularioValido =
                false;

        }


        if (!formularioValido) {

            return;

        }


        mensajeExito.textContent =
            "Mensaje enviado correctamente.";


        formulario.reset();

    }
);
