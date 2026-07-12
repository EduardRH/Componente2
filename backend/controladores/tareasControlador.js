import Tarea from '../modelos/Tarea.js';

export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuarioId: req.usuarioId });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las tareas.', error: error.message });
  }
};

export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, categoria, fechaLimite } = req.body;
    if (!titulo) {
      return res.status(400).json({ mensaje: 'El titulo de la tarea es obligatorio.' });
    }
    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      prioridad: prioridad || 'Media',
      categoria: categoria || 'Hogar',
      fechaLimite,
      usuarioId: req.usuarioId
    });
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la tarea.', error: error.message });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, categoria, fechaLimite } = req.body;
    const tarea = await Tarea.findOne({ _id: id, usuarioId: req.usuarioId });
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada o sin autorizacion.' });
    }
    if (titulo !== undefined) tarea.titulo = titulo;
    if (descripcion !== undefined) tarea.descripcion = descripcion;
    if (estado !== undefined) {
      if (['pendiente', 'completada'].includes(estado)) {
        tarea.estado = estado;
      } else {
        return res.status(400).json({ mensaje: 'Estado invalido.' });
      }
    }
    if (prioridad !== undefined) {
      if (['Alta', 'Media', 'Baja'].includes(prioridad)) {
        tarea.prioridad = prioridad;
      } else {
        return res.status(400).json({ mensaje: 'Prioridad invalida.' });
      }
    }
    if (categoria !== undefined) {
      if (['Trabajo', 'Hogar', 'Personal'].includes(categoria)) {
        tarea.categoria = categoria;
      } else {
        return res.status(400).json({ mensaje: 'Categoria invalida.' });
      }
    }
    if (fechaLimite !== undefined) tarea.fechaLimite = fechaLimite;
    const tareaActualizada = await tarea.save();
    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la tarea.', error: error.message });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Tarea.deleteOne({ _id: id, usuarioId: req.usuarioId });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada o sin autorizacion.' });
    }
    res.status(200).json({ mensaje: 'Tarea eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la tarea.', error: error.message });
  }
};
