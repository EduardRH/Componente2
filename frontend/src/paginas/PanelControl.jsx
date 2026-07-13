import { useState, useEffect, useMemo } from 'react';
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
  X,
  Search,
  ArrowUpDown,
  BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [mostrarModalEliminar, establecerMostrarModalEliminar] = useState(false);
  const [tareaSeleccionadaEliminar, establecerTareaSeleccionadaEliminar] = useState(null);
  const [terminoBusqueda, establecerTerminoBusqueda] = useState('');
  const [ordenarPorFecha, establecerOrdenarPorFecha] = useState(false);
  const [mostrarEstadisticas, establecerMostrarEstadisticas] = useState(false);

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

  const manejarEliminar = (tarea) => {
    establecerTareaSeleccionadaEliminar(tarea);
    establecerMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    if (tareaSeleccionadaEliminar) {
      try {
        await axios.delete(`http://localhost:5000/api/tareas/${tareaSeleccionadaEliminar._id}`);
        establecerTareas(tareas.filter((t) => t._id !== tareaSeleccionadaEliminar._id));
        establecerMostrarModalEliminar(false);
        establecerTareaSeleccionadaEliminar(null);
      } catch (errorPeticion) {
        establecerErrorServidor('Error al eliminar la tarea');
      }
    }
  };

  const cancelarEliminacion = () => {
    establecerMostrarModalEliminar(false);
    establecerTareaSeleccionadaEliminar(null);
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

  const estadisticasProgreso = useMemo(() => {
    const total = tareas.length;
    const completadas = tareas.filter((t) => t.estado === 'completada').length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, completadas, porcentaje };
  }, [tareas]);

  const datosGrafico = useMemo(() => {
    const ultimos7Dias = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      const fechaFormateada = dia.toISOString().split('T')[0];
      const etiquetaDia = dia.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
      
      let creadas = 0;
      let completadas = 0;
      
      tareas.forEach((tarea) => {
        if (tarea.createdAt) {
          const fechaCreacion = tarea.createdAt.split('T')[0];
          if (fechaCreacion === fechaFormateada) {
            creadas++;
          }
        }
        if (tarea.estado === 'completada' && tarea.updatedAt) {
          const fechaActualizacion = tarea.updatedAt.split('T')[0];
          if (fechaActualizacion === fechaFormateada) {
            completadas++;
          }
        }
      });

      ultimos7Dias.push({
        dia: etiquetaDia,
        Añadidas: creadas,
        Completadas: completadas
      });
    }
    return ultimos7Dias;
  }, [tareas]);

  const tareasFiltradas = useMemo(() => {
    let resultado = tareas.filter((tarea) => {
      const coincideFiltro =
        filtro === 'todas' ||
        (filtro === 'pendientes' && tarea.estado === 'pendiente') ||
        (filtro === 'completadas' && tarea.estado === 'completada');

      const coincideBusqueda =
        !terminoBusqueda ||
        tarea.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        (tarea.descripcion && tarea.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()));

      return coincideFiltro && coincideBusqueda;
    });

    if (ordenarPorFecha) {
      resultado.sort((a, b) => {
        if (!a.fechaLimite) return 1;
        if (!b.fechaLimite) return -1;
        return new Date(a.fechaLimite) - new Date(b.fechaLimite);
      });
    }

    return resultado;
  }, [tareas, filtro, terminoBusqueda, ordenarPorFecha]);

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

      <div className="contenedor-progreso-dinamico">
        <div className="fila-progreso-cabecera">
          <div className="texto-progreso-dinamico">
            Progreso: {estadisticasProgreso.completadas} de {estadisticasProgreso.total} tareas completadas ({estadisticasProgreso.porcentaje}%)
          </div>
          <button
            type="button"
            onClick={() => establecerMostrarEstadisticas(!mostrarEstadisticas)}
            className={`boton-ver-actividad ${mostrarEstadisticas ? 'activo' : ''}`}
          >
            <BarChart2 size={16} />
            <span>Ver Actividad</span>
          </button>
        </div>
        <div className="barra-progreso-dinamico-fondo">
          <div
            className="barra-progreso-dinamico-relleno"
            style={{ width: `${estadisticasProgreso.porcentaje}%` }}
          />
        </div>
      </div>

      {mostrarEstadisticas && (
        <div className="contenedor-grafico-actividad">
          <h3 className="titulo-grafico-actividad">Actividad de los ultimos 7 dias</h3>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis 
                  dataKey="dia" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#141b2f', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '0.5rem',
                    color: '#f8fafc' 
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Legend 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                />
                <Bar 
                  dataKey="Añadidas" 
                  fill="var(--color-acento-cian)" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="Completadas" 
                  fill="var(--color-acento-morado)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="contenedor-barra-filtros">
        <div className="filtros-estado-tarjeta">
          <button
            type="button"
            onClick={() => establecerFiltro('todas')}
            className={`boton-filtro-pestania ${filtro === 'todas' ? 'activo' : ''}`}
          >
            <LayoutGrid size={18} />
            <span>Todas</span>
          </button>
          <button
            type="button"
            onClick={() => establecerFiltro('pendientes')}
            className={`boton-filtro-pestania ${filtro === 'pendientes' ? 'activo' : ''}`}
          >
            <Clock size={18} />
            <span>Pendientes</span>
          </button>
          <button
            type="button"
            onClick={() => establecerFiltro('completadas')}
            className={`boton-filtro-pestania ${filtro === 'completadas' ? 'activo' : ''}`}
          >
            <CheckCircle2 size={18} />
            <span>Completadas</span>
          </button>
        </div>

        <div className="seccion-busqueda-ordenar">
          <div className="entrada-busqueda-contenedor">
            <Search size={18} className="icono-busqueda-lupa" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={terminoBusqueda}
              onChange={(e) => establecerTerminoBusqueda(e.target.value)}
              className="entrada-busqueda-rapida"
            />
          </div>

          <button
            type="button"
            onClick={() => establecerOrdenarPorFecha(!ordenarPorFecha)}
            className={`boton-ordenamiento-fecha ${ordenarPorFecha ? 'activo' : ''}`}
            title="Ordenar por fecha limite (mas urgentes primero)"
          >
            <ArrowUpDown size={18} />
          </button>
        </div>
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
                      onClick={() => manejarEliminar(tarea)}
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

          {mostrarModalEliminar && (
            <div className="modal-confirmacion-contenedor">
              <div className="modal-confirmacion-overlay" onClick={cancelarEliminacion} />
              <div className="modal-confirmacion-contenido">
                <h3>¿Eliminar esta tarea?</h3>
                <p>
                  Se eliminará «{tareaSeleccionadaEliminar?.titulo}».
                </p>
                <div className="acciones-modal-confirmacion">
                  <button onClick={cancelarEliminacion} className="boton-confirmacion-cancelar">
                    Cancelar
                  </button>
                  <button onClick={confirmarEliminacion} className="boton-confirmacion-eliminar">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelControl;
