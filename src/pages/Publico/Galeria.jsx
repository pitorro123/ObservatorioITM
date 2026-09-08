import { imagenesGaleria } from "../../data/galeria.js";
import styles from "./Galeria.module.css";

export default function Galeria() {
  return (
    <section className={styles.raiz}>
      <h1 className={styles.title}>Galería</h1>
      <p className={styles.subtitle}>
        Un recorrido visual por el observatorio, el cielo nocturno y nuestras
        actividades de observación.
      </p>

      <div className={styles.grid}>
{imagenesGaleria.map((imagen) => (
          <img
            key={imagen.id}
            src={imagen.ruta}
            alt={imagen.titulo}
            className={styles.gridImg}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
