import mongoose from 'mongoose';

const tareaEsquema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada'],
    default: 'pendiente'
  },
  prioridad: {
    type: String,
    enum: ['Alta', 'Media', 'Baja'],
    default: 'Media'
  },
  categoria: {
    type: String,
    enum: ['Trabajo', 'Hogar', 'Personal'],
    default: 'Hogar'
  },
  fechaLimite: {
    type: String
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

const Tarea = mongoose.model('Tarea', tareaEsquema);
export default Tarea;
