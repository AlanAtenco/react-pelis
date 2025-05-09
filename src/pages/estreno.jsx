import React, { useState, useEffect,useContext } from "react";
import Contexto from "../context/Contexto";

const Estreno = () => {
    const [estrenos, setEstrenos] = useState([]);
    const [pelicula, setPelicula] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [editando, setEditando] = useState(null);
    const {usuario} = useContext (Contexto)

    const URL = "http://localhost:3001/estreno";

    useEffect(() => {
        obtenerEstrenos();
    }, []);

    const obtenerEstrenos = async () => {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            setEstrenos(data);
        } catch (error) {
            console.error("Error al obtener estrenos:", error);
        }
    };

    const agregarEstreno = async () => {
        if (!pelicula || !descripcion || !fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Convertimos fecha "YYYY-MM-DD" a "DD-mes-YYYY"
        const fechaFormateada = formatearFechaGuardado(fecha);

        const nuevoEstreno = { pelicula, descripcion, fecha: fechaFormateada };

        try {
            await fetch(`${URL}/insercion`, {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "Autorizacion" : "Back " + usuario
                    },
                body: JSON.stringify(nuevoEstreno),
            });

            obtenerEstrenos();
            limpiarFormulario();
        } catch (error) {
            console.error("Error al agregar estreno:", error);
        }
    };

    const eliminarEstreno = async (_id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return;

        try {
            await fetch(`${URL}/eliminar/${_id}`, {
                method: "DELETE",
                headers: { 
                    "Autorizacion" : "Back " + usuario }
            });

            obtenerEstrenos();
        } catch (error) {
            console.error("Error al eliminar estreno:", error);
        }
    };

    const cargarParaEditar = (item) => {
        setEditando(item._id);
        setPelicula(item.pelicula);
        setDescripcion(item.descripcion);
        setFecha(formatearFechaInput(item.fecha)); // Convierte a formato YYYY-MM-DD
    };

    const editarEstreno = async () => {
        if (!pelicula || !descripcion || !fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const fechaFormateada = formatearFechaGuardado(fecha);

        const estrenoActualizado = { pelicula, descripcion, fecha: fechaFormateada };

        try {
            await fetch(`${URL}/actualizar/${editando}`, {
                method: "PUT",
                headers: { 
                    "Autorizacion" : "Back " + usuario,
                    "Content-Type": "application/json" },
                body: JSON.stringify(estrenoActualizado),
            });

            obtenerEstrenos();
            limpiarFormulario();
        } catch (error) {
            console.error("Error al actualizar estreno:", error);
        }
    };

    const limpiarFormulario = () => {
        setPelicula("");
        setDescripcion("");
        setFecha("");
        setEditando(null);
    };

    //  Convierte "25-febrero-2002" a "2002-02-25"
    const formatearFechaInput = (fechaTexto) => {
        const [dia, mesTexto, anio] = fechaTexto.split("-");
        const meses = {
            enero: "01", febrero: "02", marzo: "03", abril: "04",
            mayo: "05", junio: "06", julio: "07", agosto: "08",
            septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"
        };
        return `${anio}-${meses[mesTexto.toLowerCase()]}-${dia.padStart(2, "0")}`;
    };

    //  Convierte "YYYY-MM-DD" a "DD-mes-YYYY"
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
            <h2>{editando ? "Editar Película" : "Agregar Nueva Película"}</h2>
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
            <button onClick={editando ? editarEstreno : agregarEstreno}>
                {editando ? "Guardar Cambios" : "Agregar"}
            </button>
            {editando && <button onClick={limpiarFormulario}>Cancelar</button>}

            <div className="contentPistas">
                <ul>
                    {estrenos.map((item) => (
                        <li key={item._id}>
                            <h3>{item.pelicula}</h3>
                            <p>{item.descripcion}</p>
                            <small>{item.fecha}</small>
                            <div>
                                <button onClick={() => cargarParaEditar(item)}>Editar</button>
                                <button onClick={() => eliminarEstreno(item._id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Estreno;
