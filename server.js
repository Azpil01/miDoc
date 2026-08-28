import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const port = process.env.PORT;

// const doctores = [
//     {id: 0, nombre: "Ana Hernández", foto:"images/dra1sinFondo.png", especialidad: "Ginecología", ubi: "Lindavista", calif: "⭐⭐⭐⭐⭐"},
//     {id: 1, nombre: "Gabriel Ramírez", foto:"images/dr1sinFondo.png", especialidad: "Oncología", ubi: "Chapultepec", calif: "⭐⭐⭐⭐⭐"},
//     {id: 3, nombre: "María Silva", foto:"images/dra2sinFondo.png", especialidad: "Cardiología", ubi: "Escandón", calif: "⭐⭐⭐⭐⭐"}, ]

app.use(express.static("public"));

let pool;

//+Para inicializar nuestra base de datos//
function initializeDB() { 
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("Successfully connected to Hostinger DB");
}

app.get("/api/doctores", async (req, res) => {
  const queryText =
    "SELECT foto_perfil, especialidad, nombre, apellido_pat, ubicacion_principal, promedio_calif FROM `doctores` WHERE activo = 1 ORDER BY RAND() LIMIT 3";
  try {
    const [result] = await pool.query(queryText); //+Deestructuramos la consulta para que result tome los valores de la posición 0 de la respuesta 
    res.json(result); //+Los mandamos como respuesta a app.js
  } catch (error) {
    console.error("Error fetching doctors from DB:", error);
    res.status(500).json({ error: "Error al obtener los doctores" });
  }
});


//+IIFE para que sepamos que ya se conectó a la base de datos de Hostinger en cuanto arranca la app
(async () => {
  //Esta es una función autoejecutable  o IIFE: Inmediatly Invoked Function Expression
  try {
    initializeDB(); // <- clave --Espera a inicializar la base de datos
    app.listen(port, () => console.log("All ok from port 3000")); //Inicializa la aplicación
  } catch (err) {
    //En caso de error
    console.error("Error inicializando la BD:", err); //Nos manda a la consola el error
    process.exit(1);
  }
})();
