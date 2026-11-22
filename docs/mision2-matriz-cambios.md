# Misión 2 — Matriz de cambios literales
## ARQUX-WEB-DISCURSO-001 · CYCLE-02 · Alfred (SES005) · Baseline del sitio: `5375366` (sin cambios de sitio desde entonces)

**Compuerta:** aprobación explícita de cada texto propuesto. Nada de esto está implementado; Misión 4 ejecuta solo lo autorizado.
**Contrato:** `docs/contrato-discursivo-ciclo02.md` (`abd663d`) — 7 PRECISAR → esta matriz los convierte en textos literales.
**Convención:** «Actual» = transcripción literal del HTML actual. «Propuesto» = texto literal ES/EN sugerido. Doesn't = lo que el cambio NO hace.

---

## Resumen

| # | Cambio | Elementos | ¿Toca CSS/JS? | Tests afectados |
|---|---|---|---|---|
| P-01 | Hero lead → segunda persona + categoría verbal | 2 archivos (1 `<p class="lead">` c/u) | No | Ninguno (t16 no fija el lead) |
| P-02 | Meta-descriptions acompañan hero | 2 archivos (name + og:description c/u) | No | Ninguno |
| P-03 | H2 `#connect` → «referencias de gobierno» | 2 archivos (1 `<h2>` c/u) | No | Ninguno |
| P-04 | Retirar «team/equipo» del rol decisor | 4 archivos (~15 puntos) | No | Ninguno (verificado) |
| P-05 | Fila de evidencia dogfooding en Confianza | 2 archivos (1 `ev-group` + 1 botón filtro c/u) | **No** (filtro es genérico por data-attrs) | Ninguno (`ev-src >=6` se mantiene) |
| P-06 | Vocabulario §IV | — | — | **Hallazgo: recomiendo reclasificar a CONSERVAR** (ver §P-06) |
| P-07 | Tagline hero → lema rector | 2 archivos (1 `<p class="hero-portable">` c/u) | No | Ninguno |

---

## P-01 · Hero lead (Inicio EN/ES)

**Problema:** la primera frase dice «framework de gobernanza / governance framework» — categoría correcta pero sin el ámbito de una persona gobernante (D-M0-02; 23/24 de sim-03 preguntaron por equipos/multiusuario).

| | Texto |
|---|---|
| **Actual EN** | "ArqUX is a governance framework for the projects your AI agents work on. Each project keeps its own context, decisions and evidence — so work stays continuous, reviewable and auditable across agents, sessions and harnesses, and reviewed lessons can serve the rest of your workspace." |
| **Propuesto EN** | "ArqUX is a framework for governing your projects, executed by AI agents. Each project keeps its own context, decisions and evidence — so work stays continuous, reviewable and auditable across agents, sessions and harnesses, and reviewed lessons can serve the rest of your workspace." |
| **Actual ES** | "ArqUX es un framework de gobernanza para los proyectos en los que trabajan tus agentes de IA. Cada proyecto conserva su propio contexto, decisiones y evidencia, para que el trabajo continúe, sea revisable y auditable entre agentes, sesiones y harnesses, y las lecciones revisadas sirvan al resto de tu espacio de trabajo." |
| **Propuesto ES** | "ArqUX es un framework para gobernar tus proyectos, ejecutados por agentes de IA. Cada proyecto conserva su propio contexto, decisiones y evidencia, para que el trabajo continúe, sea revisable y auditable entre agentes, sesiones y harnesses, y las lecciones revisadas sirvan al resto de tu espacio de trabajo." |

- **Cambio efectivo:** solo la primera frase; la segunda (beneficios) queda intacta.
- **Matiz abierto (decisión en esta compuerta):** «executed/executados» es tu formulación literal. Alternativa más idiomática: "built by AI agents" / «desarrollados por agentes de IA». Recomiendo «desarrollados/built» — «proyectos ejecutados» es comprensible pero «proyectos desarrollados» es la colocación natural. Tú decides.
- **Riesgo comprensión:** bajo — la frase es más corta y concreta que la actual. **Riesgo regresión:** nulo (texto plano en `<p class="lead">`).
- **Trazabilidad:** P-01, D-M1-01, D-M0-01/02.

## P-02 · Meta-descriptions (Inicio EN/ES)

**Problema:** conservan la fórmula antigua («governance framework / framework de gobernanza») — superficie indexable desalineada con la precisión aprobada (D-M0-03; las meta no fueron cubiertas por la matriz v8).

| | Texto |
|---|---|
| **Actual EN** (name + og:description, idénticos) | "ArqUX is a governance framework for projects worked by AI agents — each project keeps its own context, decisions and evidence." |
| **Propuesto EN** | "ArqUX is a framework for governing your projects, executed by AI agents — each project keeps its own context, decisions and evidence." |
| **Actual ES** (name + og:description, idénticos) | "ArqUX es un framework de gobernanza para los proyectos en los que trabajan tus agentes de IA: cada proyecto conserva su propio contexto, decisiones y evidencia." |
| **Propuesto ES** | "ArqUX es un framework para gobernar tus proyectos, ejecutados por agentes de IA: cada proyecto conserva su propio contexto, decisiones y evidencia." |

- Si P-01 elige «desarrollados/built», aquí va la misma variante.
- **Riesgo:** nulo — meta no visible; longitud ~150 chars, dentro de rango.
- **Trazabilidad:** P-02, D-M0-03.

## P-03 · H2 `#connect` (Primeros pasos EN/ES)

**Problema:** «project rules / las reglas del proyecto» es vocabulario pre-contrato; el término canónico es «referencias de gobierno / governance references» (propuesta v8 ya auditada por Jarvis+Heimdall).

| | Texto |
|---|---|
| **Actual EN** | "Your agent can receive project rules through two paths." |
| **Propuesto EN** | "Your agent can receive the project's governance references through two paths." |
| **Actual ES** | "Tu agente puede recibir las reglas del proyecto por dos vías." |
| **Propuesto ES** | "Tu agente puede recibir las referencias de gobierno del proyecto por dos vías." |

- El párrafo bajo el H2 («Start with instruction files…» / «Empieza por archivos de instrucciones…») está limpio — no se toca.
- **Riesgo:** nulo. **Trazabilidad:** P-03.

## P-04 · Retirar «team/equipo» del rol decisor (4 archivos, ~15 puntos)

**Problema:** «equipo/team» como quién decide sugiere gobierno multi-persona; el contrato §2.2 establece una persona gobernante. «Tú decides / You decide» ya existe como H2 de Confianza — las tarjetas y textos deben ser coherentes.

### reference/index.html (EN) — 7 puntos

| # | Elemento | Actual | Propuesto |
|---|---|---|---|
| 1 | step-tag etapa 01 | `Team decision` | `Project decision` |
| 2 | step-tag etapa 04 | `Team review` | `Project review` |
| 3 | app-data kicker paso 0 | `Stage 01 · Team decision` | `Stage 01 · Project decision` |
| 4 | app-data `case` paso 0 | `The team agrees not to expose sensitive data in error messages.` | `You agree not to expose sensitive data in error messages.` |
| 5 | app-data `who` paso 1 | `The team defines which agent identity owns the task.` | `You define which agent identity owns the task.` |
| 6 | app-data kicker paso 3 | `Stage 04 · Team review` | `Stage 04 · Project review` |
| 7 | kicker estático del modal (no-JS) | `Stage 01 · Team decision` | `Stage 01 · Project decision` |

### es/referencia/index.html (ES) — 7 puntos

| # | Elemento | Actual | Propuesto |
|---|---|---|---|
| 1 | step-tag etapa 01 | `Decisión del equipo` | `Decisión del proyecto` |
| 2 | step-tag etapa 04 | `Revisión del equipo` | `Revisión del proyecto` |
| 3 | app-data kicker paso 0 | `Etapa 01 · Decisión del equipo` | `Etapa 01 · Decisión del proyecto` |
| 4 | app-data `case` paso 0 | `El equipo acuerda no exponer datos sensibles en los mensajes de error.` | `Tú acuerdas no exponer datos sensibles en los mensajes de error.` |
| 5 | app-data `who` paso 1 | `El equipo define qué identidad de agente es dueña de la tarea.` | `Tú defines qué identidad de agente es dueña de la tarea.` |
| 6 | app-data kicker paso 3 | `Etapa 04 · Revisión del equipo` | `Etapa 04 · Revisión del proyecto` |
| 7 | kicker estático del modal (no-JS) | `Etapa 01 · Decisión del equipo` | `Etapa 01 · Decisión del proyecto` |

### trust/index.html (EN) — 5 puntos

| # | Elemento | Actual | Propuesto |
|---|---|---|---|
| 1 | meta description + og:description | `…and what your team owns: evidence, scope and limits.` | `…and what you decide: evidence, scope and limits.` |
| 2 | intro section-copy | `…and decisions that remain with your team.` | `…and decisions that remain with you.` |
| 3 | section-head copy | `Your team retains approval and responsibility for the outcome.` | `You retain approval and responsibility for the outcome.` |
| 4 | trust-card 03 | h3 `Team` + `Defines acceptance criteria, approves decisions, and reviews evidence.` | h3 `You` + `Define acceptance criteria, approve decisions, and review evidence.` |
| 5 | limits detail | `governing several teams or machines requires your own process` | `governing several projects or machines requires your own process` |

### es/confianza/index.html (ES) — 4 puntos

| # | Elemento | Actual | Propuesto |
|---|---|---|---|
| 1 | intro section-copy | `…y las decisiones que siguen en manos de tu equipo.` | `…y las decisiones que siguen en tus manos.` |
| 2 | section-head copy | `Tu equipo conserva la aprobación y la responsabilidad del resultado.` | `Tú conservas la aprobación y la responsabilidad del resultado.` |
| 3 | trust-card 03 | h3 `Equipo` + `Define criterios de aceptación, aprueba decisiones y revisa evidencias.` | h3 `Tú` — el cuerpo ya conjuga en 2ª persona («define/aprueba/revisa»), **no cambia** |
| 4 | limits detail | `gobernar varios equipos o máquinas exige tu propio proceso` | `gobernar varios proyectos o máquinas exige tu propio proceso` |

- La meta ES de Confianza ya dice «qué es tuyo» — limpia, no se toca.
- Los `who`/`case` de las etapas 02 y 04 ya están en persona («A bound session…», «A person or authorized reviewer…») — limpios.
- **Elección de términos:** «Project decision/review» en tags/kickers (el proyecto es protagonista y sede del gobierno); «You/Tú» en quien ejecuta la acción (segunda persona, D-M1-01). En `case`/`who` el sujeto pasa de «the team» a «you» — el visitante es quien gobierna.
- **Riesgo comprensión:** bajo — «project» refuerza la doctrina «el gobierno pertenece al proyecto». **Riesgo regresión:** nulo (texto en HTML + JSON de `app-data`, misma estructura).
- **Trazabilidad:** P-04, §2.2.

## P-05 · Evidencia dogfooding en Confianza (nuevo `ev-group`)

**Problema:** D-M0-07 verificó continuidad real (5 sesiones, 4 ejecuciones, `agent=alfred` persistente, contexto de proyecto intacto, 4 harnesses con estado activo) pero no está publicada en ninguna página — sim-03: 24/24 notaron la ausencia de prueba de continuidad.

**Propuesta estructural (sin CSS/JS nuevos):** nuevo `.ev-group[data-ev-group="practice"]` entre los grupos `source` y `reported`, más un botón `.ev-filter[data-ev-filter="practice"]` en la barra (el JS itera botones/grupos por data-attrs — funciona sin tocar `app.js`; sin JS todos los grupos son visibles).

### EN

```html
<!-- filterbar: insertar antes del botón "Reported or pending" -->
<button type="button" class="ev-filter" data-ev-filter="practice" aria-pressed="false">Observed in practice</button>

<!-- nuevo grupo, tras el grupo source -->
<div class="ev-group" data-ev-group="practice">
<p class="eyebrow">Observed in practice · ArqUX's own development · sessions SES001–SES005</p>
<div class="evidence-list" aria-label="Observations from ArqUX's own governed development">
<div class="evidence-row"><div><b>Continuity across harnesses</b><small>Agent identity and project context persisted in governance artifacts across five sessions, four execution processes and several agent harnesses — ArqUX governing its own development.</small><details class="ev-detail"><summary>Technical record</summary><div class="ev-detail-body">
<p><b>What was checked:</b> sessions SES001–SES005 (2026-11-12 → 2026-11-22) share <code>agent=alfred</code>, <code>project=Proyecto_X</code> and the same brain.cortex, cycles, tasks and append-only timelog across four distinct execution IDs; Devin CLI, Codex, CommandCode and OpenCode show active local state. Governance records identity and project context — deliberately not the hosting harness. Verified 2026-11-22.</p>
<p><b>How to verify it:</b> inspect the session records, timelog and PULSE events under <code>.arqux/</code> in the governed development workspace — the same artifacts any governed project produces. The record is summarized in <a href="/docs?">…</a>.</p>
<p><b>What it does not prove:</b> it does not show two agents executing one task jointly, and sessions are not attributed to a named harness — the evidence is persistence of identity and context, not per-tool testing.</p>
<p><b>Source or test:</b></p>
<a class="ev-src" href="https://github.com/FidelErnesto03/arqux-landing/blob/preliminar-b/docs/mision0-baseline.md" target="_blank" rel="noreferrer">mision0-baseline.md ↗</a>
</div></details></div><span class="pill">In practice</span></div>
</div></div>
```

### ES (espejo)

```html
<button type="button" class="ev-filter" data-ev-filter="practice" aria-pressed="false">Observado en la práctica</button>

<div class="ev-group" data-ev-group="practice">
<p class="eyebrow">Observado en la práctica · Desarrollo propio de ArqUX · sesiones SES001–SES005</p>
<div class="evidence-list" aria-label="Observaciones del desarrollo gobernado propio de ArqUX">
<div class="evidence-row"><div><b>Continuidad entre harnesses</b><small>La identidad del agente y el contexto del proyecto persistieron en los artefactos de gobernanza a través de cinco sesiones, cuatro procesos de ejecución y varios harnesses de agente — ArqUX gobernando su propio desarrollo.</small><details class="ev-detail"><summary>Registro técnico</summary><div class="ev-detail-body">
<p><b>Qué se comprobó:</b> las sesiones SES001–SES005 (2026-11-12 → 2026-11-22) comparten <code>agent=alfred</code>, <code>project=Proyecto_X</code> y el mismo brain.cortex, ciclos, tareas y timelog append-only a través de cuatro execution IDs distintos; Devin CLI, Codex, CommandCode y OpenCode muestran estado local activo. La gobernanza registra identidad y contexto del proyecto — deliberadamente no el harness que hospeda la sesión. Verificado el 2026-11-22.</p>
<p><b>Cómo comprobarlo:</b> inspecciona los registros de sesión, el timelog y los eventos PULSE bajo <code>.arqux/</code> en el espacio de trabajo gobernado del desarrollo — los mismos artefactos que produce cualquier proyecto gobernado. El registro está resumido en <a href="/es/docs?">…</a>.</p>
<p><b>Lo que no demuestra:</b> no muestra dos agentes ejecutando una tarea conjunta, y las sesiones no se atribuyen a un harness concreto — la evidencia es persistencia de identidad y contexto, no prueba por herramienta.</p>
<p><b>Fuente o prueba:</b></p>
<a class="ev-src" href="https://github.com/FidelErnesto03/arqux-landing/blob/preliminar-b/docs/mision0-baseline.md" target="_blank" rel="noreferrer">mision0-baseline.md ↗</a>
</div></details></div><span class="pill">En la práctica</span></div>
</div></div>
```

- **Puntos a resolver en M4 (menores):** (a) el enlace «How to verify» — propongo apuntar al archivo `docs/mision0-baseline.md` del repo (público, contiene el registro D-M0-07); el `<a href="…">` interno puede omitirse o apuntar a la sección Trust. (b) El pin del enlace `ev-src` debe fijarse al commit vigente en M4 (los demás usan `3903339` del repo del producto; este apunta al repo del landing — rama `preliminar-b`).
- **Riesgo comprensión:** bajo-medio — es la primera fila que no es ni test pineado ni código; el detalle declara el alcance exacto (identidad+contexto, no tarea conjunta, sin atribución por harness). **Riesgo regresión:** nulo — componentes existentes (`ev-group`, `evidence-row`, `pill`, `ev-detail`, `ev-filter`), filtro genérico, sin JS/CSS.
- **Trazabilidad:** P-05, D-M0-07, §5.4 (evidencia precede a la confianza).

## P-06 · Vocabulario de beneficios §IV — HALLAZGO

**Análisis:** los términos canónicos «consistencia/consistencia», «trazabilidad», «portabilidad» tienen **0 ocurrencias** en las 8 páginas; «continuidad/continuity» solo aparece en la nota de limitación CLI de Primeros pasos (correctamente acotada). La prosa actual ya comunica los beneficios en lenguaje llano: «continuous, reviewable and auditable» / «continúe, revisable y auditable»; «retomarse, revisarse y evolucionar».

**Recomendación: reclasificar P-06 a CONSERVAR.** Forzar los términos canónicos añadiría jerga sin ganancia de comprensión — violaría §5.5 (simplicidad) y «no modificar lo que ya comunica correctamente». Los beneficios §IV quedan **implícitos y correctos**; el vocabulario canónico sigue gobernando futuros textos (M5+).

- **Riesgo si se implementara:** medio (densidad terminológica sin beneficio).
- **Trazabilidad:** P-06, D-M0-05 — decisión del propietario en esta compuerta.

## P-07 · Tagline hero → lema rector

**Problema:** el tagline actual («Projects that keep their course, their rules and their memory») es descriptivo, usa «memory» sin calificar (cabo suelto D-01 de la auditoría v8) y no nombra el dolor real.

| | Texto |
|---|---|
| **Actual EN** | "Projects that keep their course, their rules and their memory — across agents and harnesses." |
| **Propuesto EN** | "Your agents change. Your projects evolve. Your judgment endures." |
| **Actual ES** | "Proyectos que conservan su rumbo, sus reglas y su memoria — entre agentes y harnesses." |
| **Propuesto ES** | "Tus agentes cambian. Tus proyectos evolucionan. Tu criterio permanece." |

- `#next` actúa como expansión (opción A aprobada): repite el motivo con «decisiones y evidencia» + rutas.
- **Riesgo:** nulo — `<p class="hero-portable">` texto plano. **Trazabilidad:** P-07, D-M1-02.

---

## Impacto en tests (verificado)

| Test | ¿Afectado? | Motivo |
|---|---|---|
| t16_home | No | Assert H1 («more than a result» — no cambia), mapa hero, CSS; no fija lead/tagline/meta |
| t18_reference | No | Assert `.step-meta` count==4 (elemento, no texto), fuentes, dims |
| t20_routes | No | Solo rutas |
| t21_start_trust | No | Orden de secciones y `ev-src[href*='3903339'] >=6` — el nuevo `ev-src` apunta a otro repo, no reduce el conteo |
| t22_contract | No | Contrato estructural |
| t24_casemodal | No | Kicker del modal de **Inicio** («INTERPRETATION»), no el de Referencia |
| t25_closure | Verificar en M4 | `#next` no cambia, pero conviene re-correr |
| t26_navmap | No | Mapa de navegación |

## Invariantes confirmados

- **0 cambios en CSS/JS** — todo es texto en HTML + JSON de `app-data` + meta tags; P-05 reutiliza componentes existentes.
- **0 cambios estructurales** — mismos elementos, selectores y secciones; P-05 añade un `ev-group` dentro de `#evidence` existente (el filtro es genérico).
- **Rutas/anclas intactas** — ningún `id`, `href` interno ni orden de secciones cambia.
- **EN/ES paridad** — cada cambio tiene su espejo.

## Compuerta M2

**Pendiente:** aprobación explícita de los textos propuestos — incluyendo las dos micro-decisiones marcadas: (a) P-01/P-02 «executed/executados» vs «built/desarrollados»; (b) P-06 reclasificar a CONSERVAR. Con ella → Misión 3 (revisión crítica independiente en contexto separado).
