import { useReducer } from 'react';
import Contexto from './Contexto.jsx';
import types from './Types.js';
import MiReducer from './MiReducer.jsx';

const inicio = () => {
    const sesion = localStorage.getItem("usuario"); //estado
    return {
        logeado: !!sesion,
        usuario: sesion 
    }
}

const Provider = ({children}) => {
    const [logeado,dispatch] = useReducer(MiReducer,{},inicio);

    const login = (datos) =>{
        const action = {
            type:types.login,
            usuario: datos
        }
    localStorage.setItem("usuario",JSON.stringify(datos));
    dispatch(action);
    }
    
    const cerrar_sesion = () => {
        const action = {
            type:types.logout,
            usuario: null
        }
        localStorage.removeItem("usuario");
        dispatch(action);
    }
  return (
    <Contexto.Provider value={{...logeado,login,cerrar_sesion}}>
      {children}
    </Contexto.Provider>

  )
}

export default Provider;