import { leerNombreDelProyecto } from "@/lib/nombre-proyecto";
import { leerEtiquetas } from "@/lib/etiquetas";

// La hoja cambia sin deploy: se lee en cada visita.
export const dynamic = "force-dynamic";

export default async function Page() {
  const etiquetas = await leerEtiquetas();
  return (
    <main>
      <h1>{leerNombreDelProyecto()}</h1>
      <ul aria-label="Etiquetas">
        {etiquetas.map((e) => (
          <li key={`${e.producto}|${e.lote}|${e.vence}`}>
            <strong>{e.producto}</strong> · {e.lote} · vence {e.vence}
          </li>
        ))}
      </ul>
    </main>
  );
}
