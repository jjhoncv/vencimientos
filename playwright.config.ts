import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

// Los escenarios BDD (features/*.feature) son las pruebas E2E del alcance (ADR 0018).
// Un escenario sin pasos implementados se salta: cuenta en rojo en el % de avance, sin bloquear el CI.
const testDir = defineBddConfig({
  features: "features/**/*.feature",
  steps: "features/steps/**/*.ts",
  missingSteps: "skip-scenario",
});

// BASE_URL apunta a un ambiente publicado (smoke test); sin ella, se levanta el build local.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Los escenarios comparten los archivos de datos simulados: en paralelo se pisan.
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["list"], ["json", { outputFile: "test-results/resultados.json" }]]
    : [["list"], ["json", { outputFile: "test-results/resultados.json" }]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm start",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        // Fuente de datos simulada: nunca la hoja real.
        env: {
          ETIQUETAS_SIMULADAS_ARCHIVO: "test-results/etiquetas-simuladas.json",
          HOY_SIMULADO_ARCHIVO: "test-results/hoy-simulado.txt",
        },
      },
});
