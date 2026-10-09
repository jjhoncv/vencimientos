const DIA_MS = 24 * 60 * 60 * 1000;

function aUTC(fecha: string): number {
  const [a, m, d] = fecha.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

// Vencida: la fecha es anterior a hoy (la que vence hoy aún cuenta como «vence pronto»).
export function estaVencida(vence: string, hoy: string): boolean {
  return aUTC(vence) < aUTC(hoy);
}

// Fechas AAAA-MM-DD. Vence pronto: faltan de 0 a 7 días (las ya vencidas son otro caso).
export function vencePronto(vence: string, hoy: string): boolean {
  const dias = Math.round((aUTC(vence) - aUTC(hoy)) / DIA_MS);
  return dias >= 0 && dias <= 7;
}
