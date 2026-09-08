import { useState } from "react";
import { UserPlus, Pencil, X, AlertCircle } from "lucide-react";
import estilos from "./FormularioDocente.module.css";

export default function FormularioDocente({
  abierto,
  docente,
  onCerrar,
  onGuardar,
}) {
  const [datos, setDatos] = useState(() => ({
    nombre: docente?.nombre || "",
    correo: docente?.correo || "",
    estado: docente?.estado || "Activo",
  }));
  const [error, setError] = useState("");

  if (!abierto) return null;

  const esEdicion = Boolean(docente);

  const manejarCambio = (campo) => (evento) => {
    setDatos((prev) => ({ ...prev, [campo]: evento.target.value }));
    if (error) setError("");
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim();

    if (nombre.length < 3) {
      setError("Ingresa el nombre completo del docente.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const resultado = onGuardar({
      nombre,
      correo,
      estado: esEdicion ? datos.estado : "Pendiente",
    });

    if (resultado && !resultado.exito) {
      setError(resultado.error);
      return;
    }

    setDatos({ nombre: "", correo: "", estado: "Activo" });
    setError("");
  };

  return (
    <div className={estilos.overlay} role="dialog" aria-modal="true">
      <div className={estilos.modal}>
        <div className={estilos.cabecera}>
          <div className={estilos.tituloWrap}>
            <span className={estilos.iconoWrap}>
              {esEdicion ? (
                <Pencil className={estilos.icono} aria-hidden="true" />
              ) : (
                <UserPlus className={estilos.icono} aria-hidden="true" />
              )}
            </span>
            <div>
              <h2 className={estilos.titulo}>
                {esEdicion ? "Editar cuenta de docente" : "Crear cuenta de docente"}
              </h2>
              <p className={estilos.subtitulo}>
                {esEdicion
                  ? "Actualiza los datos de la cuenta."
                  : "La cuenta recibirá un enlace por correo para configurar su contraseña."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={estilos.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <X className={estilos.iconoCerrar} aria-hidden="true" />
          </button>
        </div>

        <form className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
          {error && (
            <div className={estilos.alertError} role="alert">
              <AlertCircle className={estilos.iconoError} aria-hidden="true" />
              {error}
            </div>
          )}

          <div className={estilos.campo}>
            <label className={estilos.etiqueta} htmlFor="docente-nombre">
              Nombre completo
            </label>
            <input
              id="docente-nombre"
              type="text"
              required
              value={datos.nombre}
              onChange={manejarCambio("nombre")}
              className={estilos.input}
              placeholder="Ej. María Fernanda Ospina"
            />
          </div>

          <div className={estilos.campo}>
            <label className={estilos.etiqueta} htmlFor="docente-correo">
              Correo electrónico
            </label>
            <input
              id="docente-correo"
              type="email"
              required
              value={datos.correo}
              onChange={manejarCambio("correo")}
              className={estilos.input}
              placeholder="nombre@itm.edu.co"
            />
          </div>

          {esEdicion && (
            <div className={estilos.campo}>
              <label className={estilos.etiqueta} htmlFor="docente-estado">
                Estado de la cuenta
              </label>
              <select
                id="docente-estado"
                value={datos.estado}
                onChange={manejarCambio("estado")}
                className={estilos.input}
              >
                <option value="Activo">Activo</option>
                <option value="Desactivado">Desactivado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          )}

          <div className={estilos.acciones}>
            <button type="button" className={estilos.botonCancelar} onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className={estilos.botonGuardar}>
              {esEdicion ? "Guardar cambios" : "Crear cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}