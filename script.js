const productos = [{
    id: 1,
    nombre: "Horizon Zero Down",
    precio: 2500,
    categoria: "mundoAbierto"
}, {
    id: 2,
    nombre: "CyberPunk",
    precio: 2000,
    categoria: "mundoAbierto"
}, {
    id: 3,
    nombre: "FIFA 21",
    precio: 3000,
    categoria: "deportes"
}]

const codigos = ["ABC-123", "DFG-456", "BSD-741", "Lo siento, no hubo suerte", "Lo siento, no hubo suerte", "Lo siento, no hubo suerte", "Lo siento, no hubo suerte", "Lo siento, no hubo suerte", "Lo siento, no hubo suerte"];

let carrito = {};
const btnCarrito = document.getElementsByClassName("carrito_boton")
const templateCarrito = document.getElementById("template_carrito").content;
const catalogo = document.getElementById("catalogo");
const btnSwitch = document.getElementById("switch");
const btnSuerte = document.getElementById("suerte");
const btnCerrarPopup = document.getElementById("cerrar__popUp");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popUp");
const contenedorPopup = document.createElement("p");

/* CATALOGO */
for (const producto of productos) {
    let contenedor = document.createElement("div");

    contenedor.innerHTML =
        `<img src="img/productos/${producto.id}.jpg" class="portada mx-auto d-block">
        <p class="mt-3">${producto.nombre}</p>
        <p>$${producto.precio}</p>
        <button type="button" data-id="${producto.id}" class="btn btn-outline-success btn-comprar mx-auto d-block">Comprar</button>`;

    contenedor.classList.add("col", "text-center", "producto", "mb-5", producto.categoria);
    contenedor.setAttribute("id", "producto");
    catalogo.appendChild(contenedor);
}
/* ------------------------ */

/* SLIDE CARRO */
btnCarrito[0].addEventListener("click", function () {
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

//Obtenemos el modo actual.
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    btnSwitch.classList.add("activeDM");
} else {
    document.body.classList.remove("dark");
    btnSwitch.classList.remove("activeDM");
}
/* ---------------------- */

/* BOTON SUERTE */
function codigoAleatorio(codigos) {
    var randomNumber = Math.floor(Math.random() * codigos.length);
    return codigos[randomNumber];
}

btnSuerte.addEventListener("click", () => {
    overlay.classList.add("activeOverlay");
    popup.classList.add("activePopup")

    contenedorPopup.textContent = `${codigoAleatorio(codigos)}`

    popup.appendChild(contenedorPopup);
});

btnCerrarPopup.addEventListener("click", () => {
    overlay.classList.remove("activeOverlay");
    popup.classList.remove("activePopup")
});

/* ----------------------------- */

/* AGREGAR CARRITO */
catalogo.addEventListener("click", e => {
    agregarCarrito(e);
});

const agregarCarrito = e => {

    if (e.target.classList.contains("btn-comprar")) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-comprar").dataset.id,
        imagen: objeto.querySelector("img").src,
        nombre: objeto.querySelectorAll("p")[0].textContent,
        precio: objeto.querySelectorAll("p")[1].textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto};
    console.log(carrito);
}

const mostrarCarrito = () =>{
    mostrarCarrito();
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector("img").src = producto.imagen;
        templateCarrito.querySelectorAll("p")[0].textContent = producto.nombre;
        templateCarrito.que
    })
}