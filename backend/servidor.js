import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import autenticacionRutas from './rutas/autenticacionRutas.js';
import tareasRutas from './rutas/tareasRutas.js';

dotenv.config();

const aplicacion = express();
const puerto = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestion-tareas';

aplicacion.use(cors());
aplicacion.use(express.json());

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB correctamente');
  })
  .catch((error) => {
    console.error('Error de conexion a MongoDB:', error.message);
  });

aplicacion.use('/api/auth', autenticacionRutas);
aplicacion.use('/api/tareas', tareasRutas);

aplicacion.use((error, req, res, next) => {
  res.status(500).json({ mensaje: 'Ha ocurrido un error en el servidor.', error: error.message });
});

aplicacion.listen(puerto, () => {
  console.log(`Servidor ejecutandose en el puerto ${puerto}`);
});
