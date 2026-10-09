# language: es
Característica: Las que vencen
  Las que vencen en 7 días o menos salen en rojo; las vencidas, en gris; arriba, un contador.

  @fase-2
  Escenario: Las que vencen esta semana, en rojo
    Dado que hoy es 2026-10-10 y "Queso lote B" vence el 2026-10-12
    Cuando entro a la portada
    Entonces "Queso lote B" aparece marcada como "vence pronto"

  @fase-2
  Escenario: Las vencidas, en gris
    Dado que hoy es 2026-10-10 y "Leche lote C" venció el 2026-10-08
    Cuando entro a la portada
    Entonces "Leche lote C" aparece marcada como "vencida"

  @fase-2
  Escenario: Contador de la semana
    Dado que hoy es 2026-10-10 y 3 etiquetas vencen en los próximos 7 días
    Cuando entro a la portada
    Entonces veo "3 vencen esta semana"
