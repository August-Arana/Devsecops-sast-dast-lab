# Resumen de workflows

## `ci.yml` — CI
- **Trigger:** `push` y `pull_request` a `main` → se dispara automáticamente al subir el repo.
- **Qué hace:** instala dependencias Node, corre `npm test` y construye la imagen Docker de la app (`docker compose build app`).
- No incluye pasos de seguridad, es el pipeline "clásico" (build/test) previo a agregar SAST/DAST.

## `security.yml` — Security Checks
- **Trigger:** `push` y `pull_request` a `main` → también se dispara automáticamente al subir el repo.
- **Qué hace:** corre en paralelo 4 jobs independientes, cada uno sube su reporte como artifact:
  - **sast**: Semgrep con reglas custom sobre `app/`, exporta `semgrep-report.json`.
  - **secrets**: Gitleaks contra el repo, exporta `gitleaks-report.json`.
  - **sca**: `npm audit --audit-level=high` sobre `app/` (falla el job si hay vulnerabilidades altas).
  - **dast**: levanta la app con `docker compose up`, espera a que esté sana, corre ZAP baseline scan contra `http://127.0.0.1:3000` y sube reportes HTML/MD/JSON. Al final baja el contenedor.
- Ninguno de estos jobs bloquea el merge por sí solo salvo `sca` (npm audit) y posiblemente `sast`/`secrets` si encuentran hallazgos, según exit code de las herramientas.

## `security-gated-example.yml` — Security Gates Example
- **Trigger:** `workflow_dispatch` únicamente → **no se dispara con push**, solo manualmente desde la pestaña Actions de GitHub ("Run workflow").
- **Qué hace:** ejemplo didáctico de gates que bloquean el pipeline:
  - Semgrep con `--error` (falla el job si hay findings).
  - Gitleaks (falla si detecta secretos).
  - Paso de DAST es solo un `echo` ilustrativo, no ejecuta un scan real.
- Pensado para mostrar en clase cómo se vería un gate real de política, sin disparar solo.

## Para tu clase en vivo
Al hacer el primer push a `main`, **`ci.yml` y `security.yml` se disparan automáticamente** (incluye el DAST completo contra la app local en el runner, dentro de scope ético ya que es infra propia del runner). **`security-gated-example.yml` no se dispara solo** — hay que ejecutarlo manualmente vía `workflow_dispatch` cuando quieras mostrarlo.
