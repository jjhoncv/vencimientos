// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/lib/etiquetas", () => ({
  leerEtiquetas: async () => [
    { producto: "Yogur", lote: "lote A", vence: "2026-10-20" },
    { producto: "Queso", lote: "lote B", vence: "2026-10-12" },
  ],
}));

// E1 — Proyecto nuevo en producción el día 1: la página muestra el nombre del PROYECTO.md,
// sea cual sea (la plantilla no puede fijar un nombre).
it("muestra como título principal el # título de PROYECTO.md", async () => {
  const titulo = readFileSync("PROYECTO.md", "utf8").match(/^#[ \t]+(.+?)[ \t]*$/m)?.[1];
  render(await Page());
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(titulo);
});

it("lista cada etiqueta con producto, lote y fecha de vencimiento", async () => {
  render(await Page());
  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toContain("Yogur · lote A · vence 2026-10-20");
  expect(items).toContain("Queso · lote B · vence 2026-10-12");
});
