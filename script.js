function Alumno(nombre, apellidos, edad){    
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.edad = edad;
    this.materias = [];
}

Alumno.prototype.guardarCalificacion = function(materiaNombre, calificacion){
    const result = this.validarMateria(materiaNombre);

    if (result !== -1) {
        if (this.materias[result].calificacion == null) {
            this.materias[result].calificacion = calificacion;            
        } else {
            showErrors("NotNullCali");
        }
    } else{
        showErrors("NoInscrito");
    }
}

Alumno.prototype.inscribirMateria = function (materia) {
    const result = this.validarMateria(materia.nombre);
    if (result == -1){
        this.materias.push(materia);
    } else{
        showErrors("Inscrito");
    }
}

Alumno.prototype.validarMateria = function (materiaNombre){
    return this.materias.findIndex(m => m.nombre === materiaNombre);
}

Alumno.prototype.calcularPromedio = function () {
    const materiasInscritas = this.materias;

    let contador = 0;

    const SumaCalificaciones = materiasInscritas.reduce((acumulador, materia) =>{
        // condicion para solo sumar materias con calificacion
        if (materia.calificacion !== null) {
            contador++;
            return acumulador + materia.calificacion;
        } else {
            return acumulador;
        }
    }, 0)
    
    const promedio = SumaCalificaciones/contador;
    return promedio;
}

function Materia(nombre){
    this.nombre = nombre;
    this.calificacion = null;
}

function Clase(nombre){
    this.nombre = nombre;
    this.alumnosInscritos = [];
}

Clase.prototype.agregarAlumno = function (nuevoAlumno) {
    const result = this.validarAlumno(nuevoAlumno);
    if (result == -1) {
        this.alumnosInscritos.push(nuevoAlumno);        
    }
}

Clase.prototype.validarAlumno = function (alumno) {
    return this.alumnosInscritos.findIndex(a => a.nombre === alumno.nombre && a.apellidos === alumno.apellidos && a.edad === alumno.edad);
}

function altaAlumno() {
    const nombre = document.getElementById('nombre').value.toUpperCase();
    const apellidos = document.getElementById('apellidos').value.toUpperCase();
    const edad = parseInt(document.getElementById('edad').value);

    const regex = /^[a-zA-ZñÑ]+(?:\s[a-zA-ZñÑ]+)*$/;

    if (edad > 17) {
        if (regex.test(nombre) && regex.test(apellidos)) {
            const alumno = new Alumno(nombre, apellidos, edad);
            const indiceAlumno = obtenerIndiceAlumno(obtenerAlumnos(), alumno);
            if (indiceAlumno == -1) {
                guardarAlumno(alumno);        
            } else {
                showErrors("ExisteAlumno");
            }  
        } else{
            showErrors("Texto");
        }            
    } else{
        showErrors("Edad");
    }    
    mostrarAlumnosInscripcion();
    mostrarAlumnosCal();
}

function guardarAlumno(alumno) {
    let alumnosArray = JSON.parse(localStorage.getItem('alumnos')) || [];
    alumnosArray.push(alumno);
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}

function crearClase() {
    const claseNombre = document.getElementById('materiaNombre').value.toUpperCase();
    const clase = new Clase(claseNombre);
    const indiceClase = obtenerIndiceClase(obtenerClases(), clase);

    const regex = /^[a-zA-ZñÑ]+(?:\s[a-zA-ZñÑ]+)*$/;

    if (regex.test(claseNombre)) {
        if (indiceClase == -1) {
            guardarClase(clase);        
        } else {
            showErrors("ClaseInscrita");
        }        
    } else{
        showErrors("TextoClase");
    }
    mostrarClasesInscripcion();
    mostrarClasesCal();
}

function guardarClase(clase) {
    let clasesArray = JSON.parse(localStorage.getItem('clases')) || [];
    clasesArray.push(clase);
    localStorage.setItem('clases', JSON.stringify(clasesArray));
}

function obtenerAlumnos() {
    const alumnosGuardados = JSON.parse(localStorage.getItem('alumnos')) || [];
    return alumnosGuardados.map(alumno => {
        const { nombre, apellidos, edad, materias } = alumno;
        const nuevoAlumno = new Alumno(nombre, apellidos, edad);
        nuevoAlumno.materias = materias;
        return nuevoAlumno;
    });
}

function obtenerClases() {
    const clasesGuardadas = JSON.parse(localStorage.getItem("clases")) || [];
    return clasesGuardadas.map(clase => {
        const {nombre, alumnosInscritos} = clase;
        const nuevaClase = new Clase(nombre);
        nuevaClase.alumnosInscritos = alumnosInscritos;
        return nuevaClase;
    })
}

function asignarClase() {
    const alumnoSeleccionado = JSON.parse(document.getElementById("alumnosInscripcion").value);
    const materiaSeleccionada = document.getElementById("materiasInscripcion").value;
    const nuevaMateria = new Materia(materiaSeleccionada);

    const alumnosArray = obtenerAlumnos();
    const clasesArray = obtenerClases();
    
    const indiceAlumno = obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado);
    const indiceClase = obtenerIndiceClase(clasesArray, nuevaMateria);

    if (indiceAlumno!== -1 && indiceClase !== -1) {
        alumnosArray[indiceAlumno].inscribirMateria(nuevaMateria);
        clasesArray[indiceClase].agregarAlumno(alumnosArray[indiceAlumno]);
        actualizarAlumno(alumnosArray);
        actualizarClase(clasesArray);
        console.log(alumnosArray[indiceAlumno]);//delete
        console.log(clasesArray);//delete
    } else {
        alert("Error: No se pudo encontrar al alumno.");
    }
}

function mostrarAlumnosInscripcion() {
    const alumnos = obtenerAlumnos();
    const selectAlumnosInscripcion = document.getElementById('alumnosInscripcion');
    selectAlumnosInscripcion.innerHTML = '';
    
    alumnos.forEach(alumno => {
        const option = document.createElement('option');
        option.text = `${alumno.nombre} ${alumno.apellidos}`;
        option.value = JSON.stringify(alumno);
        selectAlumnosInscripcion.appendChild(option);
    });
}

function mostrarClasesInscripcion() {
    const clases = obtenerClases();
    const selectClasesInscripcion = document.getElementById('materiasInscripcion');
    selectClasesInscripcion.innerHTML = '';

    clases.forEach(clase => {
        const option = document.createElement('option');
        option.text = clase.nombre;
        option.value = clase.nombre;
        selectClasesInscripcion.appendChild(option);
    });
}

function asignarCalificacion() {
    const alumnoSeleccionado = JSON.parse(document.getElementById('alumnosCal').value);
    const materiaSeleccionada = document.getElementById('materiasCal').value;
    const calificacion = parseFloat(document.getElementById('calificacion').value);

    const alumnosArray = obtenerAlumnos();

    const indiceAlumno = obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado);

    if (indiceAlumno !== -1 && calificacion >= 0) {
        alumnosArray[indiceAlumno].guardarCalificacion(materiaSeleccionada, calificacion);
        actualizarAlumno(alumnosArray);
        console.log(alumnosArray[indiceAlumno]);
        alert("Se ha asignado la calificación correctamente.");
    } else if (indiceAlumno == -1) {
        alert("Error: No se pudo encontrar al alumno.");
    } else {
        showErrors("Numero Negativo");
    }
}

function mostrarAlumnosCal() {
    const alumnos = obtenerAlumnos();
    const selectAlumnosCal = document.getElementById('alumnosCal');
    selectAlumnosCal.innerHTML = '';
    
    alumnos.forEach(alumno => {
        const option = document.createElement('option');
        option.text = `${alumno.nombre} ${alumno.apellidos}`;
        option.value = JSON.stringify(alumno);
        selectAlumnosCal.appendChild(option);
    });
}

function mostrarClasesCal() {
    const materias = obtenerClases();
    const selectMateriasCal = document.getElementById('materiasCal');
    selectMateriasCal.innerHTML = '';

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.text = materia.nombre;
        option.value = materia.nombre;
        selectMateriasCal.appendChild(option);
    });
}

function obtenerIndiceAlumno(alumnosArray, alumnoSeleccionado) {
    return alumnosArray.findIndex(a => a.nombre === alumnoSeleccionado.nombre && a.apellidos === alumnoSeleccionado.apellidos && a.edad === alumnoSeleccionado.edad);    
}

function obtenerIndiceClase(clasesArray, clase) {
    return clasesArray.findIndex(c => c.nombre === clase.nombre);    
}

function actualizarAlumno(alumnosArray) {
    localStorage.setItem('alumnos', JSON.stringify(alumnosArray));
}

function actualizarClase(clasesArray) {
    localStorage.setItem('clases', JSON.stringify(clasesArray));
}

function showErrors(tipo){
    let error = document.getElementById(`error${tipo}`)

    error.classList.remove("oculto")
    error.classList.add("error")
    setTimeout(()=>{
        error.classList.remove("error")
        error.classList.add("oculto")
    }, 6000)   
}

function buscarPorNombreApellido() {
    const query = prompt("Por favor ingrese el nombre o apellido del alumno a buscar:");
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.filter(alumno => {
        const nombreCompleto = `${alumno.nombre} ${alumno.apellidos}`;
        return nombreCompleto.toLowerCase().includes(query.toLowerCase());
    });
    mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
    ocultarTablaDiv("promedioAlumnosResultados");
    ocultarTablaDiv("mostrarResultadosCalificacion");
    const busquedaDiv = document.getElementById('busqueda');
    busquedaDiv.innerHTML = '';

    if (resultados.length === 0) {
        busquedaDiv.innerText = 'No se encontró ningún resultado.';
    } else {
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Edad</th>
            </tr>
        `;
        resultados.forEach(alumno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alumno.nombre}</td>
                <td>${alumno.apellidos}</td>
                <td>${alumno.edad}</td>
            `;
            table.appendChild(row);
        });
        busquedaDiv.appendChild(table);
    }
}

function obtenerPromedioAlumnos() {
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.map(alumno => {
        const promedio = alumno.calcularPromedio();
        if (!isNaN(promedio)) {
            return {
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            promedio: promedio.toFixed(2)
            };
        }
    }).filter(Boolean);
    mostrarPromedioAlumnos(resultados);
}

function mostrarPromedioAlumnos(resultados) {
    ocultarTablaDiv("busqueda");
    ocultarTablaDiv("mostrarResultadosCalificacion");
    const promediosDiv = document.getElementById('promedioAlumnosResultados');
    promediosDiv.innerHTML = "";

    const tablaDiv = document.createElement('div');

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Promedio</th>
        </tr>
    `;
    resultados.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.apellidos}</td>
            <td>${alumno.promedio}</td>
        `;
        table.appendChild(row);
    });

    tablaDiv.appendChild(table);

    promediosDiv.appendChild(tablaDiv);
}

function ordenarAlumnosAscendente() {
    const alumnos = obtenerAlumnos();
    alumnos.sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellidos}`;
        const nombreB = `${b.nombre} ${b.apellidos}`;
        return nombreA.localeCompare(nombreB);
    });
    mostrarResultados(alumnos);
}

function ordenarAlumnosDescendente() {
    const alumnos = obtenerAlumnos();
    alumnos.sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellidos}`;
        const nombreB = `${b.nombre} ${b.apellidos}`;
        return nombreB.localeCompare(nombreA);
    });
    mostrarResultados(alumnos);
}

function ordenarAlumnosCalificacionAscendente(){
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.map(alumno => {
        const promedio = alumno.calcularPromedio();
        if (!isNaN(promedio)) {
            return {
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            promedio: promedio.toFixed(2)
            };
        }
    }).filter(Boolean);
    resultados.sort((a, b) => {
        const promedioA =  a.promedio;
        const promedioB = b.promedio;
        return promedioB - promedioA;
    });
    mostrarCalificacionAD(resultados);
}
function ordenarAlumnosCalificacionDescendente(){
    const alumnos = obtenerAlumnos();
    const resultados = alumnos.map(alumno => {
        const promedio = alumno.calcularPromedio();
        if (!isNaN(promedio)) {
            return {
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            promedio: promedio.toFixed(2)
            };
        }
    }).filter(Boolean);
    resultados.sort((a, b) => {
        const promedioA =  a.promedio;
        const promedioB = b.promedio;
        return promedioA - promedioB;
    });
    mostrarCalificacionAD(resultados);
}

function mostrarCalificacionAD(resultados) {
    ocultarTablaDiv("mostrarResultadosCalificacion");
    ocultarTablaDiv("busqueda");
    ocultarTablaDiv("promedioAlumnosResultados");
    const resultadosDiv = document.getElementById('mostrarResultadosCalificacion');
    resultadosDiv.innerHTML = "";
    
    const tablaDiv = document.createElement('div');

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Calificacion</th>
        </tr>
    `;
    resultados.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.apellidos}</td>
            <td>${alumno.promedio}</td>
        `;
        table.appendChild(row);
    });
    tablaDiv.appendChild(table);
    resultadosDiv.appendChild(tablaDiv);
}

function ocultarTablaDiv(id){
    const div = document.getElementById(id);
    div.innerHTML = "";
}

function borrarDatos() {
    localStorage.removeItem('alumnos');
    localStorage.removeItem('clases');
    mostrarAlumnosInscripcion();
    mostrarClasesInscripcion();
    mostrarAlumnosCal();
    mostrarClasesCal();
}

function obtenerClasesPromedio() {
    const materias = obtenerClases();
    const selectMateriasPromedio = document.getElementById('materiasPromedio');
    selectMateriasPromedio.innerHTML = '';

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.text = materia.nombre;
        option.value = materia.nombre;
        selectMateriasPromedio.appendChild(option);
    });
}
function obtenerPromedioMateria() {
    const materiaSeleccionada = document.getElementById('materiasPromedio').value;
    const alumnos = obtenerAlumnos();
    const calificacionesMateria = alumnos.flatMap(alumno => {
        const index = alumno.materias.indexOf(materiaSeleccionada);
        return index !== -1 ? [alumno.calificaciones[index]] : [];
    });
    if (calificacionesMateria.length === 0) {
        alert("No existen calificaciones registradas para esta materia escolar.");
    } else {
        const promedio = calificacionesMateria.reduce((a, b) => a + b, 0) / calificacionesMateria.length;
        alert(`El promedio de la materia de ${materiaSeleccionada} es: ${promedio.toFixed(2)}`);
    }
}

mostrarAlumnosInscripcion();
mostrarClasesInscripcion();
mostrarAlumnosCal();
mostrarClasesCal();