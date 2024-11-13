

function principal() {
    let cursos = [
        { id: 1, nombre: "Yoga Hasana", cupo: 3, inscriptos: 0, categoria: "yoga", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual" },
        { id: 2, nombre: "Stretching", cupo: 2,inscriptos: 0, categoria: "Clases", dias: "miercoles 10 a 11", valor: 25000, periodoabono: "mensual" },
        { id: 3, nombre: "Meditación", cupo: 4,inscriptos: 0,categoria: "Clases", dias: "lunes y miercoles 10 a 11", valor: 15000, periodoabono: "mensual" },
        { id: 4, nombre: "Masajes Relajantes", cupo: 1,inscriptos: 0 ,categoria: "Consultorio", dias: "lunes y Viernes 20 a 21", valor: 5000, periodoabono: "dia" },
        { id: 5, nombre: "Coaching Emocional", cupo: 1, inscriptos: 0, categoria: "Consultorio", dias: "jueves 12 a 14", valor: 6000, periodoabono: "dia" }
    ]


    

    let carrito = [ ]

    let seleccion 
    do {
        
        let seleccion = Number(prompt("0-Salir\n1–Filtrar por categoría\n2–Filtrar por ID"))

        if (seleccion === 0) {
            alert("Ha salido del sistema")
            break
        }
    
        if (seleccion === 1) {
             let mensajecategoria = obtenerCategorias(cursos).join("\n")
             let categoria = prompt("Ingrese alguna categoría para filtrar productos\n" + mensajecategoria)
                categoria = categoria.toLowerCase()
                let listadoFiltrado = filtrarPropiedad(cursos, "categoria", categoria)
                let cursoelegido = Number(prompt("Seleccione un producto por ID\n" + listar(listadoFiltrado)))
                carrito = calcularCupoycarrito (carrito, cursos, cursoelegido)
                   }

        else if (seleccion === 2) {
            let cursoelegido = Number(prompt("Seleccione un producto por ID\n" + listar(cursos)))
            carrito = calcularCupoycarrito (carrito, cursos, cursoelegido)
        }
        else { alert ('opcion ingresada incorrecta')}
 

    } while (seleccion !== 0)

     if (carrito.length > 0) {
         alert("Resumen de tu carrito:\n" + listarcarrito(carrito))
        } else {
            alert("El carrito está vacío.")
        }
}



principal()


function obtenerCategorias(cursos) {
    let filtroCategorias = []
    cursos.forEach(curso => {
        if (!filtroCategorias.includes(curso.categoria)) {
            filtroCategorias.push(curso.categoria)
        }
    })
    return filtroCategorias
}

function filtrarPropiedad(cursos, nombrePropiedad, valorPropiedad) {

    let resultados = cursos.filter(curso => curso[nombrePropiedad]?.toLowerCase() === valorPropiedad.toLowerCase())
    if (resultados.length === 0) {
        alert("No se encontraron cursos que coincidan con la propiedad especificada.")
    }
    return resultados
}





function listar(lista) {
    return lista.map(elemento => "ID: " + elemento.id + " - " + elemento.nombre).join("\n")
}

function listarcarrito(lista) {
    return lista.map(elecarrito =>"ID: " +elecarrito.id+" - " +elecarrito.nombre+" - " +elecarrito.cantidad).join("\n")
}

function calcularCupoycarrito (carrito, cursos, idcurso) {
    let cursoBuscado = cursos.find(curso => curso.id === idcurso)
    let indiceCarrito = carrito.findIndex(cursocarrito => cursocarrito.id === idcurso)
    if (cursoBuscado) {
        if (cursoBuscado.inscriptos < cursoBuscado.cupo) {
        if (indiceCarrito !== -1) {
            carrito[indiceCarrito].cantidad++ }
            else {
            carrito.push({
                id: cursoBuscado.id,
                nombre: cursoBuscado.nombre,
                cantidad: 1, 
            })
        }
            cursoBuscado.inscriptos++
            alert(`¡Te esperamos en tu clase! \nRESERVA EFECTUADA.\n${listar(carrito)}`)
        } else {
            alert("Lo siento, no hay más cupos disponibles para este curso.")
        }
    } else {
        alert("Curso no encontrado.")
    }
    return carrito
}

   
    
