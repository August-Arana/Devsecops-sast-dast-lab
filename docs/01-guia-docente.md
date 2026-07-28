# Guia docente - DevSecOps SAST/DAST Lab

## Objetivo didactico

Que los alumnos vean una integracion realista de seguridad dentro de un flujo DevOps:

- codigo vulnerable;
- build y test;
- SAST;
- secret scanning;
- dependency scanning;
- container scanning;
- DAST contra una app corriendo;
- criterios de quality gate.

## Narrativa de la clase

La clase funciona mejor si no arrancas listando definiciones. Arranca con una pregunta:

> Si este pipeline compila, testea y despliega correctamente, ¿significa que es seguro?

La respuesta que la demo va construyendo es: no. El pipeline tradicional valida funcionalidad y empaquetado, pero no necesariamente valida exposicion, secretos, dependencias, configuracion runtime ni patrones de codigo peligrosos.

## Agenda para 2 horas

### 0-10 min - Apertura

- Pipeline tradicional vs pipeline DevSecOps.
- Seguridad como feedback automatizado, no como auditoria final.
- Diferencia inicial: SAST mira codigo; DAST mira la app corriendo.

### 10-25 min - App vulnerable

Comandos:

```bash
./scripts/01-run-local.sh
```

Mostrar:

```text
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/search?q=alice
http://localhost:3000/greet?name=Coderhouse
http://localhost:3000/debug
```

Idea clave: la app funciona. El problema es que funcional no es igual a seguro.

### 25-45 min - SAST con Semgrep

Comando:

```bash
./scripts/02-run-sast.sh
```

Mostrar:

- `security/semgrep-rules.yml`
- `app/src/db.js`
- `app/src/server.js`
- `app/src/secrets.js`

Puntos a explicar:

- SAST no necesita levantar la app.
- SAST encuentra patrones peligrosos temprano.
- Puede tener falsos positivos.
- Sirve muy bien en pull requests.

### 45-60 min - Secrets y dependencias

Comandos:

```bash
./scripts/03-run-secrets.sh
./scripts/04-run-dependency-audit.sh
```

Punto clave:

> SAST no es todo DevSecOps. Es una capa dentro de un set de controles.

### 60-75 min - Container scan

Comando:

```bash
./scripts/05-run-container-scan.sh
```

Mostrar:

- `app/Dockerfile`
- La diferencia entre vulnerabilidad de codigo, dependencia e imagen.

### 75-100 min - DAST con OWASP ZAP

Comando:

```bash
./scripts/06-run-dast-baseline.sh
```

Mostrar reportes:

```text
security/reports/zap-baseline-report.html
security/reports/zap-baseline-report.md
security/reports/zap-baseline-report.json
```

Puntos a explicar:

- DAST necesita la aplicacion corriendo.
- DAST ve HTTP, headers, cookies, rutas, comportamiento runtime.
- ZAP baseline es pasivo; no es lo mismo que un active scan.
- DAST no sabe necesariamente que hay dentro del codigo.

### 100-115 min - CI/CD y quality gates

Mostrar:

```text
.github/workflows/ci.yml
.github/workflows/security.yml
.github/workflows/security-gated-example.yml
```

Discutir politica:

| Etapa | Control | Gate sugerido |
|---|---|---|
| Pull Request | Secrets | Bloquear siempre |
| Pull Request | SAST critical/high | Bloquear |
| Pull Request | SAST medium/low | Reportar |
| CI | SCA critical/high explotable | Bloquear o requerir aprobacion |
| Build | Container critical/high | Bloquear antes de deploy |
| Staging | DAST high | Bloquear deploy |
| Produccion | Monitoreo | Alertar y abrir incidente |

### 115-120 min - Cierre

Mensaje final:

> DevSecOps no es instalar herramientas. Es disenar feedback de seguridad temprano, automatizado y accionable.

## Errores esperables

### Docker no levanta la app

```bash
docker compose logs app
```

### Puerto ocupado

Cambiar `3000:3000` por otro puerto en `docker-compose.yml`, por ejemplo `3001:3000`.

### ZAP no llega a la app

Verificar red:

```bash
docker network ls | grep devsecopslab
```

Alternativa local:

```bash
docker run --rm --network host ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://127.0.0.1:3000 -I
```

### npm audit no muestra lo esperado

Ejecutar primero:

```bash
cd app
npm install
npm audit --audit-level=high
```
