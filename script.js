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

document.addEventListener("DOMContentLoaded", () => {
    //Obtenemos el modo actual.
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        btnSwitch.classList.add("activeDM");
    } else {
        document.body.classList.remove("dark");
        btnSwitch.classList.remove("activeDM");
    }

    //Obtenemos el carrito
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        mostrarCarrito();
    }
})

const btnCarrito = document.getElementsByClassName("carrito_boton");
const carritoProductos = document.getElementById("carrito-productos");
const templateCarrito = document.getElementById("template_carrito").content;
const templateFoot = document.getElementById("template__foot").content;
const catalogo = document.getElementById("catalogo");
const btnSwitch = document.getElementById("switch");
const btnSuerte = document.getElementById("suerte");
const btnCerrarPopup = document.getElementById("cerrar__popUp");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popUp");
const contenedorPopup = document.createElement("p");
const fragment = document.createDocumentFragment();

catalogo.addEventListener("click", e => {
    agregarCarrito(e);
});

carritoProductos.addEventListener("click", e => {
    eventoBtn(e);
});

/* CATALOGO */
for (const producto of productos) {
    let contenedor = document.createElement("div");

    contenedor.innerHTML =
        `<img src="img/productos/${producto.id}.jpg" class="portada mx-auto d-block">
        <p class="mt-3">${producto.nombre}</p>
        <p>$<span>${producto.precio}</span></p>
        <button type="button" data-id="${producto.id}" class="btn btn-outline-success btn-comprar mx-auto d-block">Comprar</button>`;

    contenedor.classList.add("col", "text-center", "producto", `producto_${producto.id}`, "mb-5", producto.categoria);
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
const agregarCarrito = e => {
    if (e.target.classList.contains("btn-comprar")) {
        setCarrito(e.target.parentElement);
        animacion(btnCarrito);
    }
    e.stopPropagation();
}

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
    carrito[producto.id] = {...producto};
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
}

const mostrarFoot = () => {

    if (Object.keys(carrito).length === 0) {
        carritoProductos.innerHTML = `<p> No tienes productos agregados </p>`;

        return;
        
    }else{
        const nPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0);

        templateFoot.querySelector("span").textContent = nPrecio;
    
        const clone = templateFoot.cloneNode(true);
        fragment.appendChild(clone);
        carritoProductos.appendChild(fragment);
    }
    
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
    if (e.target.classList.contains("btn-info")) {

        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        mostrarCarrito();
    }
    //Restar productos
    if (e.target.classList.contains("btn-danger")) {
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
const animacion = carro =>{
    $(carro).animate({
        fontSize: "45px"},500, function(){
            $(carro).animate({
                fontSize: "35px"}, 500);
        });
}