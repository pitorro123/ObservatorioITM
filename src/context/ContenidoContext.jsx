import { createContext, useContext, useState } from "react";
import { contenidoSemillero, contenidoObservatorio } from "../data/observatorio.js";

const ContenidoContext = createContext(null);

export function ContenidoProvider({ children }) {
  const [semillero, setSemillero] = useState(contenidoSemillero);
  const [observatorio, setObservatorio] = useState(contenidoObservatorio);

  const guardarSemillero = ({ titulo, descripcion, objetivos, comoParticipar }) => {
    setSemillero({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      objetivos: objetivos
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
      comoParticipar: comoParticipar.trim(),
    });
    return { exito: true };
  };

  const guardarObservatorio = ({ titulo, descripcion, trayectoria, mision, vision }) => {
    setObservatorio({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      trayectoria: trayectoria
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      mision: mision.trim(),
      vision: vision.trim(),
    });
    return { exito: true };
  };

  const value = {
    semillero,
    observatorio,
    guardarSemillero,
    guardarObservatorio,
  };

  return <ContenidoContext.Provider value={value}>{children}</ContenidoContext.Provider>;
}

export function useContenido() {
  const context = useContext(ContenidoContext);
  if (!context) {
    throw new Error("useContenido debe usarse dentro de ContenidoProvider");
  }
  return context;
}