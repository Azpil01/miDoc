import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";


dotenv.config();

const app = express();



// const doctores = [
//     {id: 0, nombre: "Ana Hernández", foto:"images/dra1sinFondo.png", especialidad: "Ginecología", ubi: "Lindavista", calif: "⭐⭐⭐⭐⭐"},
//     {id: 1, nombre: "Gabriel Ramírez", foto:"images/dr1sinFondo.png", especialidad: "Oncología", ubi: "Chapultepec", calif: "⭐⭐⭐⭐⭐"},
//     {id: 3, nombre: "María Silva", foto:"images/dra2sinFondo.png", especialidad: "Cardiología", ubi: "Escandón", calif: "⭐⭐⭐⭐⭐"}, ]

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//+Para inicializar nuestra base de datos//

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

console.log("Successfully connected to Hostinger DB");

//+Esta Endpoint nos muestra 3 doctores en la pantalla principal
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

app.get("/api/doctores/buscar", async (req, res) => {
  const { especialidad = "", ubicacion = "", pagina = 1 } = req.query;
  const limite = 10; //*Cantidad de doctores por página
  const offset = (Number(pagina) - 1) * limite; //*La cantidad de registros a saltarse antes de devolver datos, ejempl, si estas en la pagina 1, registros del 0 al 10
  //*si estas en la pagina 2, quieres saltarte los primero 10 porque ya pasaron en la página 1
  //+Con esto cinvertimos a number lo que se haya introducido en pagina

  let whereSQL = " WHERE  activo = 1"; //+Con esto comenzamos a hacer nuestra query
  const queryParams = []; //+Son los parametros que le vamos a pasar a nuestra query

  if (especialidad.trim() !== "") {
    //+Si detecta que hay req.query.especialidad no está vacío
    whereSQL += " AND especialidad LIKE ?"; //+Entonces a la query se le agrega lo que se desea filtrar
    queryParams.push(`%${especialidad}%`); //+Y al arreglo se le agrega lo que está como param con el nombre especialidad
  }

  if (ubicacion.trim() !== "") {
    whereSQL += " AND (ubicacion_principal LIKE ? OR nombre LIKE ?)"; //+Ya sea que haya introducido la ubicacion o el nombre del doctor. Se pone en paréntesis para
    //+decir, que el doctor DEBE estar activo y además cumplir una  de las dos condiciones del paréntesis,
    queryParams.push(`%${ubicacion}%`, `%${ubicacion}%`);
  }

  try {
    //+COUNT cuenta cuantos valores hay
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM doctores ${whereSQL}`,
      queryParams,
    ); //+Deestructuramos para tomar en countResult
    //+el valor que hay en la posición 0 del arreglo de la respuesta de la query
    const totalDoctores = countResult[0].total; //+ Accedemos a [{total:45}], es decir, lo que hay en la posición 0 con propiedad de total
    const queryText = `SELECT foto_perfil, especialidad, nombre, apellido_pat, ubicacion_principal, promedio_calif, 
      precio_consulta FROM doctores ${whereSQL} LIMIT ? OFFSET ?`;
    const [doctores] = await pool.query(queryText, [
      ...queryParams,
      limite,
      offset,
    ]); //+ los puntos suspensivos hacen que queryParams se
    //+desempaquete y no pase como un arreglo dentro del arreglo que pasamos a la query

    res.json({
      doctores,
      totalDoctores,
      totalPaginas: Math.ceil(totalDoctores / limite),
      paginaActual: Number(pagina),
    });
  } catch (error) {
    console.error("Error en la búsqueda: ", error);
    res.status(500).json({ error: "Error al realizar la búsqueda" });
  }
});

//*********Endpoint para registro de usuarios ***********/

app.post("/api/v1/auth/register", async (req, res) => {
  
  try{
    const { nombre, apellidoPat, apellidoMat, celular, correo, contraseña, contraseñaConfirmacion} = req.body;
    if (contraseña !== contraseñaConfirmacion) {
      return res.status(400).json({error: "Las contraseñas no coinciden"});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const queryText = "INSERT INTO pacientes (nombre, apellido_pat, apellido_mat, telefono, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
    let queryValues = [nombre, apellidoPat, apellidoMat, celular, correo, hashedPassword];

    const [result] = await pool.query(queryText, queryValues)
    console.log("Usuario registrado con éxito")
    console.log("Number of affected rows: ", result.affectedRows)
    console.log(`ID: ${result.insertId} assigned to user ${correo}` )
    

    return res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: {correo}
    })  

  } catch(error) {
    console.error("Error en el servidor al registrar: ", error);
    return res.status(500).json({error: "Error interno en el servidor"})
  }
})


//*********Endpoint para registro de doctores ***********/

app.post("/api/v1/auth/register-doctor", async (req, res) => {
  
  try{
    const { nombre, apellidoPat, apellidoMat, cedula, celular, correo, especialidad, ubicacionPrincipal, contraseña, contraseñaConfirmacion} = req.body;
    if (contraseña !== contraseñaConfirmacion) {
      return res.status(400).json({error: "Las contraseñas no coinciden"});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const queryText = "INSERT INTO doctores (nombre, apellido_pat, apellido_mat, ced_prof, celular, email, especialidad, ubicacion_principal, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let queryValues = [nombre, apellidoPat, apellidoMat, cedula,  celular, correo, especialidad, ubicacionPrincipal, hashedPassword];

    const [result] = await pool.query(queryText, queryValues)
    console.log("Profesionista registrado con éxito")
    console.log("Number of affected rows: ", result.affectedRows)
    console.log(`ID: ${result.insertId} assigned to user ${correo}` )
    

    return res.status(201).json({
      mensaje: "Profesionista registrado exitosamente",
      usuario: {correo}
    })  

  } catch(error) {
    console.error("Error en el servidor al registrar: ", error);
    return res.status(500).json({error: "Error interno en el servidor"})
  }
})



const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
