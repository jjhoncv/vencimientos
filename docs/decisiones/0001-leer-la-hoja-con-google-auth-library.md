# 0001. Leer la hoja con google-auth-library y una fuente simulada en pruebas

- **Fecha:** 2026-10-09
- **Estado:** Aceptada

## Contexto

La portada lee la pestaña `etiquetas` con una service account de solo lectura. Eso exige firmar un JWT y pedir un token OAuth a Google. Las pruebas no deben tocar la hoja real.

## Decisión

- Dependencia `google-auth-library` (oficial de Google) solo para obtener el token; la lectura va con `fetch` a la API de Sheets (scope `spreadsheets.readonly`).
- Si existe `ETIQUETAS_SIMULADAS_ARCHIVO`, las filas salen de ese JSON y no de Google. Solo la define el servidor de pruebas E2E.
- Si falta la pestaña, una columna o una variable, o Google falla: `console.error` y lista vacía; la página no se cae.

## Por qué

No se reimplementa criptografía (`docs/lecciones.md`). Una variable de entorno evita una capa de inyección más pesada para un MVP.
