import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../modelos/Usuario.js';

export const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electronico ya esta registrado.' });
    }
    const sal = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, sal);
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptado
    });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el usuario.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'El correo y la contraseña son obligatorios.' });
    }
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales invalidas.' });
    }
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Credenciales invalidas.' });
    }
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRETO || 'eduar2001',
      { expiresIn: '24h' }
    );
    res.status(200).json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesion.', error: error.message });
  }
};
