# Matriz de diferencias editoriales — Directiva de alineación discursiva

**Baseline:** `cea50e0` · rama `preliminar-b` · Fecha de análisis: 2026-11-21
**Alcance:** análisis SIN modificaciones. Ningún HTML/CSS/JS/texto publicado fue alterado.
**Posicionamiento de referencia:** «Framework para el gobierno de proyectos con agentes de IA» — categoría: gobierno de proyectos; beneficio central: continuidad del trabajo y conservación de criterios; diferenciación: no reemplaza agentes ni orquesta.

Una fila cubre EN+ES (columnas de propuesta por idioma). Solo se proponen acciones donde el contenido actual diverge del contrato; el resto se marca CONSERVAR con justificación.

---

## 1. Inicio — `/` y `/es/`

| Página y sección | Texto actual | Problema | Acción | Texto propuesto ES | Texto propuesto EN | Justificación | Riesgo | Evidencia |
|---|---|---|---|---|---|---|---|---|
| `#top` ceja | ES «Para quien gestiona proyectos donde agentes de IA ejecutan el trabajo» / EN "For people who run projects where AI agents do the work" | Ninguno: proyecto protagonista, agentes participantes. | CONSERVAR | — | — | El encuadre ya sitúa al proyecto como titular y al agente como ejecutor. | — | index.html `#top` |
| `#top` H1 | ES «Cada tarea deja algo más que un resultado.» / EN "Every task leaves more than a result." | Ninguno: es frase rectora literal. | CONSERVAR | — | — | Coincide palabra por palabra con la frase rectora aprobada. | — | index.html `#top h1` |
| `#top` párrafo principal | ES «ArqUX es un framework de gobernanza para los proyectos en los que trabajan tus agentes de IA…» / EN "ArqUX is a governance framework for the projects your AI agents work on…" | La categoría se insinúa («framework de gobernanza») pero no se nombra como «gobierno de proyectos»: el sustantivo rector no aparece. | PRECISAR | «ArqUX es un framework para el gobierno de los proyectos en los que trabajan tus agentes de IA. Cada proyecto conserva su propio contexto, decisiones y evidencia, para que el trabajo continúe, sea revisable y auditable entre agentes, sesiones y harnesses, y las lecciones revisadas sirvan al resto de tu espacio de trabajo.» | "ArqUX is a framework for governing the projects your AI agents work on. Each project keeps its own context, decisions and evidence — so work stays continuous, reviewable and auditable across agents, sessions and harnesses, and reviewed lessons can serve the rest of your workspace." | Hace explícita la categoría aprobada en la primera frase sin alargar el párrafo ni tocar el resto de la cláusula. | Cambio mínimo de sintaxis; t16 verifica fragmentos del hero — actualizar check en misión 2. | index.html `#top` p1; directiva §1 frase rectora |
| `#top` línea secundaria | ES «Proyectos que conservan su rumbo, sus reglas y su memoria — entre agentes y harnesses.» / EN "Projects that keep their course, their rules and their memory — across agents and harnesses." | «Memoria» en abstracto puede leerse como memoria infalible; el matiz «conservan» lo acota, pero es el punto más débil del párrafo. | CONSERVAR (observación para Heimdall) | — | — | La metáfora está calificada («projects keep») y el resto del sitio precisa que el contexto es referencia gobernada, no memoria absoluta. Cambiarla tocaría el tagline sin ganancia clara. | Si Heimdall lo observa, PRECISAR «su memoria» → «su registro». | index.html `#top` p2 |
| `#top` insignias | «✓Apache-2.0 · ✓Local-first · ✓Instructions for different agents» / equivalente ES | Ninguno. | CONSERVAR | — | — | Datos verificables (licencia, local-first, convenciones). | — | index.html `#top` |
| `#failures` H2 + intro | «El contexto se rompe de cinco formas corrientes.» / "Context breaks in five ordinary ways." | Ninguno: la discontinuidad es el mecanismo de identificación emocional aprobado. | CONSERVAR | — | — | Coincide con el objetivo de página (§3 Inicio). | — | index.html `#failures` |
| `#failures` tarjetas ×5 | Transferencia en prosa, releer desde cero, compresión, entrega con contexto, fin de sesión | Ninguno; describen el problema sin prometer solución. | CONSERVAR | — | — | Son el problema, no la afirmación de capacidad. | — | index.html `#failures` |
| `#local` demo criterio | «"No exponer datos sensibles en los mensajes de error."» / "Do not expose sensitive data in error messages." | Ninguno: es el ejemplo conductor obligatorio y coincide literalmente con Referencia. | CONSERVAR | — | — | Continuidad literal verificada Inicio↔Referencia (requisito §4). | — | index.html `#local`; reference `#workflow` |
| `#local` etiqueta resultado | «Ayer avanzaste. Hoy tuviste que volver a explicarlo.» / "You made progress yesterday. Today you had to explain it again." | Ninguno. | CONSERVAR | — | — | Ilustra la discontinuidad sin afirmar garantía. | — | index.html `#local` |
| `#next` ceja + H2 | «GOBERNANZA QUE SOBREVIVE A LA SESIÓN» / «El trabajo cambia. Los proyectos evolucionan. Criterios, decisiones y evidencia permanecen — por proyecto, entre agentes.» / EN "GOVERNANCE THAT OUTLIVES THE SESSION" / "Work changes. Projects evolve. Criteria, decisions and evidence remain — per project, across agents." | Ninguno: variante aceptada de la frase rectora «El trabajo cambia. El criterio del proyecto permanece». | CONSERVAR | — | — | Misma idea rectora sin copia literal; «por proyecto, entre agentes» refuerza la categoría. | — | index.html `#next` |
| `#next` párrafo + línea de capacidades | «ArqUX organiza las reglas, decisiones, el contexto y las evidencias de tu proyecto en un contexto gobernado…» / «Framework abierto · Contexto local del proyecto · Capacidades según versión y integración» | Ninguno. | CONSERVAR | — | — | «Contexto gobernado» y el disclaimer de capacidades por versión son exactamente el tono exigido. | — | index.html `#next` |

## 2. Referencia — `/reference/` y `/es/referencia/`

| Página y sección | Texto actual | Problema | Acción | Texto propuesto ES | Texto propuesto EN | Justificación | Riesgo | Evidencia |
|---|---|---|---|---|---|---|---|---|
| `#workflow` ceja+H1+intro | «De la decisión al resultado» / «Lo que acuerdas hoy debe orientar el trabajo de mañana.» / «ArqUX conserva las reglas y decisiones del proyecto como referencias…» | Ninguno: responde «qué gobierna y cómo organiza el trabajo» sin repetir el problema de Inicio. | CONSERVAR | — | — | Progresión correcta según §3. | — | reference `#workflow` |
| `#workflow` case-bridge | «Ejemplo: «No exponer datos sensibles en los mensajes de error».» / `Example: "Do not expose sensitive data in error messages.".` | Ninguno: ejemplo conductor literal. | CONSERVAR | — | — | Requisito §4 verificado. | — | reference `#workflow` |
| `#workflow` 4 etapas + metas | Acordar/Asignar/Ejecutar/Revisar con sus `.step-meta` y `case` en modal | Ninguno (contrato v7 cumplido). | CONSERVAR | — | — | Modal, foco y retorno intactos; caso por etapa coherente con el ejemplo. | — | reference `#workflow`; tests t18 |
| `#dimensions` ceja+H2+intro | «Qué se gobierna» / «Seis preguntas. Un criterio más claro para cada tarea.» | Ninguno: «qué se gobierna» hace eco de la categoría sin repetir argumento. | CONSERVAR | — | — | Kicker ya nombra la categoría funcionalmente. | — | reference `#dimensions` |
| `#dimensions` `details.dim-scope-detail` | Texto de alcance cerrado tras el explorador | Ninguno (ubicación v7 correcta: detalle voluntario). | CONSERVAR | — | — | La distinción mapa↔arquitectura vive solo en detalle, como exige §4/§6-v7. | — | reference `#dimensions` |
| `#artifacts` intro | «ArqUX conserva reglas, roles, contexto y hallazgos en referencias del proyecto y del espacio de trabajo…» | Ninguno (v7: ambos ámbitos explícitos). | CONSERVAR | — | — | Distingue proyecto de workspace sin confundirlos. | — | reference `#artifacts` |
| `#format` sección completa | «Una fuente, dos lecturas» / comparador CORTEX/HCORTEX + nota de correspondencia | Ninguno. | CONSERVAR | — | — | «No son dos memorias diferentes» precisa el estatus de contexto-como-referencia. | — | reference `#format` |
| `#compatibility` H2 | «El gobierno pertenece al proyecto, no al agente.» / "Governance belongs to the project, not the agent." | Ninguno: es frase rectora literal. | CONSERVAR | — | — | Diferenciación explícita: no orquestador, no reemplazo de agentes. | — | reference `#compatibility` |
| `#compatibility` intro + tarjetas | «Un proyecto conserva sus propias reglas y referencias…» / tarjetas agente-CLI con límite declarado | Ninguno. | CONSERVAR | — | — | «referencias» y la aclaración CLI («no verifica transferencia») cumplen §4. | — | reference `#compatibility` |

## 3. Primeros pasos — `/start/` y `/es/empezar/`

| Página y sección | Texto actual | Problema | Acción | Texto propuesto ES | Texto propuesto EN | Justificación | Riesgo | Evidencia |
|---|---|---|---|---|---|---|---|---|
| `#intro` H1 + párrafos | «Crea una tarea. Comprueba el resultado.» / «Esta primera prueba utiliza el CLI, sin agente…» | Ninguno: la página responde «qué puedo hacer hoy» y declara el alcance CLI por adelantado. | CONSERVAR | — | — | Distinción CLI↔agente presente desde el primer párrafo (§3). | — | start `#intro` |
| `#first-task` nota de alcance | «Prueba ejecutada sin agente; no demuestra todavía continuidad entre harnesses.» / "Executed without an agent; this does not yet demonstrate continuity across harnesses." | Ninguno: evita sobre-vender continuidad. | CONSERVAR | — | — | Exactamente la distinción exigida en §3. | — | start `#first-task` |
| `#first-task` cierre | «Esta comprobación ejecutó la ruta CLI pura… las identidades declaradas y el vínculo de sesión son lo que convierten este rastro de tarea en trabajo gobernado con agente…» | Ninguno: conecta el resultado comprobable con el valor del framework sin afirmar que ya ocurrió. | CONSERVAR | — | — | «trabajo gobernado» usa la categoría sin prometer capacidad no probada. | — | start `#first-task` |
| `#connect` H2 | «Tu agente puede recibir las reglas del proyecto por dos vías.» / "Your agent can receive project rules through two paths." | «Reglas» es más estrecho que el concepto rector: el agente recibe referencias de gobierno (reglas+contexto+decisiones+evidencia), no solo reglas. | PRECISAR | «Tu agente puede recibir las referencias de gobierno del proyecto por dos vías.» | "Your agent can receive the project's governance references through two paths." | Alinea el vocabulario con Referencia («referencias») y con la categoría sin cambiar la estructura ni las dos vías. | Cambio de una palabra; enlaces y secciones intactos. | start `#connect` h2 |
| `#connect` cierres de vía A/B + advertencia final | «Qué obtiene / Qué compruebas» + «un modelo no obedece las instrucciones solo porque los archivos existan» | Ninguno: límites honestos del mecanismo. | CONSERVAR | — | — | Refuerza que la continuidad depende de la integración efectiva (§4). | — | start `#connect` |

## 4. Confianza — `/trust/` y `/es/confianza/`

| Página y sección | Texto actual | Problema | Acción | Texto propuesto ES | Texto propuesto EN | Justificación | Riesgo | Evidencia |
|---|---|---|---|---|---|---|---|---|
| `#intro` H1 + párrafo | «Sabe qué hace ArqUX. Y qué depende de ti.» / «Distingue los controles del código, las instrucciones que interpreta tu agente…» | Ninguno. | CONSERVAR | — | — | Responde «qué está comprobado» desde el titular. | — | trust `#intro` |
| `#trust` tres responsabilidades | «El sistema controla. El agente interpreta. Tú decides.» / "The system enforces. Agents interpret. You decide.» + «ArqUX gobierna lo que su código puede verificar.» | Ninguno: es la formulación más alineada del sitio — gobierno acotado a lo verificable, agente participante, equipo decide. | CONSERVAR | — | — | Réplica del contrato: gobierno ≠ obediencia ≠ garantía. | — | trust `#trust` |
| `#evidence` filtros + registros | Filtros Todas/Ejecutado en prueba/Comprobado en código/Reportado o pendiente + fichas con «Qué se comprobó / Cómo comprobarlo / Qué no demuestra» | Ninguno: separación verificado-reportado-pendiente exacta. | CONSERVAR | — | — | Modelo de evidencia ya implementa §3-Confianza. | — | trust `#evidence` |
| `#evidence` nota codec | «Las pruebas del codec corresponden al codec… No mide la comprensión de un modelo ni certifica ArqUX.» | Ninguno. | CONSERVAR | — | — | Limita correctamente una dependencia externa. | — | trust `#evidence` |
| `#limits` cinco límites | Versión PyPI, archivos vs controles, journal local, hash/firma, compatibilidad reportada | Ninguno. | CONSERVAR | — | — | Cada límite con consecuencia + verificación + fuente versionada. | — | trust `#limits` |
| `#continue` cierre | «Comprueba primero. Adopta con criterio.» / "Verify first. Adopt with confidence in the evidence." | Ninguno. | CONSERVAR | — | — | Cierre coherente con la página. | — | trust `#continue` |

---

## 2. Inventario de invariantes protegidos

**No se propone tocar ninguno de estos elementos; cualquier cambio futuro requiere autorización específica:**

- Identidad visual completa: colores, tipografía, lenguaje gráfico, logo.
- Todas las animaciones, transiciones y microinteracciones aprobadas (entradas de nodos, menú, replay, movimiento reducido).
- Hero visual y demostraciones de portada (`#local` escenario, botones de replay).
- Hexágono interactivo de Referencia: nodos SVG, chips móviles, tarjeta de detalle de 4 cuadrantes, animación de selección.
- Explorador de artefactos (`#artifacts`) e inspector.
- Comparador CORTEX/HCORTEX (`#format`): paneles, selector, estados iniciales responsive, certificado.
- Estructura: 4 páginas, secciones y orden, rutas `/`, `/es/`, `/reference/`, `/es/referencia/`, `/start/`, `/es/empezar/`, `/trust/`, `/es/confianza/` y todos los anclas (`#intro`, `#workflow`, `#dimensions`, `#artifacts`, `#format`, `#compatibility`, `#continue`, `#compat-files`, `#compat-mcp`, `#failures`, `#local`, `#next`, `#channels`, `#first-task`, `#connect`, `#trust`, `#evidence`, `#limits`).
- Navegación global, menús, componentes compartidos.
- Adaptaciones responsive aprobadas (320/390/760/1024/1440).
- Contratos de accesibilidad: foco visible, Escape, retorno de foco, `prefers-reduced-motion`, operación por teclado, JS deshabilitado.
- JSON `#app-data` de Referencia (pasos, dimensiones, artefactos) y toda la maquinaria JS salvo texto.

**Elementos que permanecerán intactos aunque se aprueben las precisiones:** todo lo anterior + todos los textos marcados CONSERVAR en esta matriz (que son la gran mayoría del copy publicado).

## 3. Síntesis de la matriz

- **SUSTITUIR:** ninguno.
- **REUBICAR:** ninguno.
- **PRECISAR:** 2 elementos — párrafo principal del hero de Inicio (EN+ES) y H2 de `#connect` en Primeros pasos (EN+ES).
- **CONSERVAR:** todo lo demás (24 filas evaluadas).
- El sitio ya cumple la mayor parte del contrato: categoría reconocible, proyecto protagonista, continuidad como beneficio, evidencia calificada, ejemplo conductor literal, diferenciación frente a orquestación.

## 4. Revisión de Jarvis — CONSISTENCIA

⬡ jarvis | Proyecto_X | landing · Dictamen sobre la matriz (baseline `cea50e0`)

**Veredicto: APROBADO con 2 observaciones menores (no bloqueantes).**

Verificación criterio por criterio (§6):

1. **Categoría institucional — CUMPLE.** Tras las 2 precisiones, «gobierno de proyectos» aparece literalmente en el hero de Inicio («framework para el gobierno de los proyectos…» / "framework for governing the projects…"). Antes dependía de «framework de gobernanza», que es equivalente pero no literal. La categoría queda reconocible en la primera frase.
2. **Sin capacidades inexistentes — CUMPLE.** Ninguna propuesta afirma funcionalidad nueva: ambas son reformulaciones de sintaxis sobre textos existentes. «Referencias de gobierno» describe lo que las dos vías de `#connect` ya entregan (archivos de instrucciones + operaciones MCP); no promete MCP automático ni compatibilidad universal.
3. **Coherencia entre las 4 páginas — CUMPLE.** Vocabulario resultante: Inicio = categoría + problema; Referencia = mecanismo (flujo→dimensiones→artefactos→formato→integración); Primeros pasos = acción comprobable; Confianza = evidencia calificada. Cada página responde su pregunta asignada en §3 sin invadir la de otra. «Gobierno» aparece 3 veces con funciones distintas (categoría / diferenciación / reparto de responsabilidades): no es repetición argumental.
4. **Significado EN preservado — CUMPLE.** Las traducciones propuestas son equivalentes, no literales forzadas: "for governing the projects your AI agents work on" ≈ «para el gobierno de los proyectos en los que trabajan tus agentes de IA»; "governance references" ≈ «referencias de gobierno». El orden de cláusulas del hero se mantiene; la longitud es comparable.
5. **Sin repetición del argumento — CUMPLE.** La discontinuidad se narra solo en Inicio; Referencia no la repite (verificado: `#workflow` habla de recorrido revisable, no de pérdida de contexto).
6. **Sin rediseño encubierto — CUMPLE.** Las 2 precisiones son cambios de texto en un párrafo y un H2. No tocan markup estructural, selectores, clases ni el JSON `#app-data`. Los textos afectados no estaban congelados por la orden v7 (v7 cubrió Referencia; el hero es Inicio y `#connect` es Primeros pasos).

**Observaciones (correcciones literales sugeridas, no exigidas):**

- **OBS-J1 — `#connect` H2, contexto de las vías.** La matriz propone «referencias de gobierno del proyecto», pero las tarjetas internas siguen diciendo «Qué haces / Qué obtiene» con archivos concretos. Sugerencia: verificar en implementación que el párrafo introductorio de la sección (el que precede a las tarjetas A/B) no repita «reglas» en un texto que quedaría por debajo del nuevo H2. En el volcado actual el párrafo dice "Start with instruction files…" / "Empieza por archivos de instrucciones…" — no repite «reglas», por lo que la observación queda **resuelta sin acción**.
- **OBS-J2 — pruebas.** `tests/t16_home.py` verifica fragmentos del párrafo hero; la PRECISAR del hero probablemente rompa 1-2 checks de string exacto. La matriz ya lo declara en Riesgo; en misión 2 habrá que actualizar esos asserts al texto nuevo, no el texto al test.

**Alcance respetado:** esta revisión no propone cambios de diseño ni de funcionalidad; solo valida coherencia discursiva de la matriz.

## 5. Auditoría de Heimdall — ADVERSARIAL

⬡ heimdall | Proyecto_X | landing · Auditoría forense sobre la matriz (baseline `cea50e0`)

**Veredicto global: OBSERVADO** — la matriz es sólida y no propone nada fuera de contrato, pero registra 1 punto débil que el responsable debe conocer antes de aprobar, y 1 salvedad de independencia.

**Salvedad de independencia (declarada, no ocultada):** esta auditoría se ejecutó dentro de la misma sesión y contexto que la autoría de la matriz, bajo el contrato de identidad `heimdall` (rol auditor, solo lectura, `edit:false`). La independencia es **procedimental** (contrato + ausencia de mutación durante la revisión), no organizacional. Si el Arquitecto exige auditoría con contexto separado, este dictamen debe repetirse en sesión limpia.

Respuestas a las 7 preguntas obligatorias de §7:

1. **¿La categoría se identifica claramente? — SÍ, con matiz.** Tras las 2 precisiones, «gobierno de los proyectos» aparece en el hero. Matiz: la frase rectora literal «Framework para el gobierno de proyectos con agentes de IA» no aparece verbatim en ninguna página — la versión del hero es paráfrasis funcional («…en los que trabajan tus agentes de IA»). Aceptable porque la directiva prohíbe repetir frases como decoración; la categoría queda identificable por significado. **No es desvío.**
2. **¿Se diferencia el gobierno del proyecto de la orquestación? — SÍ.** «El gobierno pertenece al proyecto, no al agente» (H2 de Referencia), «El sistema controla. El agente interpreta. Tú decides.» (Confianza) y la aclaración CLI de Primeros pasos establecen la diferenciación sin ambigüedad. Ninguna página sugiere orquestación ni reemplazo del agente.
3. **¿La continuidad es beneficio y no garantía absoluta? — OBSERVADO.** El cuerpo del sitio la trata correctamente («sin depender únicamente», «puede retomarse», sección de fallos como problema). **Punto débil concreto:** el tagline del hero — «Proyectos que conservan su rumbo, sus reglas y su **memoria**» / "Projects that keep their course, their rules and their **memory**" — usa «memoria» sin calificador inmediato. La directiva prohíbe «memoria infalible» y «sin pérdida de contexto» como promesa incondicional; aquí no hay promesa explícita, pero un lector rápido puede leerlo como capacidad absoluta. La matriz lo marca CONSERVAR con observación — **coincido en no bloquear**, pero recomiendo al responsable decidir conscientemente: conservar la metáfora (defendible por «keep» + contexto del sitio) o PRECISAR a «su registro» / "their record". Costo del cambio: una palabra; riesgo: tocar tagline de marca.
4. **¿El visitante entiende qué obtiene antes de los mecanismos? — SÍ.** Hero (beneficio en la 2ª cláusula), «Cada tarea deja algo más que un resultado» (H1), «What you'll get» de Primeros pasos y el H1 de Confianza entregan valor antes de tecnicismos.
5. **¿Contradicciones entre páginas? — NINGUNA detectada.** Verificado: PyPI 0.9.0 vs fuente 1.0.0 (Start↔Trust coherentes); «cuatro convenciones» + «no limita a cuatro agentes» (Reference↔Trust límites); scope proyecto/workspace (Inicio↔Referencia artifacts); ejemplo conductor literal idéntico (Inicio↔Referencia).
6. **¿Amenaza animaciones/ergonomía/interacciones? — NO.** Las 2 precisiones son cambios de texto en un `<p>` y un `<h2>`. Cero cambios de markup, CSS, JS ni `#app-data`. No tocan componentes protegidos.
7. **¿Afirmaciones respaldadas por la versión citada? — SÍ.** Ninguna propuesta añade afirmación de capacidad: «governance references» describe vías ya verificadas en Trust (sync-harnesses → 4 archivos, commit 3903339; `arqux serve` stdio). La categoría «framework para el gobierno…» es posicionamiento, no claim técnico.

**Desvíos listados:**
- **D-01 (observación, decisión del propietario):** «su memoria / their memory» en tagline del hero — candidata a PRECISAR si el responsable prefiere cero ambigüedad de memoria.
- **D-02 (informativo):** la frase rectora literal no aparece verbatim en ninguna página tras la matriz; la directiva no la exige literal, pero el responsable puede quererla en un punto concreto (p.ej. `#next` de Inicio ya cubre su variante).

**Recomendación de endurecimiento:** si se aprueba, ejecutar misión 2 limitada a los 2 PRECISAR autorizados (+D-01 si el propietario lo decide), actualizar los asserts de `t16_home.py` que fijen el párrafo hero, y repetir la batería completa antes de reportar.

## 6. Punto de parada

**Entregable completo:** matriz editorial + inventario de invariantes + revisión de Jarvis (APROBADO con 2 observaciones no bloqueantes) + auditoría de Heimdall (OBSERVADO — 2 desvíos listados, 1 decisión del propietario pendiente).

**Ejecución detenida conforme a §8.** No se modificó HTML, CSS, JavaScript, textos publicados ni recursos gráficos. Los cambios propuestos (2 precisiones × 2 idiomas, más D-01 si el propietario lo decide) requieren aprobación expresa del responsable antes de la segunda misión.
