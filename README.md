# DevSecOps SAST/DAST Lab

Clase practica de 2 horas: **Integrando seguridad al mundo DevOps: SAST y DAST**.

La demo usa una aplicacion Node.js + Express + SQLite vulnerable intencionalmente para mostrar como incorporar controles de seguridad en un pipeline CI/CD.

> Scope etico: todo esta pensado para correr localmente o en un repositorio propio de practica. No ejecutes DAST activo contra sistemas que no administras o para los que no tenes autorizacion explicita.

## Objetivo de la demo

Transformar este pipeline:

```text
commit -> build -> test -> deploy
```

en este flujo:

```text
commit -> build/test -> SAST -> secrets -> dependency scan -> container scan -> deploy staging -> DAST -> decision gate
```

## Stack

- App: Node.js + Express + SQLite.
- Runtime: Docker Compose.
- SAST: Semgrep con reglas custom.
- Secrets: Gitleaks.
- SCA/dependencias: npm audit.
- Container scan: Trivy.
- DAST: OWASP ZAP baseline scan.
- CI/CD: GitHub Actions.

## Requisitos locales

- Docker y Docker Compose.
- Git.
- curl.
- Opcional: Node.js 20+ y npm para correr tests/audit fuera de Docker.
- Opcional: jq para ver mejor algunos JSON.

## Quickstart local

```bash
./scripts/01-run-local.sh
```

Abrir:

```text
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/search?q=alice
http://localhost:3000/greet?name=Coderhouse
http://localhost:3000/debug
```

## Escaneos

```bash
# SAST con Semgrep
./scripts/02-run-sast.sh

# Secret scanning con Gitleaks
./scripts/03-run-secrets.sh

# Dependency scanning con npm audit
./scripts/04-run-dependency-audit.sh

# Container image scanning con Trivy
./scripts/05-run-container-scan.sh

# DAST con OWASP ZAP baseline
./scripts/06-run-dast-baseline.sh

# Ataques manuales controlados contra la app local
./scripts/07-manual-attacks.sh

# Limpieza
./scripts/08-cleanup.sh
```

Los reportes quedan en:

```text
security/reports/
```

## Vulnerabilidades intencionales

| Capa | Ejemplo | Archivo / endpoint |
|---|---|---|
| SAST | SQL Injection por concatenacion | `app/src/db.js`, `/search?q=` |
| SAST/DAST/manual | Reflected XSS | `app/src/server.js`, `/greet?name=` |
| Secrets | Secret hardcodeado | `app/src/secrets.js` |
| SCA | Dependencias viejas | `app/package.json` |
| DAST | Headers de seguridad ausentes | HTTP responses |
| DAST/manual | Open redirect | `/redirect?url=` |
| Runtime exposure | Debug endpoint | `/debug` |
| Container | Imagen corre como root | `app/Dockerfile` |

## GitHub Actions

Los workflows ya estan incluidos en:

```text
.github/workflows/
├── ci.yml
├── security.yml
└── security-gated-example.yml
```

Para verlos corriendo de verdad, crea un repositorio propio y subilo:

```bash
git init
git add .
git commit -m "devsecops sast dast lab"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/devsecops-sast-dast-lab.git
git push -u origin main
```

No es obligatorio usar GitHub para explicar la clase: los scripts locales alcanzan para hacer la demo completa. GitHub Actions sirve para mostrar como quedaria en un pipeline real.

