import express from 'express';
import { registro, login } from '../controladores/autenticacionControlador.js';

const enrutador = express.Router();

enrutador.post('/registro', registro);
enrutador.post('/login', login);

export default enrutador;
