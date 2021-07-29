//Variables
const listado = document.querySelector("#verCarro");
const totalHTML = document.querySelector(".total");
const formDescuento = document.querySelector("#formDescuento");
const formComprar = document.querySelector("#formComprar");
const nombre = document.querySelector("#name");
const emailCompra = document.querySelector("#emailCompra");
const tarjeta = document.querySelector("#tarjeta");
const vencimiento = document.querySelector("#vencimiento");
const cvv = document.querySelector("#cvv")
const btnComprar = document.querySelector("#btnComprar");
const inputCodigo = document.querySelector("#inputCodigo");
const btnAplicar = document.querySelector("#btnAplicar");

const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let total = 0;


document.addEventListener("DOMContentLoaded", () => {
    //Obtenemos el modo actual.
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    //Obtenemos los productos a comprar
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        mostrarFinalizado();
    }

    btnAplicar.disabled = true;
    btnComprar.disabled = true;
});

formDescuento.addEventListener("submit", aplicarDescuento);
formComprar.addEventListener("submit", comprar);
inputCodigo.addEventListener("blur", validarFormulario);
nombre.addEventListener("blur", validarFormulario);
emailCompra.addEventListener("blur", validarEmail);
tarjeta.addEventListener("blur", validarFormulario);
vencimiento.addEventListener("blur", validarFormulario);
cvv.addEventListener("blur", validarFormulario);

function mostrarFinalizado() {

    Object.values(carrito).forEach(producto => {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `
        <img src="img/productos/${producto.id}.jpg" class="fotoCompra">
        <p>${producto.nombre}</p>
        <p>Cant: ${producto.cantidad}</p>
        <p>$${producto.precio}</p>
        `
        total += producto.precio * producto.cantidad;

        contenedor.classList.add("d-flex", "justify-content-around", "align-items-center", "mb-3", "listado")
        const separacion = document.querySelector("#separacion");
        listado.insertBefore(contenedor, separacion);

        totalHTML.textContent = ` $${total}`;
    });
};

function validarFormulario(e) {
    //VALIDAMOS CODIGO DE DESCUENTO
    if (e.target.classList.contains("inputCodigo")) {
        if (e.target.value === "ABC-123" || e.target.value === "DFG-456" || e.target.value === "BSD-741") {
            const error = document.querySelector(".errorCodigo");
            if (error) {
                error.remove();
            }

            e.target.classList.remove("error");
            e.target.classList.add("pass");
            btnAplicar.disabled = false;
        } else {
            e.target.classList.remove("pass");
            e.target.classList.add("error");
            btnAplicar.disabled = true;

            mostrarMensaje("Código inválido", "errorCodigo", formDescuento);
        }
    };

    //Validamos nombre y apellido
    if (e.target.classList.contains("name")) {
        if (e.target.value.length > 0) {
            e.target.classList.remove("error");
            e.target.classList.add("pass");
        } else {
            e.target.classList.remove("pass");
            e.target.classList.add("error");
        }
    }

    //Validamos tarjeta de credito
    if (e.target.classList.contains("tarjetaCredito")) {
        if (e.target.value.length >= 16) {
            const error = document.querySelector(".errorTarjeta");
            if (error) {
                error.remove();
            }

            e.target.classList.remove("error");
            e.target.classList.add("pass");
        } else {
            e.target.classList.remove("pass")
            e.target.classList.add("error");
            const tarjetaError = document.querySelector("#idTarjeta");
            mostrarMensaje("Tarjeta inválida, mínimo 16 digitos", "errorTarjeta", tarjetaError);
        }
    }

    if (e.target.classList.contains("vencimiento")) {
        if (e.target.value.length === 5) {
            const error = document.querySelector(".errorVen");
            if (error) {
                error.remove();
            }

            e.target.classList.remove("error");
            e.target.classList.add("pass");
        } else {
            e.target.classList.remove("pass")
            e.target.classList.add("error");
            const vencimientoError = document.querySelector("#idVencimiento");
            mostrarMensaje("Vencimiento inválido", "errorVen", vencimientoError);
        }
    }

    if (e.target.classList.contains("cvv")) {
        if (e.target.value.length === 3) {
            const error = document.querySelector(".errorCvv");
            if (error) {
                error.remove();
            }

            e.target.classList.remove("error");
            e.target.classList.add("pass");
        } else {
            e.target.classList.remove("pass")
            e.target.classList.add("error");
            const cvvError = document.querySelector("#idCvv");
            mostrarMensaje("Minimo 3 digitos", "errorCvv", cvvError);
        }
    }

    if (er.test(emailCompra.value) && nombre.value !== "" && tarjeta.value !== "" && vencimiento.value !== "" && cvv.value !== "") {
        btnComprar.disabled = false;
    } else {
        btnComprar.disabled = true;
    }
}

function mostrarMensaje(mensaje, clase, ubicacion) {
    const mensajeError = document.createElement("p");
    mensajeError.textContent = mensaje;
    mensajeError.classList.add(clase, "mb-1", "fw-bold", "text-danger");

    const errores = document.querySelectorAll(`.${clase}`);
    if (errores.length === 0) {
        ubicacion.appendChild(mensajeError);
    }
};

function aplicarDescuento(e) {
    e.preventDefault();

    total = total - (total * 0.10);
    totalHTML.textContent = ` $${total}`;
    formDescuento.remove();
    mostrarMensaje("¡Descuento aplicado!", "descuentoAplicado", listado);
};

function validarEmail(e) {
    if (er.test(e.target.value)) {
        const error = document.querySelector(".errorEmail");
        if (error) {
            error.remove();
        }

        e.target.classList.remove("error");
        e.target.classList.add("pass")
    } else {
        e.target.classList.remove("pass")
        e.target.classList.add("error");
        const email = document.querySelector("#idEmail");
        mostrarMensaje("Email inválido", "errorEmail", email);
    }
}

function comprar(e) {
    e.preventDefault()

    const spinner = document.querySelector(".spinner");
    const layout = document.querySelector("#layout");
    const main = document.querySelector("main");
    layout.remove();
    localStorage.removeItem("carrito");

    spinner.style.display = "flex";

    setTimeout(() => {
        spinner.style.display = "none";

        const container = document.createElement("div");
        container.innerHTML = `
        <img src= "img/nice.png" class="nice d-block mx-auto mb-3">
        <h1 class="text-center">¡Muchas gracias por su compra!</h1>
        `

        main.appendChild(container);

    }, 3000);
}
