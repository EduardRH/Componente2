import { Navigate } from 'react-router-dom';
import { usarAutenticacion } from '../contexto/AutenticacionContexto';

const RutaPrivada = ({ children }) => {
  const { usuario } = usarAutenticacion();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaPrivada;
