import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

// Fuente de datos simulada: el servidor de pruebas lee este archivo (playwright.config.ts), nunca la hoja real.
const ARCHIVO_SIMULADO = "test-results/etiquetas-simuladas.json";

function hojaCon(filas: string[][]) {
  mkdirSync(dirname(ARCHIVO_SIMULADO), { recursive: true });
  writeFileSync(ARCHIVO_SIMULADO, JSON.stringify([["producto", "lote", "vence"], ...filas]));
}

// "Yogur lote A" → ["Yogur", "lote A"]
function separar(texto: string) {
  const i = texto.indexOf(" ");
  return [texto.slice(0, i), texto.slice(i + 1)];
}

Given(
  "que la hoja tiene las etiquetas {string} que vence el {word} y {string} que vence el {word}",
  async ({}, a: string, fechaA: string, b: string, fechaB: string) => {
    hojaCon([
      [...separar(a), fechaA],
      [...separar(b), fechaB],
    ]);
  },
);

Given(
  "que la hoja tiene {string} que vence el {word} y {string} que vence el {word}",
  async ({}, a: string, fechaA: string, b: string, fechaB: string) => {
    hojaCon([
      [...separar(a), fechaA],
      [...separar(b), fechaB],
    ]);
  },
);

Given("que la hoja no tiene etiquetas", async () => {
  hojaCon([]);
});

// Fecha de «hoy» simulada: el servidor de pruebas la lee de este archivo (playwright.config.ts).
const ARCHIVO_HOY = "test-results/hoy-simulado.txt";

Given("que hoy es {word} y {string} vence el {word}", async ({}, hoy: string, nombre: string, vence: string) => {
  hojaCon([[...separar(nombre), vence]]);
  writeFileSync(ARCHIVO_HOY, hoy);
});

Given("que hoy es {word} y {string} venció el {word}", async ({}, hoy: string, nombre: string, vence: string) => {
  hojaCon([[...separar(nombre), vence]]);
  writeFileSync(ARCHIVO_HOY, hoy);
});

Then("{string} aparece marcada como {string}", async ({ page }, nombre: string, marca: string) => {
  const [producto, lote] = separar(nombre);
  const item = page.getByRole("listitem").filter({ hasText: producto }).filter({ hasText: lote });
  await expect(item).toContainText(marca);
});

When("entro a la portada", async ({ page }) => {
  await page.goto("/");
});

Then("{string} aparece antes que {string}", async ({ page }, primero: string, segundo: string) => {
  const items = await page.getByRole("list", { name: "Etiquetas" }).getByRole("listitem").allTextContents();
  const posicion = (nombre: string) => {
    const [producto, lote] = separar(nombre);
    return items.findIndex((t) => t.includes(producto) && t.includes(lote));
  };
  expect(posicion(primero)).toBeGreaterThanOrEqual(0);
  expect(posicion(segundo)).toBeGreaterThanOrEqual(0);
  expect(posicion(primero)).toBeLessThan(posicion(segundo));
});

Then("veo {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
});

Then("veo las dos etiquetas con su producto, lote y fecha de vencimiento", async ({ page }) => {
  const lista = page.getByRole("list", { name: "Etiquetas" });
  await expect(lista.getByRole("listitem")).toHaveCount(2);
  await expect(lista).toContainText("Yogur · lote A · vence 2026-10-20");
  await expect(lista).toContainText("Queso · lote B · vence 2026-10-12");
});
