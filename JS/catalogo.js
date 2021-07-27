//VARIABLES

const btnCarrito = document.querySelector(".carrito_boton");
const carritoProductos = document.querySelector("#carrito-productos");
const templateCarrito = document.querySelector("#template_carrito").content;
const templateFoot = document.querySelector("#template__foot").content;
const catalogo = document.querySelector("#catalogo");
const btnSwitch = document.querySelector("#switch");
const btnSuerte = document.querySelector("#suerte");
const categorias = document.querySelector("#categorias");
const precioMin = document.querySelector("#precioMin");
const precioMax = document.querySelector("#precioMax");
const newletter = document.querySelector("#newletter");
const email = document.querySelector("#email");
const btnEnviar = document.querySelector("#enviar");
const spinner = document.querySelector(".spinner");
const contenedorPopup = document.createElement("p");
const fragment = document.createDocumentFragment();
let carrito = {};

//Expresión regular para validar email
const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


document.addEventListener("DOMContentLoaded", () => {

    //Obtenemos el modo actual.
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        btnSwitch.classList.add("activeDM");
    } else {
        document.body.classList.remove("dark");
        btnSwitch.classList.remove("activeDM");
    }

    //Mostramos catalogo
    mostrarCatalogo(productos);

    //Obtenemos el carrito
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        mostrarCarrito();
    }

    btnEnviar.disabled = true;
});


catalogo.addEventListener("click", e => {
    agregarCarrito(e);
});

carritoProductos.addEventListener("click", e => {
    eventoBtn(e);
});

email.addEventListener("blur", validarEmail);
btnEnviar.addEventListener("click", enviarEmail);

/* CATALOGO */
function mostrarCatalogo(productos) {
    catalogo.innerHTML = ``;

    productos.forEach(producto => {
        let contenedor = document.createElement("div");

        contenedor.innerHTML =
            `<img src="img/productos/${producto.id}.jpg" class="portada mx-auto d-block">
            <p class="mt-3 fw-bold">${producto.nombre}</p>
            <p class="fw-bold">$<span>${producto.precio}</span></p>
            <button type="button" data-id="${producto.id}" class="btn btn-outline-success btn-comprar mx-auto d-block">Comprar</button>`;

        contenedor.classList.add("col", "text-center", "producto", `producto_${producto.id}`, "mb-5");
        contenedor.setAttribute("id", "producto");
        catalogo.appendChild(contenedor);
    })
}

/* ------------------------ */

/* SLIDE CARRO */
btnCarrito.addEventListener("click", function () {
    document.getElementById("carrito").classList.toggle("active");
});
/* ---------------------- */


/* DARK MODE */
btnSwitch.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    btnSwitch.classList.toggle("activeDM");

    //Guardamos el Dark Mode en LocalStorage
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "true");
    } else {
        localStorage.setItem("darkMode", "false");
    }
});
/* ---------------------- */

/* BOTON SUERTE */
function codigoAleatorio(codigos) {
    var randomNumber = Math.floor(Math.random() * codigos.length);
    return codigos[randomNumber];
}

btnSuerte.addEventListener("click", () => {
    let codigo = codigoAleatorio(codigos);

    if (codigo === "Lo siento, no hubo suerte") {
        Swal.fire({
            title: "Y tu cupón es...",
            html: `<b>${codigo}</b> <p>Vuelve a intentarlo luego</p>`,
            showCloseButton: true,
            showConfirmButton: false,
            padding: "2rem"
        });
    } else {
        Swal.fire({
            title: "Y tu cupón es...",
            html: `<b>${codigo}</b> <p><b>Felicitaciones!!! Copia el código para luego obtener el descuento</b></p>`,
            showCloseButton: true,
            showConfirmButton: false,
            padding: "1.5rem"
        });
    }
});

/* ----------------------------- */


/* AGREGAR CARRITO */
const agregarCarrito = e => {
    if (e.target.classList.contains("btn-comprar")) {
        setCarrito(e.target.parentElement);
        animacion(btnCarrito);
        Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            toast: true,
            position: "bottom-end",
            timer: 5000,
            timerProgressBar: true,
            showCloseButton: true,
            showConfirmButton: false
        });
    }
    e.stopPropagation();
};

const setCarrito = objeto => {

    const producto = {
        id: objeto.querySelector(".btn-comprar").dataset.id,
        imagen: objeto.querySelector("img").src,
        nombre: objeto.querySelectorAll("p")[0].textContent,
        precio: objeto.querySelector("span").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = { ...producto };
    mostrarCarrito();

}

const mostrarCarrito = () => {

    carritoProductos.innerHTML = ``;
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("img").src = producto.imagen;
        templateCarrito.querySelectorAll("p")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("span")[0].textContent = producto.precio;
        templateCarrito.querySelectorAll("span")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    carritoProductos.appendChild(fragment);
    mostrarFoot();

    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log(carrito);
}

const mostrarFoot = () => {

    if (Object.keys(carrito).length === 0) {
        carritoProductos.innerHTML = `<p> No tienes productos agregados </p>`;

        return;
    }
    const nPrecio = Object.values(carrito).reduce((acumulador, { cantidad, precio }) => acumulador + cantidad * precio, 0);

    templateFoot.querySelector("span").textContent = nPrecio;

    const clone = templateFoot.cloneNode(true);
    fragment.appendChild(clone);
    carritoProductos.appendChild(fragment);

    /* VACIAR CARRO */
    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        carrito = {};
        mostrarCarrito();
    })
}
/* ------------------------------------ */

const eventoBtn = e => {
    //Aumentar
    if (e.target.classList.contains("sumar")) {

        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        mostrarCarrito();
    }
    //Restar productos
    if (e.target.classList.contains("restar")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        mostrarCarrito();
    }

    e.stopPropagation();
}
/* ANIMACIÓN CARRO DE COMPRAS */
const animacion = carro => {
    $(carro).animate({
        fontSize: "45px"
    }, 500, function () {
        $(carro).animate({
            fontSize: "35px"
        }, 500);
    });
}

/* FILTROS */
categorias.addEventListener("change", e => {
    busqueda.categoria = e.target.value;

    filtrarBusqueda();
});

precioMin.addEventListener("change", e => {
    busqueda.minimo = parseInt(e.target.value);

    filtrarBusqueda();
});

precioMax.addEventListener("change", e => {
    busqueda.maximo = parseInt(e.target.value);

    filtrarBusqueda();
});

function filtrarBusqueda() {
    const resultado = productos.filter(filtrarCategoria).filter(filtrarMinimo).filter(filtrarMaximo);


    mostrarCatalogo(resultado);
};

function filtrarCategoria(producto) {
    const { categoria } = busqueda;
    if (categoria) {
        const titulo = document.querySelector("#titulo");
        titulo.textContent = `Filtrado por: ${categoria}`;
        return producto.categoria === categoria;
    } else {
        titulo.textContent = "Juegos en tendencia";
        return producto;
    }
};

function filtrarMinimo(producto) {
    const { minimo } = busqueda;
    if (minimo) {
        return producto.precio >= minimo;
    } else {
        return producto;
    }
}

function filtrarMaximo(producto) {
    const { maximo } = busqueda;
    if (maximo) {
        return producto.precio <= maximo;
    } else {
        return producto;
    }
}
/* ---------------- */

/* NEWLETTER */
function validarEmail(e) {
    if (er.test(e.target.value)) {
        const error = document.querySelector(".mensajeError");
        if (error) {
            error.remove();
        }

        e.target.classList.remove("error");
        e.target.classList.add("pass");
        btnEnviar.disabled = false;

    } else {
        btnEnviar.disabled = true;
        e.target.classList.remove("pass");
        e.target.classList.add("error");

        mostrarMensaje("Email no válido")
    }
};

function mostrarMensaje(mensaje) {
    const mensajeError = document.createElement("p");
    mensajeError.textContent = mensaje;
    mensajeError.classList.add("mensajeError");

    const errores = document.querySelectorAll(".mensajeError");
    if (errores.length === 0) {
        newletter.appendChild(mensajeError);
    }
};

function enviarEmail() {
    //Mostrar spinner
    spinner.style.display = "flex";

    //Después de 2 segundos, el spinner se oculta
    setTimeout(() => {
        spinner.style.display = "none";

        mostrarMensaje("¡Gracias por suscribirte!");
        setTimeout(() => {
            const errores = document.querySelector(".mensajeError");
            errores.remove();
        }, 5000);
    }, 2000)
}

