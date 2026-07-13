import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { usarAutenticacion } from "../contexto/AutenticacionContexto";

const PantallaAcceso = () => {
  const [correo, establecerCorreo] = useState("");
  const [contrasenia, establecerContrasenia] = useState("");
  const [mostrarContrasenia, establecerMostrarContrasenia] = useState(false);
  const [mensajeError, establecerMensajeError] = useState("");
  const [cargando, establecerCargando] = useState(false);

  const { iniciarSesion } = usarAutenticacion();
  const navegar = useNavigate();

  const alternarVisibilidadContrasena = () => {
    establecerMostrarContrasenia(!mostrarContrasenia);
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!correo || !contrasenia) {
      establecerMensajeError("El correo y la contraseña son obligatorios");
      return;
    }
    try {
      establecerMensajeError("");
      establecerCargando(true);
      await iniciarSesion(correo, contrasenia);
      navegar("/");
    } catch (errorPeticion) {
      establecerMensajeError(
        errorPeticion.response?.data?.mensaje ||
          "Credenciales incorrectas o error de conexion",
      );
    } finally {
      establecerCargando(false);
    }
  };

  return (
    <div className="pantalla-acceso-contenedor">
      <div className="panel-informativo-izquierdo">
        <div className="indicador-superior-panel">
          <span className="punto-indicador"></span>
          <span>SISTEMA DE TAREAS • 2026</span>
        </div>
        <div className="contenido-principal-panel">
          <span className="categoria-titulo-panel">TaskMaster Dark</span>
          <h1>Ordena tu día, sin ruido.</h1>
          <p>
            Un panel único para crear, priorizar y completar tareas. Rápido,
            claro y directo.
          </p>
        </div>
        <div className="tarjetas-metricas-panel">
          <div className="tarjeta-metrica-item">
            <h3>100%</h3>
            <span>ENFOQUE</span>
          </div>
          <div className="tarjeta-metrica-item">
            <h3>3</h3>
            <span>CATEGORÍAS</span>
          </div>
          <div className="tarjeta-metrica-item">
            <h3>0</h3>
            <span>DISTRACCIÓN</span>
          </div>
        </div>
      </div>

      <div className="formulario-acceso-derecho">
        <div className="contenido-formulario-acceso">
          <div className="cabecera-formulario-acceso">
            <h2>Inicia sesión</h2>
            <p>Entra a tu panel para gestionar tus tareas.</p>
          </div>

          {mensajeError && <div className="alerta-error">{mensajeError}</div>}

          <form onSubmit={manejarEnvio} noValidate>
            <div className="campo-acceso-grupo">
              <label htmlFor="correo-acceso">CORREO</label>
              <input
                id="correo-acceso"
                type="email"
                value={correo}
                onChange={(e) => establecerCorreo(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div className="campo-acceso-grupo">
              <label htmlFor="contrasenia-acceso">CONTRASEÑA</label>
              <div className="contenedor-entrada-password">
                <input
                  id="contrasenia-acceso"
                  type={mostrarContrasenia ? "text" : "password"}
                  value={contrasenia}
                  onChange={(e) => establecerContrasenia(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={alternarVisibilidadContrasena}
                  className="boton-toggle-visibilidad"
                >
                  {mostrarContrasenia ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="boton-acceder-envio"
              disabled={cargando}
            >
              <span>{cargando ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="enlace-cambio-registro">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PantallaAcceso;
