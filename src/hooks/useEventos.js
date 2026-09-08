import { useMemo, useState } from "react";

const EVENTOS_POR_PAGINA = 4;
const CLAVE_A_ESTADO = {
  publicado: "publicado",
  borrador: "borrador",
  cancelado: "cancelado",
};

export function useEventos(listaEventos) {
  const [pestañaActiva, setPestañaActiva] = useState("publicado");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const eventosFiltrados = useMemo(() => {
    const estadoActivo = CLAVE_A_ESTADO[pestañaActiva];
    return listaEventos.filter((evento) => {
      const coincideEstado = estadoActivo
        ? evento.estado === estadoActivo
        : true;
      const coincideBusqueda = evento.titulo
        .toLowerCase()
        .includes(valorBusqueda.toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
  }, [listaEventos, valorBusqueda, pestañaActiva]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(eventosFiltrados.length / EVENTOS_POR_PAGINA)
  );

  const eventosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * EVENTOS_POR_PAGINA;
    return eventosFiltrados.slice(inicio, inicio + EVENTOS_POR_PAGINA);
  }, [eventosFiltrados, paginaActual]);

  const cambiarBusqueda = (texto) => {
    setValorBusqueda(texto);
    setPaginaActual(1);
  };

  const cambiarPestaña = (clave) => {
    setPestañaActiva(clave);
    setPaginaActual(1);
  };

  return {
    pestañaActiva,
    cambiarPestaña,
    valorBusqueda,
    cambiarBusqueda,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    eventosPagina,
  };
}