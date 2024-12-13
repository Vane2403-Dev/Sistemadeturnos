async function principal() {

    /*let cursos = [
        { id: 1, nombre: "Yoga Hasana", profesional: "Mariangeles Julia", cupo: 3, inscriptos: 0, categoria: "yoga", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual", rutaImagen: "2.png" },
        { id: 2, nombre: "Stretching", profesional: "Juan Perez", cupo: 2, inscriptos: 0, categoria: "Clases", dias: "miercoles 10 a 11", valor: 25000, periodoabono: "mensual", rutaImagen: "3.png" },
        { id: 3, nombre: "Meditación", profesional: "Celia Cruz", cupo: 4, inscriptos: 0, categoria: "Clases", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual", rutaImagen: "5.png" },
        { id: 4, nombre: "Masajes Relajantes", profesional: "Margarita Robie", cupo: 1, inscriptos: 0, categoria: "Consultorio", dias: "lunes y Viernes 20 a 21", valor: 5000, periodoabono: "dia", rutaImagen: "4.png" },
        { id: 5, nombre: "Coaching Emocional", profesional: "Toni Montana", cupo: 1, inscriptos: 0, categoria: "Consultorio", dias: "jueves 12 a 14", valor: 6000, periodoabono: "dia", rutaImagen: "1.png" }
    ]*/



    const cursos = await obtenerCursos()
    guardarEnStorage("cursos", cursos)

    crearTarjetasCursos(cursos)




    let inputBuscar = document.getElementById("inputBuscar")
    inputBuscar.addEventListener("keyup", (e) => filtrarYrenderizar(e, cursos))

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYrenderizarConBoton(inputBuscar, cursos), { once: true })

    let botonCursosReservados = document.getElementById("botonCursosReservados")
    botonCursosReservados.addEventListener("click", verOcultarReserva)


    const contenedorDeTarjetas = document.getElementById("contenedorDeTarjetas")
    contenedorDeTarjetas.addEventListener("click", (e) => {
        if (e.target.classList.contains("botonAgregarReserva")) {
            AgregarAReserva(e, cursos)
        }
    })

    let botonComprar = document.getElementById("botonCancelar")
    botonComprar.addEventListener("click", cancelarTotal)

    actualizarTotal(total)

    let botonReservar = document.getElementById("botonReservar")
    botonReservar.addEventListener("click", finalizarReserva)


}

principal()

async function obtenerCursos() {
    try {

        const response = await axios.get('./js/cursos.json')
        return response.data
    } catch (error) {
        e
        mostrarMensaje("Hubo un problema al obtener los cursos: ", "error")
        return []
    }

}

function finalizarReserva() {
    const Reserva = recuperarDelStorage("reserva")
     if (Reserva.length === 0)
     { mostrarMensaje("No posee cursos seleccionados", "error") }
       else { mostrarMensaje("Gracias por su Reserva")}
}


async function cancelarTotal() {
    renderizarReserva([])
    localStorage.removeItem("reserva")
    localStorage.removeItem("cursos")
    const cursos = await obtenerCursos()
    guardarEnStorage("cursos", cursos)
}

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
    let totales = document.getElementById("totales")
    let contenedorDeTarjetas = document.getElementById("contenedorDeTarjetas")

    totales.classList.toggle("oculta")
    reserva.classList.toggle("oculta")
    contenedorDeTarjetas.classList.toggle("oculta")

    if (!reserva.classList.contains("oculta")) {
        let reservas = recuperarDelStorage("reserva")
        renderizarReserva(reservas)
    }

    e.target.innerText = e.target.innerText === "☚ Cursos" ? "Ver Reserva" : "☚ Cursos"
}



function AgregarAReserva(event) {
    let reserva = recuperarDelStorage("reserva")
    let id = Number(event.target.id)
    let cursos = recuperarDelStorage("cursos")
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
    guardarEnStorage("cursos", cursos)
    renderizarReserva(reserva)
}

function guardarEnStorage(clave, valor) {
    let valorJson = JSON.stringify(valor)
    localStorage.setItem(clave, valorJson)
}

/*function recuperarReservaDelStorage() {
    let valorJson = localStorage.getItem("reserva")
    let reserva = JSON.parse(valorJson)
    if (!reserva) {
        reserva = []
    }
    return reserva
}*/
function recuperarDelStorage(clave) {
    let valorJson = localStorage.getItem(clave)
    let valor = JSON.parse(valorJson)
    return Array.isArray(valor) ? valor : []
}





function renderizarReserva(reserva) {
    let contenedorReserva = document.getElementById("reserva")
    contenedorReserva.innerHTML = ""
    reserva.forEach(cursoReservado => {
        let tarjetaReserva = document.createElement("div")
        tarjetaReserva.className = "tarjetaReserva"
        tarjetaReserva.id = `R${cursoReservado.id}`
        tarjetaReserva.innerHTML = `
            <p>${cursoReservado.nombre}</p>
            <p> $${cursoReservado.Valor}</p>
            <div Class = "tjb">
            <p> ${cursoReservado.unidades}</p>
            </div>
            <p>Subtotal:$${cursoReservado.subtotal}</p>
            <button   id=eli${cursoReservado.id} >🗑️ Eliminar</button>`
        contenedorReserva.appendChild(tarjetaReserva)

        let botonEliminar = document.getElementById("eli" + cursoReservado.id)
        botonEliminar.addEventListener("click", eliminarReserva)
    })
    let total = calcularTotal(reserva)
    actualizarTotal(total)
}

function calcularTotal(reserva) {
    return reserva.reduce((acum, curso) => acum + curso.subtotal, 0)
}

function actualizarTotal(total) {
    let elementoTotal = document.getElementById("total")
    elementoTotal.innerText = "$" + total

}

function eliminarReserva(e) {
    let id = Number(e.target.id.substring(3))
    let reserva = recuperarDelStorage("reserva")
    let cursos = recuperarDelStorage("cursos")
    let cursoBuscado = cursos.find(curso => curso.id === id)
    let indiceCurso = reserva.findIndex(curso => curso.id === id)
    if (indiceCurso !== -1) {
        console.log(cursoBuscado.inscriptos)
        reserva.splice(indiceCurso, 1)
        e.target.parentElement.remove()
        cursoBuscado.inscriptos = cursoBuscado.inscriptos - reserva.unidades
    }
    cursoBuscado.inscriptos++
    guardarEnStorage("reserva", reserva)
    guardarEnStorage("cursos", cursos)
    const total = calcularTotal(reserva)
    actualizarTotal(total)
    ////actualizarCupos(reserva)
}



function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("mensaje")
    mensaje.textContent = texto
    mensaje.className = `mensaje ${tipo}`
    mensaje.classList.remove("oculto")

    setTimeout(() => {
        mensaje.classList.add("oculto")
    }, 5000)
}

