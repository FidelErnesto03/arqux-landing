# Misión 0 — Baseline y discrepancias
## CYCLE-02 · ARQUX-WEB-DISCURSO-001 · Ejecutada por Alfred (SES005)

**Fecha:** 2026-11-22 · **Base:** `preliminar-b` @ `f4ecb7f` · árbol limpio · suite verde (779 checks / 0 fallos, última corrida SES004)
**Directriz:** `docs/manifesto-arqux-web-discurso-001.md` · Matriz previa: `docs/analisis-discursivo-v8.md` (Jarvis APROBADO / Heimdall OBSERVADO)
**Alcance M0:** inventario sin modificar el sitio. Salida: afirmaciones y discrepancias.

---

## 1. Estado del prototipo

- Rama `preliminar-b`, HEAD `f4ecb7f`, working tree limpio, 0 archivos sin commitear.
- 4 páginas × 2 idiomas íntegras: `/`, `/es/`, `/reference/`, `/es/referencia/`, `/start/`, `/es/empezar/`, `/trust/`, `/es/confianza/`.
- Tags `preliminar-A`…`preliminar-B.21`; sin merge a main ni publicación.
- Versión citada en todo el sitio: **ArqUX 1.0.0**, commit fijado `390333913e0f071a89241187f36cc90289e7e043`, verificado 2026-11-20; PyPI servía 0.9.0 en esa observación. Codec: `codec_cortex 1.0.2-rc.1` nivel A, 2026-11-14.

## 2. Inventario de afirmaciones verificables → estado de evidencia

| Afirmación (superficie) | Dónde | Estado de evidencia |
|---|---|---|
| Framework de gobernanza para proyectos con agentes | Hero Inicio EN/ES + meta description | Posicionamiento; mecanismos verificados en Trust |
| «Cada tarea deja algo más que un resultado» | H1 Inicio | Frase rectora (manifiesto §VI la conserva) |
| Contexto/decisiones/evidencia por proyecto, entre agentes/sesiones/harnesses | Hero + `#next` | Respaldado por handlers citados en Trust (115 handlers, brain.cortex) |
| 5 modos de ruptura de contexto | `#failures` | Encuadre de problema, no claim técnico |
| Ejemplo conductor «No exponer datos sensibles…» | `#local` Inicio + `#workflow` Referencia | Literalmente idéntico EN/ES (verificado v7) |
| Seis dimensiones de gobierno | `#dimensions` | Representación conceptual; límites por dimensión en cuadrantes |
| 7 artefactos + inspector | `#artifacts` | Mapa ilustrativo declarado («no inspecciona tus archivos») |
| CORTEX/HCORTEX una fuente dos lecturas | `#format` | Paridad codec citada con certificado y límites |
| 4 convenciones de archivo + MCP stdio | `#compatibility` | Verificado en código (Trust: sync-harnesses, _TARGETS); adhesión en 9 harnesses = reportada, fichas pendientes |
| Prueba CLI: archivo+tarea+evidencia hash/PULSE | `/start/` | Ejecutado y reproducido (sha256 4340d832…, SES001-E0002) — sin agente, declarado |
| 9 harnesses con adhesión reportada | Trust evidence | Reportado por proyecto; fichas pendientes — correctamente calificado |
| Platform multiusuario | Trust evidence/limits | «Dirección de producto, no capacidad de 1.0.0» — correcto |
| Firmas Ed25519, sellado SHA-256, journal push/pull | Trust | Verificado en código (commit fijado) |

**Expresiones prohibidas §5.3 — resultado del escaneo:** ninguna violación. «memoria perfecta», «nunca pierde contexto», «cualquier agente funciona», «auditoría completa», «compatibilidad universal», «gobierno autónomo», «colaboración multiusuario» — **0 ocurrencias** como afirmaciones. «multiuser/multiusuario» solo aparece en Confianza para declarar su **ausencia** en 1.0.0 (correcto). «lossless/sin pérdida» aparece una vez como métrica técnica del codec («141/141 · round-trip · lossless — HCORTEX corpus»), acotada a su corpus — no es promesa de contexto.

## 3. Discrepancias y candidatas (para Misión 1)

**D-M0-01 · «team/equipo» vs gobierno personal (§2.2) — candidata PRECISAR.**
El vocabulario «team/equipo» aparece en roles del workflow de Referencia («Stage 01 · Team decision», «Stage 04 · Team review», ES «Decisión del equipo», «Revisión del equipo»), en los `case` del JSON («The team agrees…», «El equipo define qué identidad de agente es dueña de la tarea»), y en Confianza («Your team retains approval», h3 «Team»/«Equipo», «governing several teams or machines requires your own process»). No afirma capacidad multiusuario, pero «equipo» puede leerse como grupo de personas — el manifiesto define el gobierno como **personal** (un humano + sus agentes). Decisión de vocabulario para M1: conservar «equipo» como unidad humano+agentes, o precisar a «usuario/proyecto».

**D-M0-02 · Carácter «personal» ausente (§2.2 + criterio de éxito 3).**
«personal» tiene **0 ocurrencias** en las 8 páginas. El criterio de éxito 3 exige que la página comunique «un framework de gobierno personal sin sugerir capacidades multiusuario». Actualmente el sitio dice «your projects», «tu equipo» — nunca explicita el ámbito personal del gobierno. Candidata a PRECISAR en hero o `#next` de Inicio (M1 decide ubicación y redacción).

**D-M0-03 · Meta-descriptions desalineadas con la matriz v8.**
`<meta name="description">` de Inicio conserva la formulación antigua («a governance framework for projects worked by AI agents» / «framework de gobernanza para los proyectos…») — es exactamente el texto que la matriz v8 propuso PRECISAR en el hero visible, pero las meta-etiquetas no estaban en su alcance. Si M2 aprueba la precisión del hero, las meta-descriptions deben acompañarla (Misión 4 las tocará; no son «texto publicado» visible pero sí superficie indexable). También aplica a los `og:`/`twitter:` si existen — verificar en M2.

**D-M0-04 · `sim-03-report.md` — RESUELTA.**
Localizado fuera del repo en `ARQUX-internal/ops/arqux-evaluation/sim-03-web-guided-product-utility/report/sim-03-report.md` y copiado al proyecto en `docs/evaluacion-sim03/` junto a `utility-map.md`. Contenido: 24 personas neutrales sobre la landing real (`preliminar-b`, ES), 96 evaluaciones de página + 24 finales, modelo deepseek-v4.1-flash, ejecutada 2026-11-22.

**Hallazgos sim-03 que alimentan Misión 1 (evidencia, no opinión):**

- **Categoría CONFIRMADA:** 24/24 describen ArqUX como framework/capa de gobernanza; **ninguna lo confunde con orquestador**. El posicionamiento actual ya funciona.
- **Problema reconocido + honestidad valorada:** 22/24 elogian la separación probado/código/pendiente en Confianza — «No la suavice» (recomendación §7.8 del reporte, coincidente con manifiesto §VI-Confianza).
- **Brecha central (24/24 mentions):** la página no prueba continuidad entre agentes/sesiones/harnesses — la prueba CLI es sin agente y así se declara. **Fuera del alcance del ciclo** (no es desarrollo funcional ni nueva demostración): se registra como oportunidad para ciclo posterior, conforme a §VII.10 del manifiesto. Lo que SÍ entra en alcance: que el discurso no prometa lo que la evidencia no muestra (ya lo hace) y evaluar si la formulación del beneficio necesita ajuste.
- **D-M0-01/D-M0-02 CONFIRMADAS con evidencia:** «coordinación multiusuario/equipo» aparece en **23/24** evaluaciones; N01 (tech lead, equipo de 8) lo registra como bloqueo directo: «No hay plataforma multiusuario alojada en 1.0.0, y mi equipo es de ocho personas». Nadie infiere el ámbito **personal** porque el sitio nunca lo dice — fortaleza adicional para precisar §2.2.
- **D-M0-03 ampliada:** la brecha versión 1.0.0-fuente vs 0.9.0-PyPI aparece en **24/24** evaluaciones como fricción de adopción; el sitio ya la declara honestamente (Start `#channels`, Trust `#limits`), pero el reporte sugiere evaluar si la declaración basta o necesita más visibilidad (M1 decide; no es hueco de honestidad).
- **Evidencia/atribución/exportación (24/24):** varias personas no encontraron que `evidence export`, `seal.cortex` y firmas Ed25519 existen y están verificados en código — capacidad real enterrada en detalles de Confianza. **Candidata M2:** mejorar descubribilidad de lo ya verificado, sin agregar claims.
- **«No es otro orquestador» (N03):** una persona pidió explícitamente diferenciación frente a orquestadores existentes; el sitio lo implica («governance belongs to the project») pero no lo enuncia. **Candidata M1:** ¿entra en vocabulario institucional?
- **Mecánica de decisión (N11/N21):** «la página explica el modelo, no la mecánica» — no hay ejemplo paso a paso «registrar decisión → otro agente la consulta». Añadirlo sería contenido nuevo en sección existente; **candidata M2** con justificación, no nueva página.
- **Fuera de alcance (registrar para ciclos posteriores):** prueba real de continuidad entre dos agentes/harnesses, imagen Docker/oficial, integración con tickets/ADRs/LangGraph/Airflow, RBAC/retención/PII/modelo de amenazas, especificación pública de contratos MCP, test humano de 15 segundos + piloto real (Misión 5 del ciclo).

**D-M0-05 · Vocabulario de beneficios §IV no etiquetado.**
Los seis beneficios (Continuidad, Consistencia, Control, Trazabilidad, Portabilidad, Aprendizaje gobernado) no aparecen nombrados como tal en ninguna página; el sitio expresa valor en prosa («continuous, reviewable and auditable»). No es error — M1 decide si el vocabulario institucional debe nombrarse explícitamente o seguir implícito.

**D-M0-06 · Distinción Framework/Platform (§2.3) — conforme, sin acción requerida.**
Confianza ya declara Platform como dirección futura y no capacidad («Hosted multiuser Platform — product direction, not a released 1.0.0 feature»; «no hosted multi-tenant service in 1.0.0»). Ninguna página atribuye capacidades multiusuario ni usa su ausencia como argumento de insuficiencia. El ancla `id="platform"` en el footer de Inicio es markup oculto, no copy.

## 4. Fuentes técnicas comprobadas

- `docs/analisis-discursivo-v8.md` — matriz + revisiones (base directa).
- `docs/evaluacion-sim03/sim-03-report.md` + `utility-map.md` — evaluación de 24 personas neutrales (insumo rector del manifiesto, copiado desde `ARQUX-internal/ops/arqux-evaluation/`).
- `tests/t16_home.py`, `t18_reference.py`, `t20_routes.py`, `t21_start_trust.py`, `t22_contract.py` — contratos editoriales verificados por suite.
- `tools/capture_v4.py` + `docs/evidencia-v4/` — evidencia visual por viewport.
- Texto completo extraído de las 8 páginas (volcado estructurado por sección) para este análisis.
- Git: tags y log confirman línea preliminar-B sin publicación.

## 5. Lo que NO se hizo (alcance M0)

Ningún HTML, CSS, JS, texto publicado ni recurso gráfico fue modificado. Únicos archivos nuevos: este baseline y el manifiesto persistido. CYCLE-02 tareas T-002…T-007 registradas (M0–M5); T-001 permanece draft como vehículo de implementación sujeta a aprobación.

## 6. Compuerta

**Pendiente:** aceptación del propietario del baseline. Con ella, Misión 1 (contrato discursivo) puede formalizar las decisiones sobre D-M0-01…D-M0-05.
