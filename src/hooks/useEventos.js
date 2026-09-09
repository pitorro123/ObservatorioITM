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
  const [filtroMesActivo, setFiltroMesActivo] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const mesActual = new Date().toISOString().slice(0, 7);

  const eventosFiltrados = useMemo(() => {
    const estadoActivo = CLAVE_A_ESTADO[pestañaActiva];
    return listaEventos.filter((evento) => {
      const coincideEstado = estadoActivo
        ? evento.estado === estadoActivo
        : true;
      const coincideMes = filtroMesActivo
        ? evento.fecha.slice(0, 7) === mesActual
        : true;
      const coincideBusqueda = evento.titulo
        .toLowerCase()
        .includes(valorBusqueda.toLowerCase());
      return coincideEstado && coincideMes && coincideBusqueda;
    });
  }, [listaEventos, valorBusqueda, pestañaActiva, filtroMesActivo, mesActual]);

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

  const cambiarFiltroMes = () => {
    setFiltroMesActivo((prev) => !prev);
    setPaginaActual(1);
  };

  return {
    pestañaActiva,
    cambiarPestaña,
    valorBusqueda,
    cambiarBusqueda,
    filtroMesActivo,
    cambiarFiltroMes,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    eventosPagina,
  };
}