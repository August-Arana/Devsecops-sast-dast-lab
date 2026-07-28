
## Orden sugerido para la clase

1. Mostrar la app vulnerable funcionando.
2. Ejecutar SAST y discutir hallazgos.
3. Ejecutar secret scanning y dependency scanning.
4. Construir la imagen y mostrar container scanning.
5. Ejecutar DAST con ZAP contra la app corriendo.
6. Abrir workflows de GitHub Actions.
7. Cerrar con quality gates: que bloquea PR, staging y produccion.

## Notas para el instructor

- La app esta vulnerable a proposito. No la uses como base de proyecto real.
- El primer objetivo no es arreglar todo, sino que los alumnos entiendan donde aparece cada tipo de control.
- DAST baseline de ZAP es pasivo: no intenta explotar agresivamente la app. Para clase es suficiente y mas seguro.
- En equipos reales, el valor no esta solo en escanear, sino en convertir findings en decisiones: bloquear, reportar, aceptar riesgo o crear excepcion temporal.
