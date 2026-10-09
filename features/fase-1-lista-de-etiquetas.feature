# language: es
Característica: Lista de etiquetas
  La portada lee la pestaña "etiquetas" (producto, lote, vence) y la muestra ordenada por fecha de vencimiento.

  @fase-1
  Escenario: Ver las etiquetas
    Dado que la hoja tiene las etiquetas "Yogur lote A" que vence el 2026-10-20 y "Queso lote B" que vence el 2026-10-12
    Cuando entro a la portada
    Entonces veo las dos etiquetas con su producto, lote y fecha de vencimiento

  @fase-1
  Escenario: Ordenadas por fecha
    Dado que la hoja tiene "Yogur lote A" que vence el 2026-10-20 y "Queso lote B" que vence el 2026-10-12
    Cuando entro a la portada
    Entonces "Queso lote B" aparece antes que "Yogur lote A"

  @fase-1
  Escenario: Hoja vacía
    Dado que la hoja no tiene etiquetas
    Cuando entro a la portada
    Entonces veo "No hay etiquetas cargadas"
