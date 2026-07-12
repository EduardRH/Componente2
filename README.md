# Sistema de Gestion de Tareas

Este es un sistema completo de Gestion de Tareas desarrollado con el stack MERN (MongoDB, Express, React, Node.js). Ofrece autenticacion de usuarios mediante JSON Web Tokens (JWT) y una interfaz de usuario moderna con diseno premium (glassmorphism y modo oscuro).

## Estructura del Proyecto

El proyecto esta dividido en dos directorios principales:
- `backend/`: API REST desarrollada con Node.js, Express y Mongoose.
- `frontend/`: Aplicacion de una sola pagina (SPA) desarrollada con React y Vite.

---

## Requisitos Previos

Asegurate de tener instalados los siguientes componentes en tu sistema:
- Node.js (version 18 o superior recomendada)
- MongoDB (instancia local ejecutandose en el puerto por defecto 27017 o una base de datos en la nube Atlas)

---

## Configuracion e Instalacion del Backend

1. Ingresa al directorio del servidor:
   ```bash
   cd backend
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Modifica o crea el archivo `.env` en la raiz de la carpeta `backend/` con las siguientes variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/gestion-tareas
   JWT_SECRETO=clave_secreta_super_segura_de_gestion_de_tareas
   ```

4. Inicia el servidor en modo de desarrollo:
   ```bash
   npm run dev
   ```
   El servidor se ejecutara en `http://localhost:5000`.

---

## Configuracion e Instalacion del Frontend

1. Ingresa al directorio del cliente:
   ```bash
   cd frontend
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia la aplicacion de React en modo de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicacion se ejecutara en `http://localhost:5173`. Abre esa direccion en tu navegador para interactuar con la aplicacion.

---

## Funcionalidades del Sistema

- **Registro de Usuarios**: Permite registrar nuevos usuarios con nombre, correo electronico unico y contraseña encriptada de forma segura mediante `bcrypt`.
- **Inicio de Sesion**: Valida las credenciales y devuelve un token JWT.
- **Rutas Protegidas**: Bloquea el acceso al panel de tareas si no existe una sesion activa.
- **CRUD de Tareas**: Permite crear, visualizar, actualizar el estado (pendiente/completada), editar el contenido y eliminar tareas asociadas unicamente al usuario autenticado.
- **Filtros Avanzados**: Filtra tareas en tiempo real entre todas, pendientes o completadas.
