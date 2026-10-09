import { readFile } from "node:fs/promises";
import { GoogleAuth } from "google-auth-library";

export type Etiqueta = { producto: string; lote: string; vence: string };

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Convierte las filas de la pestaña (la primera es el encabezado) en etiquetas.
// Una columna que falte o una fila mala no tumba la página: se descarta.
export function parsearFilas(filas: string[][] | undefined): Etiqueta[] {
  if (!filas || filas.length === 0) return [];
  const encabezado = filas[0].map((c) => c.trim().toLowerCase());
  const iProducto = encabezado.indexOf("producto");
  const iLote = encabezado.indexOf("lote");
  const iVence = encabezado.indexOf("vence");
  if (iProducto < 0 || iLote < 0 || iVence < 0) return [];

  return filas.slice(1).flatMap((fila) => {
    const producto = fila[iProducto]?.trim();
    const lote = fila[iLote]?.trim();
    const vence = fila[iVence]?.trim();
    return producto && lote && vence && FECHA.test(vence) ? [{ producto, lote, vence }] : [];
  });
}

// Las fechas son AAAA-MM-DD: comparadas como texto ya quedan en orden cronológico.
export function ordenarPorFecha(etiquetas: Etiqueta[]): Etiqueta[] {
  return [...etiquetas].sort((a, b) => a.vence.localeCompare(b.vence));
}

async function leerHoja(): Promise<string[][] | undefined> {
  const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Faltan GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY");
  }
  const auth = new GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const token = await auth.getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(GOOGLE_SHEET_ID)}/values/etiquetas`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Sheets respondió ${res.status}`);
  return ((await res.json()) as { values?: string[][] }).values;
}

// En las pruebas, ETIQUETAS_SIMULADAS_ARCHIVO apunta a un JSON con las filas: nunca se toca la hoja real.
async function leerFilas(): Promise<string[][] | undefined> {
  const simulado = process.env.ETIQUETAS_SIMULADAS_ARCHIVO;
  if (simulado) return JSON.parse(await readFile(simulado, "utf8")) as string[][];
  return leerHoja();
}

export async function leerEtiquetas(): Promise<Etiqueta[]> {
  try {
    return ordenarPorFecha(parsearFilas(await leerFilas()));
  } catch (error) {
    console.error("No se pudo leer la pestaña etiquetas", error);
    return [];
  }
}
