import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  LogOut, 
  Check, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { usarAutenticacion } from '../contexto/AutenticacionContexto';
import FormularioTarea from '../componentes/FormularioTarea';

const PanelControl = () => {
  const { usuario, cerrarSesion } = usarAutenticacion();
  const [tareas, establecerTareas] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [errorServidor, establecerErrorServidor] = useState('');
  const [filtro, establecerFiltro] = useState('todas');
  const [mostrarFormulario, establecerMostrarFormulario] = useState(false);
  const [tareaSeleccionada, establecerTareaSeleccionada] = useState(null);
  const [mostrarMenuPerfil, establecerMostrarMenuPerfil] = useState(false);
  const [mostrarMenuMovil, establecerMostrarMenuMovil] = useState(false);

  const cargarTareas = async () => {
    try {
      establecerCargando(true);
      const respuesta = await axios.get('http://localhost:5000/api/tareas');
      establecerTareas(respuesta.data);
      establecerErrorServidor('');
    } catch (errorPeticion) {
      establecerErrorServidor('Error al cargar las tareas del servidor');
    } finally {
      establecerCargando(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const manejarGuardarTarea = async (datosTarea) => {
    try {
      if (tareaSeleccionada) {
        const respuesta = await axios.put(`http://localhost:5000/api/tareas/${tareaSeleccionada._id}`, datosTarea);
        establecerTareas(tareas.map((t) => (t._id === tareaSeleccionada._id ? respuesta.data : t)));
      } else {
        const respuesta = await axios.post('http://localhost:5000/api/tareas', datosTarea);
        establecerTareas([respuesta.data, ...tareas]);
      }
      establecerMostrarFormulario(false);
      establecerTareaSeleccionada(null);
    } catch (errorPeticion) {
      establecerErrorServidor('Error al guardar la tarea');
    }
  };

  const manejarCambiarEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === 'pendiente' ? 'completada' : 'pendiente';
      const respuesta = await axios.put(`http://localhost:5000/api/tareas/${id}`, { estado: nuevoEstado });
      establecerTareas(tareas.map((t) => (t._id === id ? respuesta.data : t)));
    } catch (errorPeticion) {
      establecerErrorServidor('Error al cambiar el estado de la tarea');
    }
  };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tareas/${id}`);
        establecerTareas(tareas.filter((t) => t._id !== id));
      } catch (errorPeticion) {
        establecerErrorServidor('Error al eliminar la tarea');
      }
    }
  };

  const iniciarCreacion = () => {
    establecerTareaSeleccionada(null);
    establecerMostrarFormulario(true);
  };

  const iniciarEdicion = (tarea) => {
    establecerTareaSeleccionada(tarea);
    establecerMostrarFormulario(true);
  };

  const cancelarFormulario = () => {
    establecerMostrarFormulario(false);
    establecerTareaSeleccionada(null);
  };

  const formatearFecha = (fechaCadena) => {
    if (!fechaCadena) return '';
    const partes = fechaCadena.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaCadena;
  };

  const obtenerIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return 'U';
    const partes = nombreCompleto.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombreCompleto[0].toUpperCase();
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'pendientes') return t.estado === 'pendiente';
    if (filtro === 'completadas') return t.estado === 'completada';
    return true;
  });

  return (
    <div className="contenedor-panel">
      <header className="cabecera-panel">
        <div className="logotipo-contenedor">
          <div className="logotipo-icono-caja">
            <Check className="logotipo-icono" size={20} />
          </div>
          <span className="logotipo-texto">TaskMaster <span className="logotipo-texto-resaltado">Dark</span></span>
        </div>

        <div className="seccion-usuario-escritorio">
          <div className="menu-usuario-contenedor">
            <button 
              className="boton-usuario-perfil" 
              onClick={() => establecerMostrarMenuPerfil(!mostrarMenuPerfil)}
            >
              <div className="usuario-avatar">
                {obtenerIniciales(usuario?.nombre)}
              </div>
              <div className="usuario-detalles">
                <span className="usuario-nombre">{usuario?.nombre || 'Usuario'}</span>
                <span className="usuario-correo">{usuario?.email || 'correo@ejemplo.com'}</span>
              </div>
              <ChevronDown size={16} className={`icono-chevron-usuario ${mostrarMenuPerfil ? 'rotado' : ''}`} />
            </button>

            {mostrarMenuPerfil && (
              <div className="menu-desplegable-perfil">
                <button 
                  className="elemento-menu-desplegable cerrar-sesion" 
                  onClick={() => {
                    establecerMostrarMenuPerfil(false);
                    cerrarSesion();
                  }}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesion</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className="boton-menu-movil" 
          onClick={() => establecerMostrarMenuMovil(!mostrarMenuMovil)}
        >
          {mostrarMenuMovil ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mostrarMenuMovil && (
          <div className="menu-movil-drawer">
            <div className="menu-movil-drawer-overlay" onClick={() => establecerMostrarMenuMovil(false)} />
            <div className="menu-movil-drawer-contenido">
              <div className="menu-movil-drawer-cabecera">
                <span className="menu-movil-drawer-titulo">Usuario</span>
                <button className="boton-cerrar-drawer" onClick={() => establecerMostrarMenuMovil(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="menu-movil-drawer-usuario-info">
                <div className="usuario-avatar-grande">
                  {obtenerIniciales(usuario?.nombre)}
                </div>
                <span className="usuario-nombre-grande">{usuario?.nombre || 'Usuario'}</span>
                <span className="usuario-correo-grande">{usuario?.email || 'correo@ejemplo.com'}</span>
              </div>
              <div className="menu-movil-drawer-acciones">
                <button 
                  className="boton-cerrar-sesion-movil" 
                  onClick={() => {
                    establecerMostrarMenuMovil(false);
                    cerrarSesion();
                  }}
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {errorServidor && <div className="alerta-error">{errorServidor}</div>}

      <div className="barra-acciones">
        <div className="seccion-titulo-panel">
          <h2>Mis Tareas</h2>
        </div>

        {!mostrarFormulario && (
          <button onClick={iniciarCreacion} className="boton-nueva-tarea">
            <Plus size={16} />
            <span>Nueva Tarea</span>
          </button>
        )}
      </div>

      <div className="filtros-estado-tarjeta">
        <button
          onClick={() => establecerFiltro('todas')}
          className={`boton-filtro-pestania ${filtro === 'todas' ? 'activo' : ''}`}
        >
          <LayoutGrid size={18} />
          <span>Todas</span>
        </button>
        <button
          onClick={() => establecerFiltro('pendientes')}
          className={`boton-filtro-pestania ${filtro === 'pendientes' ? 'activo' : ''}`}
        >
          <Clock size={18} />
          <span>Pendientes</span>
        </button>
        <button
          onClick={() => establecerFiltro('completadas')}
          className={`boton-filtro-pestania ${filtro === 'completadas' ? 'activo' : ''}`}
        >
          <CheckCircle2 size={18} />
          <span>Completadas</span>
        </button>
      </div>

      {cargando ? (
        <div className="cargando-contenedor">
          <p>Cargando tus tareas...</p>
        </div>
      ) : (
        <div className="seccion-principal-panel">
          <div className="lista-tareas">
            {tareasFiltradas.length === 0 ? (
              <div className="sin-tareas">
                <p>No hay tareas disponibles en esta categoria.</p>
              </div>
            ) : (
              tareasFiltradas.map((tarea) => (
                <div key={tarea._id} className={`tarjeta-tarea-premium ${tarea.estado} prioridad-${tarea.prioridad?.toLowerCase() || 'media'}`}>
                  <div className="cuerpo-tarjeta-tarea">
                    <button 
                      type="button" 
                      className={`casilla-verificacion-personalizada ${tarea.estado === 'completada' ? 'marcada' : ''}`}
                      onClick={() => manejarCambiarEstado(tarea._id, tarea.estado)}
                    >
                      {tarea.estado === 'completada' && <Check size={14} />}
                    </button>

                    <div className="detalles-tarjeta-tarea">
                      <h4 className="titulo-tarjeta-tarea">
                        {tarea.titulo}
                      </h4>
                      {tarea.descripcion && (
                        <p className="descripcion-tarjeta-tarea">
                          {tarea.descripcion}
                        </p>
                      )}
                      
                      <div className="etiquetas-y-fecha">
                        <div className="grupo-etiquetas-tarea">
                          <span className={`etiqueta-tarea prioridad-${tarea.prioridad?.toLowerCase() || 'media'}`}>
                            {tarea.prioridad || 'Media'}
                          </span>
                          <span className={`etiqueta-tarea categoria-${tarea.categoria?.toLowerCase() || 'hogar'}`}>
                            {tarea.categoria || 'Hogar'}
                          </span>
                        </div>

                        {tarea.fechaLimite && (
                          <div className="fecha-limite-tarea-contenedor">
                            <Calendar size={14} className="icono-calendario-tarea" />
                            <span>Fecha limite: {formatearFecha(tarea.fechaLimite)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="acciones-tarjeta-tarea">
                    <button
                      onClick={() => iniciarEdicion(tarea)}
                      className="boton-accion-tarea editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => manejarEliminar(tarea._id)}
                      className="boton-accion-tarea eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {mostrarFormulario && (
            <div className="modal-formulario-contenedor">
              <div className="modal-formulario-contenido">
                <FormularioTarea
                  tareaEditar={tareaSeleccionada}
                  alGuardar={manejarGuardarTarea}
                  alCancelar={cancelarFormulario}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelControl;
