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

When("entro a la portada", async ({ page }) => {
  await page.goto("/");
});

Then("veo las dos etiquetas con su producto, lote y fecha de vencimiento", async ({ page }) => {
  const lista = page.getByRole("list", { name: "Etiquetas" });
  await expect(lista.getByRole("listitem")).toHaveCount(2);
  await expect(lista).toContainText("Yogur · lote A · vence 2026-10-20");
  await expect(lista).toContainText("Queso · lote B · vence 2026-10-12");
});
