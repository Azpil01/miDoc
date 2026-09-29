# 🏥 Mi Agenda Clínica

Sistema web full-stack desarrollado para la gestión integral de citas médicas y control de pacientes y doctores. 
Diseñado para optimizar la administración de consultorios o pequeñas clínicas mediante una interfaz intuitiva y lógica de backend robusta.

---

## 🚀 Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Base de Datos:** MySQL
* **Frontend / Vistas:** HTML5, CSS3, JavaScript (ES6+), EJS (Embedded JavaScript templates)
* **Librerías / Utilidades:** SweetAlert2 (notificaciones interactivas)
* **Control de Versiones:** Git & GitHub

---

## 📋 Características Principales

* **Gestión de Usuarios:** Registro y diferenciación de roles para pacientes y personal médico.
* **Control de Citas:** Programación, modificación y seguimiento de citas médicas en tiempo real.
* **Validación de Datos:** Verificación de disponibilidad de nombres de usuario en el backend para evitar duplicidades.
* **Experiencia de Usuario (UX):** Interfaz dinámica con alertas y notificaciones visuales optimizadas mediante SweetAlert2.

---

## 📂 Estructura del Proyecto

```text
mi-agenda-clinica/
├── public/           # Archivos estáticos (CSS, imágenes, scripts de cliente)
├── views/            # Plantillas EJS para las vistas del frontend
├── src/ / routes/    # Lógica de rutas del servidor y controladores
├── .env.example      # Plantilla de variables de entorno
├── app.js            # Archivo principal de configuración del servidor
└── package.json      # Dependencias y scripts del proyecto
