import express from "express";
import dotenv from "dotenv";


dotenv.config()

const app = express();
const port = process.env.PORT;
const doctores = [
    {id: 0, nombre: "Ana Hernández", foto:"images/dra1sinFondo.png", especialidad: "Ginecología", ubi: "Lindavista", calif: "⭐⭐⭐⭐⭐"}, 
    {id: 1, nombre: "Gabriel Ramírez", foto:"images/dr1sinFondo.png", especialidad: "Oncología", ubi: "Chapultepec", calif: "⭐⭐⭐⭐⭐"}, 
    {id: 3, nombre: "María Silva", foto:"images/dra2sinFondo.png", especialidad: "Cardiología", ubi: "Escandón", calif: "⭐⭐⭐⭐⭐"}, ]


app.use(express.static("public"));


app.get("/api/doctores", (req, res) => {
    res.json(doctores)
})

app.listen(port, () => {
    console.log(`All good from port  ${port}, Azpil`);
})