# Guia para alumnos - DevSecOps SAST/DAST

## Que deberias entender al terminar

- Que problema resuelve DevSecOps.
- Diferencia practica entre SAST y DAST.
- Como se integran herramientas de seguridad en CI/CD.
- Por que no alcanza con ejecutar scanners si no hay decisiones de quality gate.

## Definiciones operativas

### SAST

Static Application Security Testing. Analiza codigo fuente o artefactos sin ejecutar la aplicacion.

Sirve para encontrar problemas temprano:

- SQL injection por construccion insegura de queries.
- XSS por interpolacion insegura.
- secretos hardcodeados.
- patrones inseguros del framework.

### DAST

Dynamic Application Security Testing. Analiza una aplicacion en ejecucion desde afuera.

Sirve para encontrar problemas visibles en runtime:

- headers de seguridad ausentes;
- cookies inseguras;
- endpoints expuestos;
- configuraciones HTTP debiles;
- comportamiento inseguro de la app desplegada.

## SAST vs DAST

| Dimension | SAST | DAST |
|---|---|---|
| Necesita app corriendo | No | Si |
| Momento ideal | Pull request / CI temprano | Staging / pre-produccion |
| Mira | Codigo | Runtime HTTP |
| Fortalezas | Feedback temprano | Valida exposicion real |
| Debilidades | Falsos positivos / no ve configuracion runtime | Puede no llegar a rutas internas / necesita entorno |

## Comandos principales

```bash
./scripts/01-run-local.sh
./scripts/02-run-sast.sh
./scripts/03-run-secrets.sh
./scripts/04-run-dependency-audit.sh
./scripts/05-run-container-scan.sh
./scripts/06-run-dast-baseline.sh
```

## Preguntas para pensar

1. Que hallazgos deberian bloquear un Pull Request?
2. Que hallazgos deberian bloquear un deploy a produccion?
3. Que hallazgos pueden quedar como deuda tecnica?
4. Que equipo deberia ser owner de cada hallazgo?
5. Como evitarias que el pipeline se vuelva lento o ruidoso?
