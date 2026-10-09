import { afterEach, expect, it, vi } from "vitest";
import { leerHoy } from "./hoy";

afterEach(() => vi.useRealTimers());

it("usa la fecha de Lima aunque en UTC ya sea mañana", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-09T03:30:00Z")); // 22:30 del 8 en Lima
  expect(await leerHoy()).toBe("2026-10-08");
});
