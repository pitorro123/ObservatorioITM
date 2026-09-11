import { useEffect, useState } from "react";
import { X, ImagePlus, MapPin, Users } from "lucide-react";
import estilos from "./FormularioEvento.module.css";

const formularioVacio = {
  titulo: "",
  descripcion: "",
  fecha: "",
  hora: "",
  lugar: "",
  esMasivo: false,
  capacidad: 50,
  ubicacionMapa: "",
  imagen: "",
  tipo: "abierto",
  publicarDirectamente: false,
};

const LUGARES_SUGERIDOS = [
  {
    nombreBoton: "Campus Fraternidad",
    lugar: "Observatorio Astronómico ITM - Sede Fraternidad",
    direccion:
      "Institución Universitaria ITM · Campus Fraternidad, Cl. 54a #30-01, Villa Hermosa, Medellín, Antioquia",
  },
  {
    nombreBoton: "Campus Robledo",
    lugar: "ITM - Campus Robledo",
    direccion:
      "Institución Universitaria ITM · Campus Robledo, Calle 73 #76A-354, Medellín, Antioquia",
  },
  {
    nombreBoton: "Parque Explora",
    lugar: "Parque Explora",
    direccion:
      "Parque Explora, Carrera 52 #73-75, Aranjuez, Medellín, Antioquia, Colombia",
  },
];

export default function FormularioEvento({ abierto, evento, onCerrar, onGuardar }) {
  const [formulario, setFormulario] = useState(formularioVacio);
  const [error, setError] = useState("");
  const esEdicion = Boolean(evento);

  useEffect(() => {
    if (!abierto) return;
    setError("");
    if (evento) {
      const tiposValidos = ["abierto", "charla", "observacion"];
      const tipoValido = tiposValidos.includes(evento.tipo)
        ? evento.tipo
        : evento.tipo === "semillero"
          ? "charla"
          : "abierto";

      const esMasivo = Boolean(evento.esMasivo);

      setFormulario({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: evento.fecha,
        hora: evento.hora,
        lugar: evento.lugar,
        esMasivo,
        capacidad: esMasivo ? "" : (evento.capacidad !== undefined ? evento.capacidad : 50),
        ubicacionMapa: evento.ubicacionMapa || "",
        imagen: evento.imagen || "",
        tipo: tipoValido,
        publicarDirectamente: evento.estado === "publicado",
      });
    } else {
      setFormulario(formularioVacio);
    }
  }, [abierto, evento]);

  if (!abierto) return null;

  const cambiarCampo = (clave) => (eventoInput) => {
    const valor =
      clave === "publicarDirectamente" || clave === "esMasivo"
        ? eventoInput.target.checked
        : eventoInput.target.value;
    setFormulario((prev) => ({ ...prev, [clave]: valor }));
    if (error) setError("");
  };

  const manejarImagen = (eventoInput) => {
    const archivo = eventoInput.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      setFormulario((prev) => ({ ...prev, imagen: lector.result }));
    };
    lector.readAsDataURL(archivo);
  };

  const manejarEnvio = (eventoForm) => {
    eventoForm.preventDefault();

    const titulo = formulario.titulo.trim();
    const descripcion = formulario.descripcion.trim();
    const lugar = formulario.lugar.trim();
    const ubicacionMapa = (formulario.ubicacionMapa || "").trim() || lugar;

    if (titulo.length < 3) {
      setError("Escribe el nombre del evento (mínimo 3 caracteres).");
      return;
    }
    if (descripcion.length < 10) {
      setError("Describe la actividad del evento (mínimo 10 caracteres).");
      return;
    }
    if (!formulario.fecha) {
      setError("Selecciona la fecha del evento.");
      return;
    }
    if (!formulario.hora) {
      setError("Selecciona la hora del evento.");
      return;
    }
    if (lugar.length < 3) {
      setError("Escribe el lugar del evento.");
      return;
    }

    let capacidadFinal = null;
    if (!formulario.esMasivo) {
      const capacidadNum = Number(formulario.capacidad);
      if (isNaN(capacidadNum) || capacidadNum < 1) {
        setError("Ingresa una capacidad de integrantes válida (mínimo 1 cupo).");
        return;
      }
      capacidadFinal = capacidadNum;
    }

    const datos = {
      titulo,
      descripcion,
      fecha: formulario.fecha,
      hora: formulario.hora,
      lugar,
      esMasivo: Boolean(formulario.esMasivo),
      capacidad: capacidadFinal,
      ubicacionMapa,
      imagen: formulario.imagen,
      tipo: formulario.tipo,
      estado: formulario.publicarDirectamente ? "publicado" : "borrador",
    };

    onGuardar(datos);
  };

  return (
    <div className={estilos.overlay} role="dialog" aria-modal="true">
      <div className={estilos.modal}>
        <div className={estilos.cabecera}>
          <h2 className={estilos.titulo}>
            {esEdicion ? "Editar evento" : "Crear evento"}
          </h2>
          <button
            type="button"
            className={estilos.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar formulario"
          >
            <X className={estilos.iconoCerrar} aria-hidden="true" />
          </button>
        </div>

        <form className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
          {error && (
            <p className={estilos.errorForm} role="alert">
              {error}
            </p>
          )}
          <div className={estilos.campo}>
            <label className={estilos.etiqueta} htmlFor="ev-titulo">
              Nombre
            </label>
            <input
              id="ev-titulo"
              type="text"
              required
              value={formulario.titulo}
              onChange={cambiarCampo("titulo")}
              className={estilos.input}
              placeholder="Ej: Tinto bajo las estrellas"
            />
          </div>

          <div className={estilos.campo}>
            <label className={estilos.etiqueta} htmlFor="ev-descripcion">
              Descripción
            </label>
            <textarea
              id="ev-descripcion"
              required
              rows="4"
              value={formulario.descripcion}
              onChange={cambiarCampo("descripcion")}
              className={estilos.textarea}
              placeholder="Describe la actividad del evento"
            />
          </div>

          <div className={estilos.fila}>
            <div className={estilos.campo}>
              <label className={estilos.etiqueta} htmlFor="ev-fecha">
                Fecha
              </label>
              <input
                id="ev-fecha"
                type="date"
                required
                value={formulario.fecha}
                onChange={cambiarCampo("fecha")}
                className={estilos.input}
              />
            </div>

            <div className={estilos.campo}>
              <label className={estilos.etiqueta} htmlFor="ev-hora">
                Hora
              </label>
              <input
                id="ev-hora"
                type="time"
                required
                value={formulario.hora}
                onChange={cambiarCampo("hora")}
                className={estilos.input}
              />
            </div>
          </div>

          <div className={estilos.campo}>
            <label className={estilos.etiqueta} htmlFor="ev-lugar">
              Lugar / Espacio
            </label>
            <input
              id="ev-lugar"
              type="text"
              required
              value={formulario.lugar}
              onChange={cambiarCampo("lugar")}
              className={estilos.input}
              placeholder="Ej: Observatorio Astronómico ITM - Sede Fraternidad"
            />
            <div className={estilos.sugerenciasUbicacion}>
              <span className={estilos.sugerenciasTexto}>Accesos rápidos:</span>
              {LUGARES_SUGERIDOS.map((sug) => (
                <button
                  key={`lugar-${sug.nombreBoton}`}
                  type="button"
                  className={estilos.botonSugerencia}
                  onClick={() =>
                    setFormulario((prev) => ({
                      ...prev,
                      lugar: sug.lugar,
                      ubicacionMapa: prev.ubicacionMapa ? prev.ubicacionMapa : sug.direccion,
                    }))
                  }
                >
                  {sug.nombreBoton}
                </button>
              ))}
            </div>
          </div>

          <div className={estilos.campo}>
            <div className={estilos.etiquetaConAyuda}>
              <label className={estilos.etiqueta} htmlFor="ev-ubicacion-mapa">
                <MapPin className={estilos.iconoCampo} aria-hidden="true" />
                Ubicación para el mapa (dirección exacta)
              </label>
            </div>
            <input
              id="ev-ubicacion-mapa"
              type="text"
              value={formulario.ubicacionMapa}
              onChange={cambiarCampo("ubicacionMapa")}
              className={estilos.input}
              placeholder="Ej: Cl. 54a #30-01, Villa Hermosa, Medellín o Campus Fraternidad"
            />
            <div className={estilos.sugerenciasUbicacion}>
              <span className={estilos.sugerenciasTexto}>Accesos rápidos:</span>
              {LUGARES_SUGERIDOS.map((sug) => (
                <button
                  key={`mapa-${sug.nombreBoton}`}
                  type="button"
                  className={estilos.botonSugerencia}
                  onClick={() =>
                    setFormulario((prev) => ({
                      ...prev,
                      ubicacionMapa: sug.direccion,
                    }))
                  }
                >
                  {sug.nombreBoton}
                </button>
              ))}
            </div>
          </div>

          <div className={estilos.campoMasivo}>
            <label className={estilos.cajaMasivo}>
              <input
                type="checkbox"
                checked={formulario.esMasivo}
                onChange={cambiarCampo("esMasivo")}
                className={estilos.checkbox}
              />
              <div className={estilos.infoMasivo}>
                <span className={estilos.tituloMasivo}>Evento masivo</span>
                <span className={estilos.subtituloMasivo}>
                  Desactiva la capacidad de participantes (cupos ilimitados) y no genera códigos de acceso.
                </span>
              </div>
            </label>
          </div>

          <div className={estilos.fila}>
            <div className={estilos.campo}>
              <label
                className={`${estilos.etiqueta} ${formulario.esMasivo ? estilos.etiquetaDeshabilitada : ""}`}
                htmlFor="ev-capacidad"
              >
                <Users className={estilos.iconoCampo} aria-hidden="true" />
                Capacidad de participantes
              </label>
              <input
                id="ev-capacidad"
                type="number"
                min="1"
                max="5000"
                disabled={formulario.esMasivo}
                required={!formulario.esMasivo}
                value={formulario.esMasivo ? "" : formulario.capacidad}
                onChange={cambiarCampo("capacidad")}
                className={`${estilos.input} ${formulario.esMasivo ? estilos.inputDeshabilitado : ""}`}
                placeholder={formulario.esMasivo ? "Ilimitada (Evento masivo)" : "Ej: 50"}
              />
              <span className={estilos.ayudaCampo}>
                {formulario.esMasivo
                  ? "Capacidad ilimitada para evento masivo."
                  : "Cupos totales disponibles para inscripción."}
              </span>
            </div>

            <div className={estilos.campo}>
              <label className={estilos.etiqueta} htmlFor="ev-tipo">
                Tipo de evento
              </label>
              <select
                id="ev-tipo"
                value={formulario.tipo}
                onChange={cambiarCampo("tipo")}
                className={`${estilos.input} ${estilos.select}`}
              >
                <option value="abierto">Abierto al público</option>
                <option value="charla">Charla</option>
                <option value="observacion">Observación</option>
              </select>
            </div>
          </div>

          <div className={estilos.campo}>
            <label className={estilos.etiqueta}>Imagen</label>
            <div className={estilos.grupoImagen}>
              {formulario.imagen && (
                <img
                  src={formulario.imagen}
                  alt="Vista previa del evento"
                  className={estilos.vistaPrevia}
                />
              )}
              <label className={estilos.botonImagen}>
                <ImagePlus className={estilos.iconoImagen} aria-hidden="true" />
                <span>{formulario.imagen ? "Cambiar imagen" : "Subir imagen"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarImagen}
                  className={estilos.inputArchivo}
                />
              </label>
            </div>
          </div>

          <div className={estilos.campoPublicar}>
            <label className={estilos.cajaPublicar}>
              <input
                type="checkbox"
                checked={formulario.publicarDirectamente}
                onChange={cambiarCampo("publicarDirectamente")}
                className={estilos.checkbox}
              />
              <span>Publicar directamente (visible en el portal)</span>
            </label>
            <p className={estilos.ayuda}>
              Si no marcamos esta opción, el evento se guardará como{" "}
              <strong>borrador</strong>.
            </p>
          </div>

          <div className={estilos.acciones}>
            <button type="button" className={estilos.botonCancelar} onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className={estilos.botonGuardar}>
              {esEdicion ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}