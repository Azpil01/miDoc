async function obtenerDoctores() {
    try {
        const res = await fetch("/api/doctores");
        if (!res.ok){
            throw new Error ("Hubo un problema al conectar con la API");
        }
        const datos = await res.json();

        const contenedor = document.getElementById("doctores-container");
        contenedor.innerHTML = "";

        datos.forEach(doc => {
            contenedor.innerHTML += `
                <div class="doctor-card">
                    <img src="${doc.foto_perfil}" class="avatar-sm">
                    <div class="info-sm">
                        <span class="badge">${doc.especialidad}</span> 
                        <h3>${doc.nombre} ${doc.apellido_pat}</h3>
                        <p>${doc.ubicacion_principal} || México </p>
                        <p>${doc.promedio_calif}</p>
                        <button class="btn-agendar">Agendar</button>
                    </div>
                </div>
            `;
        })


    }catch(error) {
        console.error("Error:", error);
    }
}

obtenerDoctores()


document.addEventListener("DOMContentLoaded", ()=> {
    const searchForm = document.getElementById("search-form"); //+Tomamos posesion del elemento por su id
    const inputEspecialidad = document.getElementById("input-especialidad");
    const inputUbicacion = document.getElementById("input-ubicacion");
    const doctoresContainer = document.getElementById("doctores-container");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault() //+Evitamos que la página se recargue al darle click al botón
        const especialidad = inputEspecialidad.value.trim(); //+Con esto tomamos el valor que se introdujo en el input y se limpia 
        const ubicacion = inputUbicacion.value.trim(); //+Con esto tomamos el valor que se introdujo en el input y se limpia

        try {
            const res = await fetch(`/api/doctores/buscar?especialidad=${encodeURIComponent(especialidad)}&ubicacion=${encodeURIComponent(ubicacion)}&pagina=1`); //+Este
            //+Se encarga de esperar la respuesta del servidor
            if(!res.ok) {
                throw new Error ("Hubo problema al conectar con la API")
            }
            const datos = await res.json(); //+Este se encarga de esperar al navegador de que lea y procese los datos
            doctoresContainer.innerHTML = "";

            if (datos.doctores.length === 0) { //+En caso que no haya coincidencias
                doctoresContainer.innerHTML = "<h2>Lo sentimos, no hay coincidencias</h2>"
            }

            datos.doctores.forEach((doc) => { 
                doctoresContainer.innerHTML += `
                    <div class="doctor-card">
                    <img src="${doc.foto_perfil}" class="avatar-sm">
                    <div class="info-sm">
                        <span class="badge">${doc.especialidad}</span> 
                        <h3>${doc.nombre} ${doc.apellido_pat}</h3>
                        <p>${doc.ubicacion_principal} || México </p>
                        <p>${doc.promedio_calif}</p>
                        <button class="btn-agendar">Agendar</button>
                    </div>
                </div>
                `
            }) 


        } catch (error) {
            console.error("Error: ", error)
        }
    })
    
})