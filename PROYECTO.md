# Vencimientos

> El título de arriba (`# ...`) es el nombre que muestra la página en producción.
> Este documento es el alcance congelado. Lo que no esté aquí va al **Parking lot**.

## 1. Problema

A quien administra un almacén chico se le vencen etiquetas o lotes sin darse cuenta: la hoja donde los anota tiene muchas filas y nadie la revisa todos los días.

## 2. Qué es

Una página que lee las etiquetas de una hoja de Google y muestra, ordenadas por fecha, cuáles vencen pronto y cuáles ya vencieron.

## 3. Qué NO es

- No es un inventario: no lleva stock, entradas ni salidas.
- No se editan etiquetas desde la página: la hoja es el administrador.
- No manda avisos por correo ni por mensaje (Parking lot).

## 4. Valor

Con abrir una página se sabe qué vence esta semana, sin revisar la hoja a mano.

## 5. Cómo sé que funcionó

En **2 semanas**, la página muestra bien las etiquetas de la hoja y marca en rojo **todas** las que vencen en los próximos 7 días, sin revisar la hoja a mano. Además (es la prueba de punta a punta del Guardián, T6): el proyecto aparece solo en el tablero del Guardián y su dueño recibe sus avisos por Telegram.

## 6. Límites

- **Semanas:** 2
- **Tipo:** prueba / MVP rápido. Lo más simple que funcione; nada de base de datos ni panel.
- **Cuentas que se van a pedir:** una hoja de Google con la pestaña `etiquetas` y una service account de **solo lectura** (como en Vitrina).

## 7. Fases

### Fase 1 — Lista de etiquetas
- La portada lee la pestaña `etiquetas` (producto, lote, vence) y la muestra ordenada por fecha de vencimiento.

**Valor:** se ven todas las etiquetas en un solo lugar, ordenadas.

### Fase 2 — Las que vencen
- Las que vencen en 7 días o menos salen en rojo; las vencidas, en gris; arriba, un contador («3 vencen esta semana»).

**Valor:** de un vistazo se sabe qué atender esta semana.

## 8. Criterios de aceptación

```gherkin
# Fase 1
Escenario: Ver las etiquetas
  Dado que la hoja tiene las etiquetas "Yogur lote A" que vence el 2026-10-20 y "Queso lote B" que vence el 2026-10-12
  Cuando entro a la portada
  Entonces veo las dos etiquetas con su producto, lote y fecha de vencimiento

Escenario: Ordenadas por fecha
  Dado que la hoja tiene "Yogur lote A" que vence el 2026-10-20 y "Queso lote B" que vence el 2026-10-12
  Cuando entro a la portada
  Entonces "Queso lote B" aparece antes que "Yogur lote A"

Escenario: Hoja vacía
  Dado que la hoja no tiene etiquetas
  Cuando entro a la portada
  Entonces veo "No hay etiquetas cargadas"

# Fase 2
Escenario: Las que vencen esta semana, en rojo
  Dado que hoy es 2026-10-10 y "Queso lote B" vence el 2026-10-12
  Cuando entro a la portada
  Entonces "Queso lote B" aparece marcada como "vence pronto"

Escenario: Las vencidas, en gris
  Dado que hoy es 2026-10-10 y "Leche lote C" venció el 2026-10-08
  Cuando entro a la portada
  Entonces "Leche lote C" aparece marcada como "vencida"

Escenario: Contador de la semana
  Dado que hoy es 2026-10-10 y 3 etiquetas vencen en los próximos 7 días
  Cuando entro a la portada
  Entonces veo "3 vencen esta semana"
```

## 9. Parking lot

- Avisos por correo o mensaje de las que vencen (2026-10-08): primero validar que la página sirve.
- Varios almacenes (2026-10-08): la prueba es con uno solo.
- Editar las etiquetas desde la página (2026-10-08): la hoja es el administrador.

## 10. Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-08 | Nombre: Vencimientos | Corto y dice lo que hace |
| 2026-10-08 | Datos en una hoja de Google, sin base de datos | Es una prueba y el dueño ya anota ahí |
| 2026-10-08 | Proyecto de prueba de punta a punta del Guardián (T6, guardian#187) | Confirmar que un proyecto nuevo nace con todo el seguimiento |
