import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import { usarAutenticacion } from "../contexto/AutenticacionContexto";

const PantallaRegistro = () => {
  const [datosFormulario, establecerDatosFormulario] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [erroresValidacion, establecerErroresValidacion] = useState({
    nombre: null,
    correo: null,
    contrasenia: null,
    confirmarContrasenia: null,
  });

  const [mostrarContrasenia, establecerMostrarContrasenia] = useState(false);
  const [mensajeError, establecerMensajeError] = useState("");
  const [mensajeExito, establecerMensajeExito] = useState("");
  const [cargando, establecerCargando] = useState(false);

  const { registrarUsuario } = usarAutenticacion();
  const navegar = useNavigate();

  const alternarVisibilidadContrasena = () => {
    establecerMostrarContrasenia(!mostrarContrasenia);
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    const nuevosDatos = { ...datosFormulario, [name]: value };
    establecerDatosFormulario(nuevosDatos);

    const nuevosErrores = { ...erroresValidacion };
    if (name === "nombre") {
      nuevosErrores.nombre = value.trim().length >= 3;
    } else if (name === "correo") {
      const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      nuevosErrores.correo = patronCorreo.test(value);
    } else if (name === "contrasenia") {
      nuevosErrores.contrasenia = value.length >= 6;
      if (nuevosDatos.confirmarContrasenia) {
        nuevosErrores.confirmarContrasenia =
          value === nuevosDatos.confirmarContrasenia;
      }
    } else if (name === "confirmarContrasenia") {
      nuevosErrores.confirmarContrasenia =
        value === nuevosDatos.contrasenia &&
        nuevosDatos.contrasenia.length >= 6;
    }
    establecerErroresValidacion(nuevosErrores);
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    const { nombre, correo, contrasenia, confirmarContrasenia } =
      datosFormulario;

    if (!nombre || !correo || !contrasenia || !confirmarContrasenia) {
      establecerMensajeError("Todos los campos son obligatorios");
      return;
    }
    if (contrasenia !== confirmarContrasenia) {
      establecerMensajeError("Las contraseñas no coinciden");
      return;
    }
    if (contrasenia.length < 6) {
      establecerMensajeError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      establecerMensajeError("");
      establecerMensajeExito("");
      establecerCargando(true);
      await registrarUsuario(nombre, correo, contrasenia);
      establecerMensajeExito(
        "Registro exitoso. Redirigiendo al inicio de sesion...",
      );
      setTimeout(() => {
        navegar("/login");
      }, 2000);
    } catch (errorPeticion) {
      establecerMensajeError(
        errorPeticion.response?.data?.mensaje ||
          "Error al intentar registrarse",
      );
      establecerCargando(false);
    }
  };

  const obtenerClaseInput = (campo) => {
    const estado = erroresValidacion[campo];
    if (estado === null) return "";
    return estado ? "campo-valido" : "campo-invalido";
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
            <h2>Crea tu cuenta</h2>
            <p>Organiza tu día en menos de un minuto.</p>
          </div>

          {mensajeError && <div className="alerta-error">{mensajeError}</div>}
          {mensajeExito && <div className="alerta-exito">{mensajeExito}</div>}

          <form onSubmit={manejarEnvio} noValidate>
            <div className="campo-acceso-grupo">
              <label htmlFor="nombre-registro">NOMBRE COMPLETO</label>
              <div className="contenedor-input-validador">
                <input
                  id="nombre-registro"
                  type="text"
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Ana López"
                  className={obtenerClaseInput("nombre")}
                  required
                />
                {erroresValidacion.nombre !== null && (
                  <span className="icono-validador-flotante">
                    {erroresValidacion.nombre ? (
                      <Check className="exito" size={16} />
                    ) : (
                      <X className="error" size={16} />
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="campo-acceso-grupo">
              <label htmlFor="correo-registro">CORREO</label>
              <div className="contenedor-input-validador">
                <input
                  id="correo-registro"
                  type="email"
                  name="correo"
                  value={datosFormulario.correo}
                  onChange={manejarCambio}
                  placeholder="tu@correo.com"
                  className={obtenerClaseInput("correo")}
                  required
                />
                {erroresValidacion.correo !== null && (
                  <span className="icono-validador-flotante">
                    {erroresValidacion.correo ? (
                      <Check className="exito" size={16} />
                    ) : (
                      <X className="error" size={16} />
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="fila-campos-doble">
              <div className="campo-acceso-grupo col-50">
                <label htmlFor="contrasenia-registro">CONTRASEÑA</label>
                <div className="contenedor-input-validador">
                  <input
                    id="contrasenia-registro"
                    type={mostrarContrasenia ? "text" : "password"}
                    name="contrasenia"
                    value={datosFormulario.contrasenia}
                    onChange={manejarCambio}
                    placeholder="6+ caracteres"
                    className={obtenerClaseInput("contrasenia")}
                    required
                  />
                  {erroresValidacion.contrasenia !== null && (
                    <span className="icono-validador-flotante con-toggle">
                      {erroresValidacion.contrasenia ? (
                        <Check className="exito" size={16} />
                      ) : (
                        <X className="error" size={16} />
                      )}
                    </span>
                  )}
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

              <div className="campo-acceso-grupo col-50">
                <label htmlFor="confirmar-registro">CONFIRMAR</label>
                <div className="contenedor-input-validador">
                  <input
                    id="confirmar-registro"
                    type={mostrarContrasenia ? "text" : "password"}
                    name="confirmarContrasenia"
                    value={datosFormulario.confirmarContrasenia}
                    onChange={manejarCambio}
                    placeholder="Repite"
                    className={obtenerClaseInput("confirmarContrasenia")}
                    required
                  />
                  {erroresValidacion.confirmarContrasenia !== null && (
                    <span className="icono-validador-flotante con-toggle">
                      {erroresValidacion.confirmarContrasenia ? (
                        <Check className="exito" size={16} />
                      ) : (
                        <X className="error" size={16} />
                      )}
                    </span>
                  )}
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
            </div>

            <button
              type="submit"
              className="boton-acceder-envio"
              disabled={cargando}
            >
              <span>{cargando ? "CREANDO CUENTA..." : "CREAR CUENTA"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="enlace-cambio-registro">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PantallaRegistro;
