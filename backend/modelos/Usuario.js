import mongoose from 'mongoose';

const usuarioEsquema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioEsquema);
export default Usuario;
