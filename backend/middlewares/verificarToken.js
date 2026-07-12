import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
  const encabezadoAutorizacion = req.header('Authorization');
  if (!encabezadoAutorizacion) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporciono token.' });
  }
  const token = encabezadoAutorizacion.startsWith('Bearer ')
    ? encabezadoAutorizacion.slice(7)
    : encabezadoAutorizacion;
  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRETO || 'eduar2001');
    req.usuarioId = verificado.id;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token no valido.' });
  }
};

export default verificarToken;
