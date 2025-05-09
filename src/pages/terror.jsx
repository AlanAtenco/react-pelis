import React, { useState, useEffect,useContext } from "react";
import Contexto from "../context/Contexto";

const Terror = () => {
    const [terror, setTerror] = useState([]);
    const [pelicula, setPelicula] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [editando, setEditando] = useState(null);
    const {usuario} =useContext (Contexto)

    const URL = "http://localhost:3001/terror"; // Ruta para Terror

    useEffect(() => {
        obtenerTerror();
    }, []);

    const obtenerTerror = async () => {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            if (res.ok) {
                setTerror(data);
            } else {
                console.error("Error al obtener películas de terror:", data);
            }
        } catch (error) {
            console.error("Error al obtener películas de terror:", error);
        }
    };

    const agregarTerror = async () => {
        if (!pelicula || !descripcion || !fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Convertir la fecha a formato adecuado
        const fechaFormateada = formatearFechaGuardado(fecha);

        const nuevaTerror = { pelicula, descripcion, fecha: fechaFormateada };

        try {
            const res = await fetch(`${URL}/insercion`, {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "Autorizacion" : "Back " + usuario
                     },
                body: JSON.stringify(nuevaTerror),
            });

            const data = await res.json();
            if (res.ok) {
                obtenerTerror();
                limpiarFormulario();
            } else {
                console.error("Error al agregar película de terror:", data);
            }
        } catch (error) {
            console.error("Error al agregar película de terror:", error);
        }
    };

    const eliminarTerror = async (_id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return;

        try {
            const res = await fetch(`${URL}/eliminar/${_id}`, {
                method: "DELETE",
                headers: { 
                    "Autorizacion" : "Back " + usuario }
            });

            if (res.ok) {
                obtenerTerror();
            } else {
                console.error("Error al eliminar película de terror");
            }
        } catch (error) {
            console.error("Error al eliminar película de terror:", error);
        }
    };

    const cargarParaEditar = (item) => {
        setEditando(item._id);
        setPelicula(item.pelicula);
        setDescripcion(item.descripcion);
        setFecha(formatearFechaInput(item.fecha)); // Convierte a formato YYYY-MM-DD
    };

    const editarTerror = async () => {
        if (!pelicula || !descripcion || !fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const fechaFormateada = formatearFechaGuardado(fecha);

        const terrorActualizado = { pelicula, descripcion, fecha: fechaFormateada };

        try {
            const res = await fetch(`${URL}/actualizar/${editando}`, {
                method: "PUT",
                headers: { 
                    "Autorizacion" : "Back " + usuario,
                    "Content-Type": "application/json" },
                body: JSON.stringify(terrorActualizado),
            });

            const data = await res.json();
            if (res.ok) {
                obtenerTerror();
                limpiarFormulario();
            } else {
                console.error("Error al actualizar película de terror:", data);
            }
        } catch (error) {
            console.error("Error al actualizar película de terror:", error);
        }
    };

    const limpiarFormulario = () => {
        setPelicula("");
        setDescripcion("");
        setFecha("");
        setEditando(null);
    };

    // 🔁 Convierte "25-febrero-2002" a "2002-02-25"
    const formatearFechaInput = (fechaTexto) => {
        const [dia, mesTexto, anio] = fechaTexto.split("-");
        const meses = {
            enero: "01", febrero: "02", marzo: "03", abril: "04",
            mayo: "05", junio: "06", julio: "07", agosto: "08",
            septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
        };
        return `${anio}-${meses[mesTexto.toLowerCase()]}-${dia.padStart(2, "0")}`;
    };

    // 🔁 Convierte "YYYY-MM-DD" a "DD-mes-YYYY"
    const formatearFechaGuardado = (fechaISO) => {
        const [anio, mes, dia] = fechaISO.split("-");
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        return `${dia}-${meses[parseInt(mes, 10) - 1]}-${anio}`;
    };

    return (
        <div className="container">
            <h2>{editando ? "Editar Película de Terror" : "Agregar Nueva Película de Terror"}</h2>
            <input
                type="text"
                placeholder="Película"
                value={pelicula}
                onChange={(e) => setPelicula(e.target.value)}
            />
            <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />
            <button onClick={editando ? editarTerror : agregarTerror}>
                {editando ? "Guardar Cambios" : "Agregar"}
            </button>
            {editando && <button onClick={limpiarFormulario}>Cancelar</button>}

            <div className="contentPistas">
                <ul>
                    {terror.map((item) => (
                        <li key={item._id}>
                            <h3>{item.pelicula}</h3>
                            <p>{item.descripcion}</p>
                            <small>{item.fecha}</small>
                            <div>
                                <button onClick={() => cargarParaEditar(item)}>Editar</button>
                                <button onClick={() => eliminarTerror(item._id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Terror;
