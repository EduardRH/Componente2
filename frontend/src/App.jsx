import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AutenticacionProveedor } from './contexto/AutenticacionContexto';
import RutaPrivada from './componentes/RutaPrivada';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import PanelControl from './paginas/PanelControl';

const App = () => {
  return (
    <AutenticacionProveedor>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RutaPrivada>
                <PanelControl />
              </RutaPrivada>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AutenticacionProveedor>
  );
};

export default App;
