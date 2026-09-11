import { useEffect, useState, useCallback } from "react";

const LAT = 6.2422;
const LON = -75.5494;

const URL_CONSULTA =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,cloud_cover,precipitation,weather_code` +
  `&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code` +
  `&timezone=America%2FBogota&forecast_days=7`;

const CODIGOS_CLIMA = {
  0: { descripcion: "Cielo despejado", grupo: "Noche despejada" },
  1: { descripcion: "Mayormente despejado", grupo: "Noche despejada" },
  2: { descripcion: "Parcialmente nublado", grupo: "Nube parcial" },
  3: { descripcion: "Cielo cubierto", grupo: "Cielo nublado" },
  45: { descripcion: "Niebla", grupo: "Cielo nublado" },
  48: { descripcion: "Niebla con escarcha", grupo: "Cielo nublado" },
  51: { descripcion: "Llovizna ligera", grupo: "Riesgo de lluvia" },
  53: { descripcion: "Llovizna moderada", grupo: "Riesgo de lluvia" },
  55: { descripcion: "Llovizna intensa", grupo: "Riesgo de lluvia" },
  61: { descripcion: "Lluvia ligera", grupo: "Riesgo de lluvia" },
  63: { descripcion: "Lluvia moderada", grupo: "Riesgo de lluvia" },
  65: { descripcion: "Lluvia intensa", grupo: "Riesgo de lluvia" },
  80: { descripcion: "Chubascos ligeros", grupo: "Riesgo de lluvia" },
  81: { descripcion: "Chubascos moderados", grupo: "Riesgo de lluvia" },
  82: { descripcion: "Chubascos violentos", grupo: "Riesgo de lluvia" },
  95: { descripcion: "Tormenta eléctrica", grupo: "Riesgo de lluvia" },
  96: { descripcion: "Tormenta con granizo ligero", grupo: "Riesgo de lluvia" },
  99: { descripcion: "Tormenta con granizo fuerte", grupo: "Riesgo de lluvia" },
};

function calcularCondiciones(clima) {
  const nubosidad = clima?.current?.cloud_cover ?? 0;
  const probabilidadLluvia = clima?.daily?.precipitation_probability_max?.[0] ?? 0;
  const lluvia = clima?.current?.precipitation ?? 0;

  if (nubosidad < 25 && probabilidadLluvia < 30 && lluvia === 0) {
    return {
      valor: "FAVORABLES",
      esDesfavorable: false,
      esParcial: false,
      descripcion: "Las condiciones actuales son adecuadas para observar el cielo con telescopios.",
      recomendacion:
        "Excelente noche para observar. Lleva ropa abrigada y revisa el horario del evento.",
      mensajeLanding:
        "Cielo despejado: condiciones óptimas para la observación astronómica y uso de telescopios.",
      mensajeDocente:
        "Condiciones meteorológicas favorables. Los eventos de observación astronómica pueden desarrollarse al aire libre con telescopios según lo programado.",
      observatorioEstado: "ABIERTO",
      observatorioEstadoDesc:
        "Instalaciones abiertas y listas para observación telescópica y recorridos.",
    };
  }

  if (nubosidad < 60 && probabilidadLluvia < 60) {
    return {
      valor: "PARCIALES",
      esDesfavorable: false,
      esParcial: true,
      descripcion:
        "Hay nubosidad parcial; las observaciones podrían verse interrumpidas.",
      recomendacion:
        "¡El evento sigue en pie! Combinaremos observación con explicaciones y talleres en sala.",
      mensajeLanding:
        "Cielo con nubosidad parcial. Los eventos continúan confirmados con actividades de apoyo bajo techo.",
      mensajeDocente:
        "Nubosidad parcial detectada en Medellín. Por favor mantén el evento activo y prepara una charla o dinámica de apoyo en sala si el cielo se cierra.",
      observatorioEstado: "ABIERTO",
      observatorioEstadoDesc:
        "Instalaciones abiertas. Actividades combinadas de observación y talleres en sala.",
    };
  }

  return {
    valor: "DESFAVORABLES",
    esDesfavorable: true,
    esParcial: false,
    descripcion:
      "El cielo está nublado o con probabilidad de lluvia para la observación telescópica.",
    recomendacion:
      "¡Los eventos no se cancelan! Adaptamos la jornada a charlas interactivas, talleres y experimentos en salas bajo techo.",
    mensajeLanding:
      "¡Los eventos no se cancelan por clima! Aunque las nubes no permitan el uso de telescopios, te esperamos para disfrutar de charlas interactivas y talleres astronómicos en nuestras salas.",
    mensajeDocente:
      "Aviso meteorológico para docentes: Las condiciones actuales en Medellín no son favorables para observación telescópica exterior (nubosidad o lluvia). Recuerda que la directriz del Observatorio ITM es NO cancelar el evento; te invitamos a dirigir la jornada en modalidad bajo techo (charlas, talleres o simulaciones en aula/auditorio).",
    observatorioEstado: "ABIERTO (ACTIVIDAD EN SALA)",
    observatorioEstadoDesc:
      "Instalaciones abiertas. Todos los eventos se realizan en salas y auditorios protegidos del clima.",
  };
}

export function useClima() {
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const consultar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(URL_CONSULTA);
      if (!respuesta.ok) {
        throw new Error("No fue posible consultar el clima.");
      }
      const datos = await respuesta.json();
      setClima(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    consultar();
  }, [consultar]);

  const codigo = clima?.current?.weather_code;
  const condiciones = calcularCondiciones(clima);

  const estado = {
    codigo,
    descripcion: codigo != null ? (CODIGOS_CLIMA[codigo]?.descripcion ?? "No disponible") : null,
    grupo: codigo != null ? (CODIGOS_CLIMA[codigo]?.grupo ?? "No disponible") : null,
    temperatura: clima?.current?.temperature_2m,
    humedad: clima?.current?.relative_humidity_2m,
    nubosidad: clima?.current?.cloud_cover,
    lluvia: clima?.current?.precipitation,
    maxHoy: clima?.daily?.temperature_2m_max?.[0],
    minHoy: clima?.daily?.temperature_2m_min?.[0],
    probabilidadLluviaHoy: clima?.daily?.precipitation_probability_max?.[0],
    pronostico: (clima?.daily?.time ?? []).map((fecha, i) => ({
      fecha,
      max: clima.daily.temperature_2m_max[i],
      min: clima.daily.temperature_2m_min[i],
      probabilidadLluvia: clima.daily.precipitation_probability_max[i],
      codigo: clima.daily.weather_code?.[i],
    })),
    observatorio: {
      estadoValor: condiciones.valor,
      estadoDescripcion: condiciones.descripcion,
      recomendacion: condiciones.recomendacion,
      mensajeLanding: condiciones.mensajeLanding,
      mensajeDocente: condiciones.mensajeDocente,
      observatorioEstado: condiciones.observatorioEstado,
      observatorioEstadoDesc: condiciones.observatorioEstadoDesc,
      esDesfavorable: condiciones.esDesfavorable,
      esParcial: condiciones.esParcial,
    },
  };

  return { clima, estado, cargando, error, consultar };
}