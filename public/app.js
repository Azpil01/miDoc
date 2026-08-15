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
                    <img src="${doc.foto}" class="avatar-sm">
                    <div class="info-sm">
                        <span class="badge">${doc.especialidad}</span> 
                        <h3>${doc.nombre}</h3>
                        <p>${doc.ubi} || México </p>
                        <p>${doc.calif}</p>
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