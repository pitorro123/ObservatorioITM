import { useState, useEffect, useRef } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  Navigation,
  Users,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useEventosContext } from "../../../context/EventosContext.jsx";
import { formatearFecha, formatearHora } from "../../../utils/formato.js";
import estilos from "./DetalleEvento.module.css";

function construirUrlMapa(direccion) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    direccion
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
}

export default function DetalleEvento() {
  const { id } = useParams();
  const { obtenerEvento, inscribir } = useEventosContext();
  const evento = obtenerEvento(id);

  const esMasivo = Boolean(evento?.esMasivo);
  const capacidad = Number(evento?.capacidad) > 0 ? Number(evento.capacidad) : 50;
  const inscritos = Number(evento?.inscritos) || 0;
  const cuposDisponibles = esMasivo ? Infinity : Math.max(0, capacidad - inscritos);
  const porcentajeOcupado = esMasivo ? 0 : Math.min(100, Math.round((inscritos / capacidad) * 100));
  const estaAgotado = !esMasivo && cuposDisponibles === 0;
  const ultimosCupos = !esMasivo && cuposDisponibles > 0 && cuposDisponibles <= 5;

  const direccionEvento =
    (evento?.ubicacionMapa || "").trim() ||
    (evento?.lugar || "").trim() ||
    "Institución Universitaria ITM · Campus Fraternidad, Cl. 54a #30-01, Villa Hermosa, Medellín, Antioquia";

  const enlaceRuta = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    direccionEvento
  )}`;

  const [confirmada, setConfirmada] = useState(false);
  const [datos, setDatos] = useState({ nombre: "", correo: "", telefono: "" });
  const [inscripcion, setInscripcion] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState("");

  const inscripcionRef = useRef(null);

  useEffect(() => {
    inscripcionRef.current?.scrollIntoView({ block: "start" });
  }, []);

  if (!evento || evento.estado !== "publicado") {
    return <Navigate to="/eventos" replace />;
  }

  const manejarCambio = (campo) => (eventoInput) => {
    let valor = eventoInput.target.value;
    if (campo === "telefono") {
      valor = valor.replace(/[^\d\s\-+()]/g, "");
    }
    setDatos((prev) => ({ ...prev, [campo]: valor }));
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

    if (!telefono) {
      setError("Ingresa tu número de celular.");
      return;
    }

    let soloDigitos = telefono.replace(/\D/g, "");

    // Si comienza con código de país 57 (Colombia) y tiene 12 dígitos, extraer los 10 dígitos locales
    if (soloDigitos.startsWith("57") && soloDigitos.length === 12) {
      soloDigitos = soloDigitos.slice(2);
    }

    // Celular en Colombia (10 dígitos comenzando en 3) o formato internacional (+ seguido de 10 a 15 dígitos)
    const esCelularColombia = /^3\d{9}$/.test(soloDigitos);
    const esInternacional =
      telefono.startsWith("+") &&
      soloDigitos.length >= 10 &&
      soloDigitos.length <= 15;

    if (!esCelularColombia && !esInternacional) {
      setError(
        "Ingresa un número de celular válido de 10 dígitos (ej: 300 123 4567)."
      );
      return;
    }

    if (/^(\d)\1{9,}$/.test(soloDigitos)) {
      setError("El número de celular ingresado no parece ser real.");
      return;
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

  const copiarCodigo = () => {
    if (!inscripcion?.codigo) return;
    navigator.clipboard.writeText(inscripcion.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
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
            <span
              className={`${estilos.badgeTipo} ${
                estilos[`badgeTipo_${evento.tipo}`] || estilos.badgeTipo_abierto
              }`}
            >
              {evento.tipo === "charla"
                ? "Charla"
                : evento.tipo === "observacion"
                  ? "Observación"
                  : "Abierto al público"}
            </span>
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
              <li className={estilos.metaItem}>
                <Users className={estilos.metaIcon} aria-hidden="true" />
                <span>
                  {esMasivo
                    ? `Evento masivo · Entrada libre (${inscritos} ${
                        inscritos === 1 ? "persona registrada" : "personas registradas"
                      })`
                    : estaAgotado
                      ? `Capacidad máxima alcanzada (${capacidad} personas)`
                      : `${cuposDisponibles} de ${capacidad} cupos disponibles`}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={estilos.inscripcion} ref={inscripcionRef}>
        {confirmada && inscripcion ? (
          <div className={estilos.confirmacion} role="status">
            <CheckCircle2 className={estilos.iconoExito} aria-hidden="true" />
            <h2 className={estilos.confirmacionTitulo}>
              {esMasivo
                ? `¡Registro exitoso, ${datos.nombre || "participante"}!`
                : `¡Inscripción confirmada, ${datos.nombre || "participante"}!`}
            </h2>
            <p className={estilos.confirmacionTexto}>
              Te esperamos en <strong>{evento.lugar}</strong> el{" "}
              <strong>{formatearFecha(evento.fecha)}</strong> a las{" "}
              <strong>{formatearHora(evento.hora)}</strong>.
            </p>

            {esMasivo ? (
              <div className={estilos.cajaMasivoConfirmacion}>
                <div className={estilos.badgeMasivoExito}>
                  <Sparkles className={estilos.iconoSparkle} aria-hidden="true" />
                  <span>Evento Masivo · Entrada Libre</span>
                </div>
                <p className={estilos.textoMasivoExito}>
                  Hemos registrado tus datos para llevar el control y aforo de participantes del evento.
                </p>
                <div className={estilos.avisoSinCorreo}>
                  <p>
                    Al ser un evento abierto y masivo con entrada libre, <strong>no requieres código de acceso</strong> ni se enviará confirmación a tu correo. ¡Solo acércate y disfruta del evento!
                  </p>
                </div>
              </div>
            ) : (
              <div className={estilos.codigoCaja}>
                <span className={estilos.codigoEtiqueta}>Tu código de 4 dígitos</span>
                <div className={estilos.digitosFila}>
                  {String(inscripcion.codigo || "0000")
                    .split("")
                    .map((digito, i) => (
                      <span key={i} className={estilos.bloqueDigito}>
                        {digito}
                      </span>
                    ))}
                </div>
                <button
                  type="button"
                  className={estilos.botonCopiar}
                  onClick={copiarCodigo}
                  aria-label="Copiar código de 4 dígitos"
                >
                  {copiado ? (
                    <>
                      <Check className={estilos.iconoBoton} aria-hidden="true" />
                      Código copiado
                    </>
                  ) : (
                    <>
                      <Copy className={estilos.iconoBoton} aria-hidden="true" />
                      Copiar código ({inscripcion.codigo})
                    </>
                  )}
                </button>
                <p className={estilos.codigoCorreoAviso}>
                  ✉️ Hemos enviado este código a tu correo:{" "}
                  <strong>{inscripcion.correo}</strong>
                </p>
                <p className={estilos.codigoAyuda}>
                  Presenta este código al ingresar al evento para registrar tu asistencia.
                </p>
              </div>
            )}

            <Link to="/eventos" className={estilos.enlaceVolver}>
              Ver más eventos
            </Link>
          </div>
        ) : (
          <>
            <h2 className={estilos.inscripcionTitulo}>Inscríbete a este evento</h2>
            <p className={estilos.inscripcionTexto}>
              {esMasivo
                ? "Completa tus datos para registrar tu asistencia. La entrada es gratuita y de aforo libre."
                : "Completa tus datos para reservar tu cupo. La entrada es gratuita."}
            </p>

            {/* Tarjeta de disponibilidad de cupos / Evento Masivo */}
            {esMasivo ? (
              <div className={estilos.disponibilidadCardMasivo}>
                <div className={estilos.disponibilidadCabecera}>
                  <div className={estilos.disponibilidadInfo}>
                    <Users className={estilos.iconoDisponibilidad} aria-hidden="true" />
                    <div>
                      <span className={estilos.disponibilidadTitulo}>
                        Acceso al evento
                      </span>
                      <span className={estilos.disponibilidadSub}>
                        Evento masivo · Entrada libre
                      </span>
                    </div>
                  </div>
                  <span className={`${estilos.badgeDisponibilidad} ${estilos.badgeMasivo}`}>
                    Aforo Libre
                  </span>
                </div>
                <div className={estilos.infoMasivoDetalle}>
                  <p className={estilos.textoMasivoCupos}>
                    <strong>{inscritos}</strong> {inscritos === 1 ? "persona registrada" : "personas registradas"} hasta el momento.
                  </p>
                  <span className={estilos.notaMasivo}>
                    No hay límite de cupos para este evento. Inscríbete para registrar tu participación.
                  </span>
                </div>
              </div>
            ) : (
              <div className={estilos.disponibilidadCard}>
                <div className={estilos.disponibilidadCabecera}>
                  <div className={estilos.disponibilidadInfo}>
                    <Users className={estilos.iconoDisponibilidad} aria-hidden="true" />
                    <div>
                      <span className={estilos.disponibilidadTitulo}>
                        Disponibilidad del evento
                      </span>
                      <span className={estilos.disponibilidadSub}>
                        {estaAgotado
                          ? "No quedan cupos disponibles"
                          : `${cuposDisponibles} ${
                              cuposDisponibles === 1 ? "cupo disponible" : "cupos disponibles"
                            }`}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${estilos.badgeDisponibilidad} ${
                      estaAgotado
                        ? estilos.badgeAgotado
                        : ultimosCupos
                          ? estilos.badgeUltimos
                          : estilos.badgeDisponible
                    }`}
                  >
                    {estaAgotado
                      ? "Cupos Agotados"
                      : ultimosCupos
                        ? `¡Últimos ${cuposDisponibles} cupos!`
                        : "Cupos Disponibles"}
                  </span>
                </div>

                <div className={estilos.progresoContenedor}>
                  <div
                    className={`${estilos.progresoBarra} ${
                      estaAgotado
                        ? estilos.progresoAgotado
                        : ultimosCupos
                          ? estilos.progresoUltimos
                          : estilos.progresoDisponible
                    }`}
                    style={{ width: `${porcentajeOcupado}%` }}
                    role="progressbar"
                    aria-valuenow={inscritos}
                    aria-valuemin={0}
                    aria-valuemax={capacidad}
                  />
                </div>

                <div className={estilos.progresoEtiquetas}>
                  <span>
                    <strong>{inscritos}</strong> inscritos
                  </span>
                  <span>
                    Capacidad: <strong>{capacidad}</strong> personas
                  </span>
                </div>
              </div>
            )}

            {estaAgotado ? (
              <div className={estilos.cajaAgotado}>
                <AlertCircle className={estilos.iconoAgotado} aria-hidden="true" />
                <h3 className={estilos.tituloAgotado}>Inscripciones completas</h3>
                <p className={estilos.textoAgotado}>
                  Este evento ha alcanzado el límite máximo de{" "}
                  <strong>{capacidad} participantes</strong>. Te invitamos a explorar
                  nuestras próximas actividades para asegurar tu lugar.
                </p>
                <Link to="/eventos" className={estilos.botonExplorarOtros}>
                  Ver otros eventos disponibles
                </Link>
              </div>
            ) : (
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
                    Teléfono / Celular
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    required
                    value={datos.telefono}
                    onChange={manejarCambio("telefono")}
                    className={estilos.input}
                    placeholder="300 000 0000"
                    maxLength={16}
                  />
                </div>

                <button type="submit" className={estilos.botonInscribirse}>
                  Inscribirme
                </button>
              </form>
            )}
          </>
        )}
        </div>

        <div className={estilos.ubicacion}>
          <div className={estilos.ubicacionHeader}>
            <h2 className={estilos.ubicacionTitulo}>¿Cómo llegar?</h2>
            <p className={estilos.ubicacionTexto}>
              El evento se realiza en <strong>{direccionEvento}</strong>. Usa el mapa para ubicarte o calcular tu ruta.
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
              {direccionEvento}
            </div>
            <iframe
              src={construirUrlMapa(direccionEvento)}
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