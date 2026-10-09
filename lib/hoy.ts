import { readFile } from "node:fs/promises";

// En las pruebas, HOY_SIMULADO_ARCHIVO apunta a un archivo con la fecha de «hoy» (AAAA-MM-DD).
export async function leerHoy(): Promise<string> {
  const simulado = process.env.HOY_SIMULADO_ARCHIVO;
  if (simulado) {
    try {
      const fecha = (await readFile(simulado, "utf8")).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    } catch {
      // sin archivo: se usa la fecha real
    }
  }
  // La fecha de Lima, no la UTC del servidor: de 19:00 a 24:00 en Lima, en UTC ya es mañana.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}
