import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AutenticacionContexto = createContext();

export const AutenticacionProveedor = ({ children }) => {
  const [usuario, establecerUsuario] = useState(null);
  const [tokenActual, establecerTokenActual] = useState(localStorage.getItem('token') || null);
  const [cargando, establecerCargando] = useState(true);

  useEffect(() => {
    if (tokenActual) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenActual}`;
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        establecerUsuario(JSON.parse(usuarioGuardado));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      establecerUsuario(null);
    }
    establecerCargando(false);
  }, [tokenActual]);

  const iniciarSesion = async (email, password) => {
    const respuesta = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, usuario: datosUsuario } = respuesta.data;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    establecerTokenActual(token);
    establecerUsuario(datosUsuario);
    return datosUsuario;
  };

  const registrarUsuario = async (nombre, email, password) => {
    await axios.post('http://localhost:5000/api/auth/registro', { nombre, email, password });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    establecerTokenActual(null);
    establecerUsuario(null);
  };

  const valor = {
    usuario,
    tokenActual,
    cargando,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion
  };

  return (
    <AutenticacionContexto.Provider value={valor}>
      {!cargando && children}
    </AutenticacionContexto.Provider>
  );
};

export const usarAutenticacion = () => {
  return useContext(AutenticacionContexto);
};
