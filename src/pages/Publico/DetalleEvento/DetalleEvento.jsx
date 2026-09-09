import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  Navigation,
  Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEventosContext } from "../../../context/EventosContext.jsx";
import { formatearFecha, formatearHora } from "../../../utils/formato.js";
import estilos from "./DetalleEvento.module.css";

const UBICACION = {
  lat: 6.2451243,
  lng: -75.5499752,
  direccion: "Institución Universitaria ITM · Campus Fraternidad, Cl. 54a #30-01, Villa Hermosa, Medellín, Antioquia",
};

function construirUrlMapa() {
  const { lat, lng } = UBICACION;
  const margen = 0.004;
  return (
    `https://www.openstreetmap.org/export/embed.html?` +
    `bbox=${lng - margen}%2C${lat - margen}%2C${lng + margen}%2C${lat + margen}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`
  );
}

const enlaceRuta = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  "ITM Campus Fraternidad, Calle 54A #30-01, Medellín, Antioquia"
)}`;

export default function DetalleEvento() {
  const { id } = useParams();
  const { obtenerEvento, inscribir } = useEventosContext();
  const evento = obtenerEvento(id);

  const [confirmada, setConfirmada] = useState(false);
  const [datos, setDatos] = useState({ nombre: "", correo: "", telefono: "" });
  const [inscripcion, setInscripcion] = useState(null);
  const [error, setError] = useState("");

  if (!evento || evento.estado !== "publicado") {
    return <Navigate to="/eventos" replace />;
  }

  const manejarCambio = (campo) => (eventoInput) => {
    setDatos((prev) => ({ ...prev, [campo]: eventoInput.target.value }));
    if (error) setError("");
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim();
    const telefono = datos.telefono.trim();

    if (!nombre) {
      setError("Escribe tu nombre completo.");
      return;
    }

    const palabrasNombre = nombre.split(/\s+/).filter(Boolean);
    const palabraValida = (palabra) =>
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ']{2,}$/.test(palabra) &&
      /[aeiouáéíóúü]/i.test(palabra);

    if (palabrasNombre.length < 2) {
      setError("Ingresa tu nombre y apellido.");
      return;
    }
    if (!palabrasNombre.every(palabraValida)) {
      setError("El nombre no parece real. Escribe tu nombre y apellido.");
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (telefono) {
      const soloDigitos = telefono.replace(/\D/g, "");
      if (soloDigitos.length < 7 || soloDigitos.length > 15) {
        setError("Ingresa un número de teléfono válido (solo números).");
        return;
      }
    }

    const resultado = inscribir({
      eventoId: evento.id,
      nombre,
      correo,
      telefono,
    });
    if (!resultado.exito) {
      setError(resultado.error);
      return;
    }
    setInscripcion(resultado.inscripcion);
    setConfirmada(true);
  };

  const descargarQr = () => {
    const canvas = document.getElementById("qr-inscripcion");
    if (!canvas) return;
    const enlace = canvas.toDataURL("image/png");
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = enlace;
    enlaceDescarga.download = `QR-${inscripcion.codigo}.png`;
    enlaceDescarga.click();
  };

  return (
    <section className={estilos.raiz}>
      <Link to="/eventos" className={estilos.volver}>
        <ChevronLeft className={estilos.iconoVolver} aria-hidden="true" />
        Volver a eventos
      </Link>

      <div className={estilos.gridDetalle}>
        <div className={estilos.heroCard}>
          {evento.imagen && (
            <div className={estilos.imagenWrap}>
              <img
                src={evento.imagen}
                alt={evento.titulo}
                className={estilos.imagen}
              />
            </div>
          )}
          <div className={estilos.info}>
            {evento.tipo === "semillero" && (
              <span className={estilos.badgeSemillero}>Semillero de astronomía</span>
            )}
            <h1 className={estilos.titulo}>{evento.titulo}</h1>
            <p className={estilos.descripcion}>{evento.descripcion}</p>

            <ul className={estilos.meta}>
              <li className={estilos.metaItem}>
                <CalendarDays className={estilos.metaIcon} aria-hidden="true" />
                <span>{formatearFecha(evento.fecha)}</span>
              </li>
              <li className={estilos.metaItem}>
                <Clock className={estilos.metaIcon} aria-hidden="true" />
                <span>{formatearHora(evento.hora)}</span>
              </li>
              <li className={estilos.metaItem}>
                <MapPin className={estilos.metaIcon} aria-hidden="true" />
                <span>{evento.lugar}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={estilos.inscripcion}>
        {confirmada && inscripcion ? (
          <div className={estilos.confirmacion} role="status">
            <CheckCircle2 className={estilos.iconoExito} aria-hidden="true" />
            <h2 className={estilos.confirmacionTitulo}>
              ¡Inscripción confirmada, {datos.nombre || "participante"}!
            </h2>
            <p className={estilos.confirmacionTexto}>
              Te esperamos en {evento.lugar} el {formatearFecha(evento.fecha)} a las{" "}
              {formatearHora(evento.hora)}. Guarda tu código QR de asistencia.
            </p>

            <div className={estilos.qrBox}>
              <span className={estilos.qrTitulo}>Tu código de asistencia</span>
              <QRCodeSVG
                id="qr-inscripcion"
                value={inscripcion.codigo}
                size={168}
                className={estilos.qr}
              />
              <p className={estilos.qrCodigo}>{inscripcion.codigo}</p>
              <p className={estilos.qrAyuda}>
                Muestra este código al ingresar al evento. También puedes consultar tu
                asistencia desde el panel docente.
              </p>
              <button
                type="button"
                className={estilos.botonDescargar}
                onClick={descargarQr}
              >
                <Download className={estilos.iconoBoton} aria-hidden="true" />
                Descargar QR
              </button>
            </div>

            <Link to="/eventos" className={estilos.enlaceVolver}>
              Ver más eventos
            </Link>
          </div>
        ) : (
          <>
            <h2 className={estilos.inscripcionTitulo}>Inscríbete a este evento</h2>
            <p className={estilos.inscripcionTexto}>
              Completa tus datos para reservar tu cupo. La entrada es gratuita.
            </p>

            <form className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
              {error && (
                <p className={estilos.errorForm} role="alert">
                  {error}
                </p>
              )}

              <div className={estilos.campo}>
                <label className={estilos.etiqueta} htmlFor="nombre">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={datos.nombre}
                  onChange={manejarCambio("nombre")}
                  className={estilos.input}
                  placeholder="Tu nombre"
                />
              </div>

              <div className={estilos.campo}>
                <label className={estilos.etiqueta} htmlFor="correo">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  required
                  value={datos.correo}
                  onChange={manejarCambio("correo")}
                  className={estilos.input}
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              <div className={estilos.campo}>
                <label className={estilos.etiqueta} htmlFor="telefono">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={manejarCambio("telefono")}
                  className={estilos.input}
                  placeholder="300 000 0000"
                />
              </div>

              <button type="submit" className={estilos.botonInscribirse}>
                Inscribirme
              </button>
            </form>
          </>
        )}
        </div>

        <div className={estilos.ubicacion}>
        <div className={estilos.ubicacionHeader}>
          <h2 className={estilos.ubicacionTitulo}>¿Cómo llegar?</h2>
          <p className={estilos.ubicacionTexto}>
            El evento se realiza en la {UBICACION.direccion}. Usa el mapa para ubicarte.
          </p>
          <a
            href={enlaceRuta}
            target="_blank"
            rel="noopener noreferrer"
            className={estilos.botonRuta}
          >
            <Navigation className={estilos.iconoBoton} aria-hidden="true" />
            Ver ruta en Google Maps
          </a>
        </div>

        <div className={estilos.mapaWrap}>
          <div className={estilos.mapaPin}>
            <MapPin className={estilos.mapaPinIcono} aria-hidden="true" />
            {UBICACION.direccion}
          </div>
          <iframe
            src={construirUrlMapa()}
            title={`Mapa de ubicación del evento ${evento.titulo}`}
            className={estilos.mapa}
            loading="lazy"
          />
        </div>
        </div>
      </div>
    </section>
  );
}