function principal() {

    let cursos = [
        { id: 1, nombre: "Yoga Hasana", profesional: "Mariangeles Julia", cupo: 3, inscriptos: 0, categoria: "yoga", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual", rutaImagen: "2.png" },
        { id: 2, nombre: "Stretching", profesional: "Juan Perez", cupo: 2, inscriptos: 0, categoria: "Clases", dias: "miercoles 10 a 11", valor: 25000, periodoabono: "mensual", rutaImagen: "3.png" },
        { id: 3, nombre: "Meditación", profesional: "Celia Cruz", cupo: 4, inscriptos: 0, categoria: "Clases", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual", rutaImagen: "5.png" },
        { id: 4, nombre: "Masajes Relajantes", profesional: "Margarita Robie", cupo: 1, inscriptos: 0, categoria: "Consultorio", dias: "lunes y Viernes 20 a 21", valor: 5000, periodoabono: "dia", rutaImagen: "4.png" },
        { id: 5, nombre: "Coaching Emocional", profesional: "Toni Montana", cupo: 1, inscriptos: 0, categoria: "Consultorio", dias: "jueves 12 a 14", valor: 6000, periodoabono: "dia", rutaImagen: "1.png" }
    ]


    crearTarjetasCursos(cursos)


    let inputBuscar = document.getElementById("inputBuscar")
    inputBuscar.addEventListener("keyup", (e) => filtrarYrenderizar(e, cursos))

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYrenderizarConBoton(inputBuscar, cursos), { once: true })

    let botonCursosReservados = document.getElementById("botonCursosReservados")
    botonCursosReservados.addEventListener("click", verOcultarReserva)

    let botonesAgregarReserva = document.getElementsByClassName("botonAgregarReserva")
    for (const boton of botonesAgregarReserva) {
    boton.addEventListener("click", (e) => AgregarAReserva (e, cursos))
}

}

principal()

function filtrarYrenderizarConBoton(input, cursos) {
    let cursosFiltrados = filtrar(input.value, cursos)
    crearTarjetasCursos(cursosFiltrados)
}

function filtrarYrenderizar(e, cursos) {
    if (e.keyCode === 13) {

        let arrayFiltrado = filtrar(e.target.value, cursos)
        crearTarjetasCursos(arrayFiltrado)
    }
    e.target.value === "" && crearTarjetasCursos(cursos)
}

function filtrar(valor, cursos) {
    return cursos.filter(({ nombre, categoria, profesional }) => nombre.toLowerCase().includes(valor) || categoria.toLowerCase().includes(valor) || profesional.toLowerCase().includes(valor))
}


function crearTarjetasCursos(cursos) {
    let contenedor = document.getElementById("contenedorDeTarjetas")
    contenedorDeTarjetas.innerHTML = ""
    cursos.forEach(curso => {
        let tarjetaCurso = document.createElement("div")
        tarjetaCurso.className = "card-principal"
        tarjetaCurso.innerHTML = `
                <img src="./img/perfiles/${curso.rutaImagen}" alt="${curso.nombre}">
                <div class="card-text">
                    <h2>${curso.nombre}</h2>
                    <h3>${curso.profesional}</h3>
                    <p>${curso.dias}</p>
                    </div>
                <button id = ${curso.id} class="botonAgregarReserva">Reservar Turno</button>
        `
        contenedor.appendChild(tarjetaCurso)

     
    })
}

function verOcultarReserva(e) {
    let reserva = document.getElementById("reserva")
    let contenedorDeTarjetas = document.getElementById("contenedorDeTarjetas")

    reserva.classList.toggle("oculta")
    contenedorDeTarjetas.classList.toggle("oculta")

    if (!reserva.classList.contains("oculta")) {
        let reservas = recuperarReservaDelStorage();
        renderizarReserva(reservas);
    }

    e.target.innerText = e.target.innerText === "Cursos" ? "Reserva" : "Cursos"
}

function AgregarAReserva(event, cursos) {
    let reserva = recuperarReservaDelStorage()
    let id = Number(event.target.id)
    let cursoBuscado = cursos.find(curso => curso.id === id)
    let indiceReserva = reserva.findIndex(cursoreserva => cursoreserva.id === id)
    if (cursoBuscado) {
        if (cursoBuscado.inscriptos < cursoBuscado.cupo) {
            if (indiceReserva !== -1) {
                reserva[indiceReserva].unidades++
                reserva[indiceReserva].subtotal = reserva[indiceReserva].unidades * reserva[indiceReserva].Valor
            }
            else {
                reserva.push({
                    id: cursoBuscado.id,
                    nombre: cursoBuscado.nombre,
                    unidades: 1,
                    Valor: cursoBuscado.valor,
                    subtotal: cursoBuscado.valor
                })
            }
            cursoBuscado.inscriptos++
            mostrarMensaje("¡Te esperamos en tu clase! RESERVA EFECTUADA", "exito")
        } else {
            mostrarMensaje("Lo siento, no hay más cupos disponibles para este curso.", "error")
        }
    } else {
        mostrarMensaje("Curso no encontrado.", "error")
    }

    guardarEnStorage("reserva", reserva)
    renderizarReserva(reserva)
}


function mostrarMensaje(texto, tipo ) {
    const mensaje = document.getElementById("mensaje")
    mensaje.textContent = texto
    mensaje.className = `mensaje ${tipo}`
    mensaje.classList.remove("oculto")

    setTimeout(() => {
        mensaje.classList.add("oculto")
    }, 5000)
}

function renderizarReserva(reserva) {
    let contenedorReserva = document.getElementById("reserva")
    contenedorReserva.innerHTML = ""

    reserva.forEach(cursoReservado => {
        let tarjetaReserva = document.createElement("div")
        tarjetaReserva.className = "tarjetaReserva"
        tarjetaReserva.innerHTML = `
            <p>${cursoReservado.nombre}</p>
            <p>Valor unitario: $${cursoReservado.Valor}</p>
            <p>Unidades: ${cursoReservado.unidades}</p>
            <p>Subtotal: $${cursoReservado.subtotal}</p>
        `;
        contenedorReserva.appendChild(tarjetaReserva)
    });
}

function guardarEnStorage(clave, valor) {
    let valorJson = JSON.stringify(valor)
    localStorage.setItem(clave, valorJson)
}

function recuperarReservaDelStorage() {
    let valorJson = localStorage.getItem("reserva")
    let reserva = JSON.parse(valorJson)
    if (!reserva) {
        reserva = []
    }
    return reserva
}



///guncion mia para debuguar funcionamiento de botones
function escucharBotones(e) {
    console.log(e.target)
}


function AgregarAlCarrito(e) {
    console.dir(e.target)
}

