import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { leerEtiquetas } from "@/lib/etiquetas";
import { leerHoy } from "@/lib/hoy";
import { estaVencida, vencePronto } from "@/lib/vencimiento";

// La hoja cambia sin deploy: se lee en cada visita.
export const dynamic = "force-dynamic";

export default async function Page() {
  const etiquetas = await leerEtiquetas();
  const hoy = await leerHoy();
  return (
    <main>
      <h1>{leerNombreDelProyecto()}</h1>
      {etiquetas.length === 0 ? (
        <p>No hay etiquetas cargadas</p>
      ) : (
        <ul aria-label="Etiquetas">
          {etiquetas.map((e) => (
            <li
              key={`${e.producto}|${e.lote}|${e.vence}`}
              style={
                vencePronto(e.vence, hoy) ? { color: "red" } : estaVencida(e.vence, hoy) ? { color: "gray" } : undefined
              }
            >
              <strong>{e.producto}</strong> · {e.lote} · vence {e.vence}
              {vencePronto(e.vence, hoy) && <span> · vence pronto</span>}
              {estaVencida(e.vence, hoy) && <span> · vencida</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
