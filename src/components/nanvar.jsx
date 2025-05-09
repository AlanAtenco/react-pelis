import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaFilm,
  FaSignOutAlt,
} from "react-icons/fa";
import "../assets/style/Nav.css";
import { useContext } from "react";
import Contexto from "../context/Contexto";

const Nav = () => {
  const { cerrar_sesion, logeado } = useContext(Contexto);
  const navegacion = useNavigate();

  const finalizarSesion = () => {
    cerrar_sesion();
    navegacion("/login", { replace: true });
  };

  return (
    <div className="navbar">
      <div className="logo">
        <FaFilm className="logo-icon" />
        <span className="logo-text">PipuPelis</span>
      </div>

      <div className="nav-links">
        {logeado ? (
          <>
            <NavLink to="/inicio" className="nav-item">
              <FaHome className="icon" /> Inicio
            </NavLink>
            <NavLink to="/caricatura" className="nav-item">
              <FaUserPlus className="icon" /> Caricatura
            </NavLink>
            <NavLink to="/estreno" className="nav-item">
              <FaUserPlus className="icon" /> Estreno
            </NavLink>
            <NavLink to="/terror" className="nav-item">
              <FaUserPlus className="icon" /> Terror
            </NavLink>

            {/* Botón estático para cerrar sesión */}
            <button className="nav-item logout-btn" onClick={finalizarSesion}>
              <FaSignOutAlt className="icon" /> Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-item">
              <FaSignInAlt className="icon" /> Login
            </NavLink>
            <NavLink to="/registro" className="nav-item">
              <FaUserPlus className="icon" /> Registro
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
