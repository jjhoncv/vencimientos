# Vencimientos

[![CI](https://github.com/jjhoncv/vencimientos/actions/workflows/ci.yml/badge.svg)](https://github.com/jjhoncv/vencimientos/actions/workflows/ci.yml)
[![Deploy](https://github.com/jjhoncv/vencimientos/actions/workflows/deploy.yml/badge.svg)](https://github.com/jjhoncv/vencimientos/actions/workflows/deploy.yml)
[![Release](https://github.com/jjhoncv/vencimientos/actions/workflows/release.yml/badge.svg)](https://github.com/jjhoncv/vencimientos/actions/workflows/release.yml)
[![Fase](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/vencimientos/estado/fase.json)](https://github.com/jjhoncv/vencimientos/milestones)
[![Avance](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/vencimientos/estado/avance.json)](https://github.com/jjhoncv/vencimientos/actions/workflows/ci.yml)
[![Salud](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jjhoncv/vencimientos/estado/salud.json)](https://github.com/jjhoncv/vencimientos/actions/workflows/estado.yml)

Una página que lee las etiquetas de una hoja de Google y muestra, ordenadas por fecha, cuáles vencen pronto y cuáles ya vencieron.

- **Fase, avance y salud:** los badges de arriba se actualizan solos en cada merge y una vez al día (🟢 al día · 🟡 atraso corto o un PR te espera · 🔴 atraso largo o `main` en rojo · ⚫ 14 días sin actividad). Requieren repo público; si es privado, mira el Sheet del Guardián
- **Staging:** https://staging--vencimientos-jjhoncv.netlify.app
- **Producción:** https://vencimientos-jjhoncv.netlify.app
- **Alcance:** [`PROYECTO.md`](PROYECTO.md) · **Decisiones:** [`docs/decisiones/`](docs/decisiones/README.md) · **Tablero:** pestaña *Projects* del repo

Creado con **[Guardián](https://github.com/jjhoncv/guardian)** v0.16.0: alcance fijo, producción desde el día 1, tareas chicas que el dueño aprueba. Los workflows de `.github/workflows/` son llamadas cortas a los del Guardián; el pipeline vive allí.

## Empezar

1. Abre Claude Code en este repo y corre **`/guardian`** (estado y siguiente paso) y **`/guardian-planificar`**: convierte el alcance de `PROYECTO.md` en escenarios BDD (en rojo) y un plan de tareas, y abre un PR.
2. Revisa y fusiona ese PR: se crean los tickets (uno por tarea) y entran al tablero.
3. Cada ticket → rama → PR chico → preview → merge → staging. Releases con tu aprobación → producción.

## Cómo fluye un cambio

```
Issue (escenario BDD) → rama feat/N-slug → PR chico → CI + preview pr-N
  → squash merge (dueño) → staging
  → PR de release (release-please) → merge (dueño) → aprobación del Environment (dueño) → producción → smoke test
```

Rollback: **automático** si falla el smoke test después de un release (abre un issue `alerta`). A mano: en Netlify, *Deploys* → deploy anterior de producción → *Publish deploy*.

## Mantenimiento

| Secreto | Si vence | Renovar |
|---|---|---|
| `RELEASE_PLEASE_TOKEN` (90 días) | No se abre ni actualiza el PR de release | Nuevo PAT fine-grained (solo este repo; Contents y Pull requests en *Read and write*) → `gh secret set RELEASE_PLEASE_TOKEN -R jjhoncv/vencimientos` |
| `NETLIFY_AUTH_TOKEN` | Fallan preview, staging y producción | Nuevo token en Netlify → `gh secret set NETLIFY_AUTH_TOKEN -R jjhoncv/vencimientos` |

Mejoras del Guardián: Dependabot propone subir la versión en `.github/workflows/` (`jjhoncv/guardian/...@vX.Y.Z`).

## Desarrollo local

```sh
nvm use        # Node 24 (.nvmrc)
npm ci
npm run dev    # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
npm run e2e    # escenarios BDD en Chrome (el % de avance lo publica el CI)
```
