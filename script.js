
  let opcion
  let inscriptos = 0
    do {
    
     opcion = Number(prompt("0-Salir\n1–Yoga \n2-Stretching \n3-Meditación"))
      
     console.log(opcion)

      if (opcion === 0) {
        alert ('usted ha salido del sistema') 
        break
       }
      let resultado = 0    
      if (opcion === 1) {inscriptos++
       resultado= calcularCupo(3, inscriptos)
       } 
       else if (opcion === 2) {inscriptos++
        resultado= calcularCupo(2, inscriptos)
       } 
       else if (opcion === 3) {inscriptos++
       resultado=  calcularCupo(4, inscriptos)
       } 
       else { alert ('opcion ingresada incorrecta')
        break
       }
       if (resultado < 0) {
        alert("Lo siento, no hay lugar en tu clase.")
        break
      } 
      else {
        alert("¡Te esperamos en tu clase! \nRESERVA EFECTUADA.")
    }
    } while (opcion !== 0) 

    


  function calcularCupo(cupo, inscriptos) {
    console.log(cupo - inscriptos)
    return  cupo - inscriptos
    
}
  