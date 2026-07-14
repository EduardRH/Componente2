import { useState, useEffect } from 'react';
import { Calendar, Tag, AlertTriangle } from 'lucide-react';

const FormularioTarea = ({ tareaEditar, alGuardar, alCancelar }) => {
  const [titulo, establecerTitulo] = useState('');
  const [descripcion, establecerDescripcion] = useState('');
  const [prioridad, establecerPrioridad] = useState('Media');
  const [categoria, establecerCategoria] = useState('Hogar');
  const [fechaLimite, establecerFechaLimite] = useState('');
  const [errorValidacion, establecerErrorValidacion] = useState('');

  useEffect(() => {
    if (tareaEditar) {
      establecerTitulo(tareaEditar.titulo);
      establecerDescripcion(tareaEditar.descripcion || '');
      establecerPrioridad(tareaEditar.prioridad || 'Media');
      establecerCategoria(tareaEditar.categoria || 'Hogar');
      establecerFechaLimite(tareaEditar.fechaLimite || '');
    } else {
      establecerTitulo('');
      establecerDescripcion('');
      establecerPrioridad('Media');
      establecerCategoria('Hogar');
      establecerFechaLimite('');
    }
  }, [tareaEditar]);

  const obtenerFechaActualLocal = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    if (!titulo.trim()) {
      establecerErrorValidacion('El titulo es obligatorio');
      return;
    }
    if (fechaLimite) {
      const fechaActualLocal = obtenerFechaActualLocal();
      if (fechaLimite < fechaActualLocal) {
        establecerErrorValidacion('La fecha no puede ser anterior a hoy');
        return;
      }
    }
    establecerErrorValidacion('');
    alGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      prioridad,
      categoria,
      fechaLimite
    });
  };

  return (
    <form onSubmit={manejarEnvio} className="formulario-tarea" noValidate>
      <h3>{tareaEditar ? 'Editar Tarea' : 'Nueva Tarea'}</h3>

      {errorValidacion && <div className="alerta-error">{errorValidacion}</div>}

      <div className="grupo-formulario">
        <label htmlFor="titulo-tarea">Titulo</label>
        <input
          id="titulo-tarea"
          type="text"
          value={titulo}
          onChange={(e) => establecerTitulo(e.target.value)}
          placeholder="Escribe el titulo de la tarea"
          required
        />
      </div>

      <div className="grupo-formulario">
        <label htmlFor="descripcion-tarea">Descripcion</label>
        <textarea
          id="descripcion-tarea"
          value={descripcion}
          onChange={(e) => establecerDescripcion(e.target.value)}
          placeholder="Escribe la descripcion de la tarea"
          rows="3"
        />
      </div>

      <div className="grupo-formulario">
        <label>Prioridad</label>
        <div className="selector-botones">
          {['Baja', 'Media', 'Alta'].map((p) => (
            <button
              key={p}
              type="button"
              className={`boton-seleccion prioridad-${p.toLowerCase()} ${prioridad === p ? 'activo' : ''}`}
              onClick={() => establecerPrioridad(p)}
            >
              <AlertTriangle size={14} className="icono-boton-seleccion" />
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo-formulario">
        <label>Categoria</label>
        <div className="selector-botones">
          {['Trabajo', 'Hogar', 'Personal'].map((c) => (
            <button
              key={c}
              type="button"
              className={`boton-seleccion categoria-${c.toLowerCase()} ${categoria === c ? 'activo' : ''}`}
              onClick={() => establecerCategoria(c)}
            >
              <Tag size={14} className="icono-boton-seleccion" />
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grupo-formulario">
        <label htmlFor="fecha-limite-tarea">Fecha Limite</label>
        <div className="contenedor-entrada-icono">
          <Calendar className="icono-entrada-izquierdo" size={18} />
          <input
            id="fecha-limite-tarea"
            type="date"
            value={fechaLimite}
            onChange={(e) => establecerFechaLimite(e.target.value)}
            min={obtenerFechaActualLocal()}
          />
        </div>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-guardar">
          Guardar
        </button>
        <button type="button" onClick={alCancelar} className="boton-cancelar">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioTarea;
