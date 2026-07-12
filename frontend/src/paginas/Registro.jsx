import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { usarAutenticacion } from '../contexto/AutenticacionContexto';

const Registro = () => {
  const [nombre, establecerNombre] = useState('');
  const [correo, establecerCorreo] = useState('');
  const [contrasenia, establecerContrasenia] = useState('');
  const [confirmarContrasenia, establecerConfirmarContrasenia] = useState('');
  const [mensajeError, establecerMensajeError] = useState('');
  const [mensajeExito, establecerMensajeExito] = useState('');
  const [cargando, establecerCargando] = useState(false);

  const [nombreValido, establecerNombreValido] = useState(null);
  const [correoValido, establecerCorreoValido] = useState(null);
  const [contraseniaValida, establecerContraseniaValida] = useState(null);
  const [confirmacionValida, establecerConfirmacionValida] = useState(null);

  const { registrarUsuario } = usarAutenticacion();
  const navegar = useNavigate();

  useEffect(() => {
    if (nombre === '') {
      establecerNombreValido(null);
    } else {
      establecerNombreValido(nombre.trim().length >= 3);
    }
  }, [nombre]);

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

  useEffect(() => {
    if (confirmarContrasenia === '') {
      establecerConfirmacionValida(null);
    } else {
      establecerConfirmacionValida(
        confirmarContrasenia === contrasenia && contrasenia.length >= 6
      );
    }
  }, [confirmarContrasenia, contrasenia]);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!nombre || !correo || !contrasenia || !confirmarContrasenia) {
      establecerMensajeError('Todos los campos son obligatorios');
      return;
    }
    if (contrasenia !== confirmarContrasenia) {
      establecerMensajeError('Las contraseñas no coinciden');
      return;
    }
    try {
      establecerMensajeError('');
      establecerMensajeExito('');
      establecerCargando(true);
      await registrarUsuario(nombre, correo, contrasenia);
      establecerMensajeExito('Registro exitoso. Redirigiendo al inicio de sesion...');
      setTimeout(() => {
        navegar('/login');
      }, 2000);
    } catch (errorPeticion) {
      establecerMensajeError(
        errorPeticion.response?.data?.mensaje || 'Error al intentar registrarse'
      );
      establecerCargando(false);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <div className="tarjeta-autenticacion">
        <h2 className="titulo-formulario">
          Registra <span className="texto-destacado-formulario">Cuenta</span>
        </h2>
        <p className="subtitulo-autenticacion">
          Comienza a organizar tu trabajo hoy mismo
        </p>

        {mensajeError && <div className="alerta-error">{mensajeError}</div>}
        {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="grupo-formulario">
            <label htmlFor="nombre-completo-registro">Nombre Completo</label>
            <div className="contenedor-entrada-icono">
              <User className="icono-entrada-izquierdo" size={18} />
              <input
                id="nombre-completo-registro"
                type="text"
                value={nombre}
                onChange={(e) => establecerNombre(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
              {nombreValido !== null && (
                nombreValido ? (
                  <CheckCircle2 className="icono-validacion-derecho exito" size={18} />
                ) : (
                  <XCircle className="icono-validacion-derecho error" size={18} />
                )
              )}
            </div>
          </div>

          <div className="grupo-formulario">
            <label htmlFor="correo-registro">Correo Electronico</label>
            <div className="contenedor-entrada-icono">
              <Mail className="icono-entrada-izquierdo" size={18} />
              <input
                id="correo-registro"
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
            {correoValido === false && (
              <span className="mensaje-ayuda-entrada error">
                <XCircle size={12} /> Correo no valido
              </span>
            )}
            {correoValido === true && (
              <span className="mensaje-ayuda-entrada exito">
                <CheckCircle2 size={12} /> Correo valido
              </span>
            )}
          </div>

          <div className="grupo-formulario">
            <label htmlFor="contrasenia-registro">Contraseña</label>
            <div className="contenedor-entrada-icono">
              <Lock className="icono-entrada-izquierdo" size={18} />
              <input
                id="contrasenia-registro"
                type="password"
                value={contrasenia}
                onChange={(e) => establecerContrasenia(e.target.value)}
                placeholder="Tu contraseña"
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
            {contraseniaValida === false && (
              <span className="mensaje-ayuda-entrada error">
                <XCircle size={12} /> Minimo 6 caracteres
              </span>
            )}
            {contraseniaValida === true && (
              <span className="mensaje-ayuda-entrada exito">
                <CheckCircle2 size={12} /> Minimo 6 caracteres
              </span>
            )}
          </div>

          <div className="grupo-formulario">
            <label htmlFor="confirmar-contrasenia-registro">Confirmar Contraseña</label>
            <div className="contenedor-entrada-icono">
              <Lock className="icono-entrada-izquierdo" size={18} />
              <input
                id="confirmar-contrasenia-registro"
                type="password"
                value={confirmarContrasenia}
                onChange={(e) => establecerConfirmarContrasenia(e.target.value)}
                placeholder="Repite tu contraseña"
                required
              />
              {confirmacionValida !== null && (
                confirmacionValida ? (
                  <CheckCircle2 className="icono-validacion-derecho exito" size={18} />
                ) : (
                  <XCircle className="icono-validacion-derecho error" size={18} />
                )
              )}
            </div>
            {confirmacionValida === false && (
              <span className="mensaje-ayuda-entrada error">
                <XCircle size={12} /> Las contraseñas no coinciden
              </span>
            )}
            {confirmacionValida === true && (
              <span className="mensaje-ayuda-entrada exito">
                <CheckCircle2 size={12} /> Contraseñas coinciden
              </span>
            )}
          </div>

          <button type="submit" className="boton-primario" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="enlace-autenticacion">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesion aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
