import { expect, it } from "vitest";
import { vencePronto } from "./vencimiento";

it("vence pronto si faltan 7 días o menos", () => {
  expect(vencePronto("2026-10-12", "2026-10-10")).toBe(true);
  expect(vencePronto("2026-10-17", "2026-10-10")).toBe(true);
  expect(vencePronto("2026-10-10", "2026-10-10")).toBe(true);
});

it("no vence pronto si faltan más de 7 días", () => {
  expect(vencePronto("2026-10-18", "2026-10-10")).toBe(false);
});

it("una ya vencida no es «vence pronto»", () => {
  expect(vencePronto("2026-10-08", "2026-10-10")).toBe(false);
});

it("cuenta bien al cruzar de mes", () => {
  expect(vencePronto("2026-11-03", "2026-10-30")).toBe(true);
});
