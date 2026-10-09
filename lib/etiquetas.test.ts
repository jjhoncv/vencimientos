import { describe, expect, it } from "vitest";
import { parsearFilas } from "@/lib/etiquetas";

describe("parsearFilas", () => {
  it("convierte filas producto | lote | vence en etiquetas", () => {
    const filas = [
      ["producto", "lote", "vence"],
      ["Yogur", "lote A", "2026-10-20"],
      ["Queso", "lote B", "2026-10-12"],
    ];
    expect(parsearFilas(filas)).toEqual([
      { producto: "Yogur", lote: "lote A", vence: "2026-10-20" },
      { producto: "Queso", lote: "lote B", vence: "2026-10-12" },
    ]);
  });

  it("encuentra las columnas por encabezado, en cualquier orden", () => {
    const filas = [
      ["vence", "producto", "lote"],
      ["2026-10-20", "Yogur", "lote A"],
    ];
    expect(parsearFilas(filas)).toEqual([{ producto: "Yogur", lote: "lote A", vence: "2026-10-20" }]);
  });

  it("devuelve lista vacía si falta una columna", () => {
    expect(parsearFilas([["producto", "lote"], ["Yogur", "lote A"]])).toEqual([]);
  });

  it("devuelve lista vacía si no hay datos", () => {
    expect(parsearFilas(undefined)).toEqual([]);
    expect(parsearFilas([])).toEqual([]);
  });

  it("ignora filas incompletas o con fecha inválida", () => {
    const filas = [
      ["producto", "lote", "vence"],
      ["Yogur", "lote A"],
      ["Queso", "lote B", "mañana"],
      ["", "", ""],
      ["Leche", "lote C", "2026-10-08"],
    ];
    expect(parsearFilas(filas)).toEqual([{ producto: "Leche", lote: "lote C", vence: "2026-10-08" }]);
  });
});
