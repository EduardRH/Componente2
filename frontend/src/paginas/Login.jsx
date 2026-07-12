import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { usarAutenticacion } from '../contexto/AutenticacionContexto';

const Login = () => {
  const [correo, establecerCorreo] = useState('');
  const [contrasenia, establecerContrasenia] = useState('');
  const [mensajeError, establecerMensajeError] = useState('');
  const [cargando, establecerCargando] = useState(false);

  const [correoValido, establecerCorreoValido] = useState(null);
  const [contraseniaValida, establecerContraseniaValida] = useState(null);

  const { iniciarSesion } = usarAutenticacion();
  const navegar = useNavigate();

  useEffect(() => {
    if (correo === '') {
      establecerCorreoValido(null);
    } else {
      const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      establecerCorreoValido(patronCorreo.test(correo));
    }
  }, [correo]);

  useEffect(() => {
    if (contrasenia === '') {
      establecerContraseniaValida(null);
    } else {
      establecerContraseniaValida(contrasenia.length >= 6);
    }
  }, [contrasenia]);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!correo || !contrasenia) {
      establecerMensajeError('El correo y la contrasenia son obligatorios');
      return;
    }
    try {
      establecerMensajeError('');
      establecerCargando(true);
      await iniciarSesion(correo, contrasenia);
      navegar('/');
    } catch (errorPeticion) {
      establecerMensajeError(
        errorPeticion.response?.data?.mensaje || 'Credenciales incorrectas o error de conexion'
      );
    } finally {
      establecerCargando(false);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <div className="tarjeta-autenticacion">
        <h2 className="titulo-formulario">
          Iniciar <span className="texto-destacado-formulario">Sesion</span>
        </h2>
        <p className="subtitulo-autenticacion">
          Gestiona tus tareas diarias de forma eficiente
        </p>

        {mensajeError && <div className="alerta-error">{mensajeError}</div>}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="grupo-formulario">
            <label htmlFor="correo-login">Correo Electronico</label>
            <div className="contenedor-entrada-icono">
              <Mail className="icono-entrada-izquierdo" size={18} />
              <input
                id="correo-login"
                type="email"
                value={correo}
                onChange={(e) => establecerCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
              {correoValido !== null && (
                correoValido ? (
                  <CheckCircle2 className="icono-validacion-derecho exito" size={18} />
                ) : (
                  <XCircle className="icono-validacion-derecho error" size={18} />
                )
              )}
            </div>
          </div>

          <div className="grupo-formulario">
            <label htmlFor="contrasenia-login">Contraseña</label>
            <div className="contenedor-entrada-icono">
              <Lock className="icono-entrada-izquierdo" size={18} />
              <input
                id="contrasenia-login"
                type="password"
                value={contrasenia}
                onChange={(e) => establecerContrasenia(e.target.value)}
                placeholder="Contraseña"
                required
              />
              {contraseniaValida !== null && (
                contraseniaValida ? (
                  <CheckCircle2 className="icono-validacion-derecho exito" size={18} />
                ) : (
                  <XCircle className="icono-validacion-derecho error" size={18} />
                )
              )}
            </div>
          </div>

          <button type="submit" className="boton-primario" disabled={cargando}>
            {cargando ? 'Iniciando sesion...' : 'Entrar'}
          </button>
        </form>

        <p className="enlace-autenticacion">
          ¿No tienes una cuenta? <Link to="/registro">Registrate aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
