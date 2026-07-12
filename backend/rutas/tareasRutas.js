import express from 'express';
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from '../controladores/tareasControlador.js';
import verificarToken from '../middlewares/verificarToken.js';

const enrutador = express.Router();

enrutador.use(verificarToken);

enrutador.get('/', obtenerTareas);
enrutador.post('/', crearTarea);
enrutador.put('/:id', actualizarTarea);
enrutador.delete('/:id', eliminarTarea);

export default enrutador;
