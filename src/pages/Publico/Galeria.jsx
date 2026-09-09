import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imagenesGaleria } from "../../data/galeria.js";
import styles from "./Galeria.module.css";

export default function Galeria() {
  const [indiceActiva, setIndiceActiva] = useState(null);

  useEffect(() => {
    if (indiceActiva === null) return;

    const manejarTeclado = (evento) => {
      if (evento.key === "Escape") setIndiceActiva(null);
      if (evento.key === "ArrowRight") siguiente();
      if (evento.key === "ArrowLeft") anterior();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manejarTeclado);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", manejarTeclado);
    };
  }, [indiceActiva]);

  const anterior = () =>
    setIndiceActiva(
      (actual) => (actual - 1 + imagenesGaleria.length) % imagenesGaleria.length
    );

  const siguiente = () =>
    setIndiceActiva((actual) => (actual + 1) % imagenesGaleria.length);

  return (
    <section className={styles.raiz}>
      <h1 className={styles.title}>Galería</h1>
      <p className={styles.subtitle}>
        Un recorrido visual por el observatorio, el cielo nocturno y nuestras
        actividades de observación.
      </p>

      <div className={styles.grid}>
        {imagenesGaleria.map((imagen, i) => (
          <button
            key={imagen.id}
            type="button"
            className={styles.gridBtn}
            onClick={() => setIndiceActiva(i)}
            aria-label={`Ampliar ${imagen.titulo}`}
          >
            <img
              src={imagen.ruta}
              alt={imagen.titulo}
              className={styles.gridImg}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {indiceActiva !== null && (
        <div
          className={styles.overlay}
          onClick={() => setIndiceActiva(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de galería"
        >
          <div
            className={styles.lightbox}
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className={styles.cerrar}
              onClick={() => setIndiceActiva(null)}
              aria-label="Cerrar visor"
            >
              <X className={styles.botonIcono} aria-hidden="true" />
            </button>

            <button
              type="button"
              className={styles.flecha}
              onClick={anterior}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className={styles.botonIcono} aria-hidden="true" />
            </button>

            <figure className={styles.figura}>
              <img
                src={imagenesGaleria[indiceActiva].ruta}
                alt={imagenesGaleria[indiceActiva].titulo}
                className={styles.imagen}
              />
              <figcaption className={styles.caption}>
                <strong>{imagenesGaleria[indiceActiva].titulo}</strong>
                <span>{imagenesGaleria[indiceActiva].descripcion}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              className={styles.flecha}
              onClick={siguiente}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className={styles.botonIcono} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}