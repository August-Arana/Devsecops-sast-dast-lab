# Quality gates para DevSecOps

Un quality gate es una politica automatizada que decide si un cambio puede avanzar o no.

## Politica sugerida para equipos reales

| Riesgo | PR | Main | Staging | Produccion |
|---|---:|---:|---:|---:|
| Secret detectado | Bloquea | Bloquea | Bloquea | Incidente |
| SAST critical/high | Bloquea | Bloquea | Bloquea | Excepcion aprobada |
| SAST medium | Reporta | Reporta | Reporta | Backlog |
| Dependencia critical explotable | Bloquea | Bloquea | Bloquea | Excepcion aprobada |
| Container critical | Reporta/Bloquea | Bloquea | Bloquea | Excepcion aprobada |
| DAST high | N/A | N/A | Bloquea | Bloquea deploy |
| DAST medium/low | N/A | N/A | Reporta | Backlog |

## Reglas practicas

1. No bloquees todo desde el primer dia.
2. Crea baseline inicial si el proyecto ya existe.
3. Bloquea nuevos problemas antes de exigir deuda historica cero.
4. Separa severidad tecnica de riesgo real.
5. Toda excepcion debe tener owner, fecha de expiracion y motivo.
6. Los reportes sin ownership se convierten en ruido.

## Ejemplo de madurez gradual

### Semana 1

- SAST y DAST generan reportes.
- Nadie bloquea deploys todavia.

### Semana 2-3

- Bloqueo de secrets.
- Bloqueo de SAST critical.

### Semana 4+

- Bloqueo de SAST high nuevo.
- DAST high bloquea deploy a produccion.
- Se crea backlog de medium/low.
