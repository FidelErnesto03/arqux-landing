# Contrato discursivo — CYCLE-02 · Misión 1
## ARQUX-WEB-DISCURSO-001 · Alfred (SES005) · Baseline: `5375366`

**Compuerta:** aprobación del propietario. Este documento decide QUÉ debe conservarse, precisarse o retirarse; los textos literales se redactan en Misión 2.
**Insumos:** `manifesto-arqux-web-discurso-001.md` · `mision0-baseline.md` (D-M0-01…07) · `analisis-discursivo-v8.md` · `evaluacion-sim03/sim-03-report.md`.

---

## 1. Posicionamiento rector (formalizado)

- **Categoría:** «Framework para el gobierno de proyectos con agentes de IA» — literal del manifiesto §2.1.
- **Ámbito personal (§2.2):** el gobierno corresponde a **una persona**; los agentes, modelos y harnesses participan. Por decisión del propietario **D-M1-01** este ámbito se comunica en **segunda persona** («tus proyectos» / "your projects") — la fórmula «gobierno personal» / "personal governance" queda descartada por ambigüedad (roza «uso personal/hobby», que el manifiesto excluye explícitamente).
- **Protagonista:** el proyecto del usuario. Los agentes, modelos y harnesses son participantes.
- **Beneficio central:** continuidad del trabajo y conservación de los criterios del proyecto — beneficio, nunca garantía.
- **Diferenciación:** no reemplaza agentes, no es orquestador, no es plataforma multiusuario (Platform = dirección futura, §2.3).
- **Lema del hero (D-M1-02, jerarquía B por D-M1-03):** «Tus agentes cambian. Tus proyectos evolucionan. Tu criterio permanece.» / "Your agents change. Your projects evolve. Your judgment endures." — el propietario evaluó tagline vs H1 y eligió **H1** por mayor impacto de primera impresión (tríada autorreconocible + arco problema→beneficio). El aforismo rector «Cada tarea deja algo más que un resultado» / "Every task leaves more than a result." se **reubica** al slot `.hero-portable` como tagline de apoyo — elemento rector preservado, no retirado. `#next` expande el motivo con «decisiones y evidencia» y las rutas. Resuelve el cabo suelto D-01 de la auditoría v8: ni el lema ni el tagline contienen «memoria» sin calificar.

## 2. Audiencias prioritarias

Derivadas de los 6 segmentos de sim-03 (24 personas, todas `util_condicionada`):

| # | Audiencia | Dolor dominante (evidencia sim-03) | Qué debe llevarse |
|---|---|---|---|
| A1 | **Quien retoma trabajo** — dev/tech lead que cambia de agente, sesión o herramienta | «La página no muestra continuidad entre sesiones/harnesses» (N05, N06, N22, N23) | Problema + beneficio + ruta de prueba |
| A2 | **Quien audita** — compliance, seguridad, auditoría interna | «Evidencia/atribución/exportación» 24/24; «no hay prueba de contexto de decisión con agente real» (N07, N17–N20) | Qué está comprobado, con qué límite |
| A3 | **Quien integra** — plataforma, harness, tooling | «No articula con LangGraph/MCP/orquestador existente» (N03, N08, N14) | Mecánica real + límites de integración |

Audiencias secundarias cubiertas por las mismas páginas: juniors/maintainers (fricción de instalación, N21/N24) y consultores/handoffs (N09–N12).

## 3. Beneficio central y sus límites

**Central:** continuidad del trabajo + conservación de criterios del proyecto.
**Complementarios (§IV):** consistencia, control, trazabilidad, portabilidad, aprendizaje gobernado.
**Límites que el discurso DEBE conservar visibles:**
- Las referencias solo ayudan si la integración las recibe y las usa.
- Guardar una instrucción ≠ obediencia del agente; registrar ≠ auditar todo; conservar decisión ≠ comprensión por otro agente.
- La prueba CLI de Primeros pasos no demuestra continuidad entre agentes (declarado).
- La evidencia dogfooding (D-M0-07) es real pero acotada: identidad+contexto persistieron en los artefactos de gobernanza a través de procesos distintos; no equivale a prueba de dos agentes operando una tarea conjunta.

## 4. Vocabulario institucional (canónico ES/EN)

| Concepto | ES | EN | Regla de uso |
|---|---|---|---|
| Categoría | framework para el gobierno de proyectos con agentes de IA | framework for governing projects with AI agents | Forma rectora; no reducir a «gestor de contexto/memoria»; el ámbito personal se expresa en segunda persona, no como adjetivo (D-M1-01) |
| Lo que se conserva | referencias de gobierno | governance references | Reglas+contexto+decisiones+evidencia del proyecto |
| Beneficio | continuidad del trabajo | work continuity | Beneficio, no garantía; siempre calificada |
| Ámbito | una persona gobierna — expresado en segunda persona («tus», "your") | one person governs — second person ("your") | El gobierno es de una persona; agentes participan; nunca insinuar multiusuario. Nunca «gobierno personal» ni «uso personal» |
| Roles | proyecto · agente · modelo · harness · usuario | project · agent · model · harness · user | «equipo/team» retirado del rol decisor → ver §6 P-04 |
| Productos | ArqUX Framework (actual) · ArqUX Platform (dirección futura) | ArqUX Framework · ArqUX Platform | Nunca atribuir capacidades de Platform al Framework |
| Niveles de evidencia | ejecutado y reproducido · verificado en código · reportado · pendiente · fuera de alcance | execution-tested · verified in source · reported · pending · out of scope | Ya implementados en Confianza; usar siempre que se afirme capacidad |
| Casos | prueba CLI (sin agente) · dogfooding de gobernanza | CLI test (no agent) · governance dogfooding | Distinguir estrictamente |

**Expresiones vetadas (§5.3, confirmado 0 violaciones actuales):** memoria perfecta, nunca pierde contexto, cualquier agente funciona, auditoría completa, compatibilidad universal, gobierno autónomo, colaboración multiusuario — y toda formulación equivalente.

## 5. Reglas de afirmación

1. Toda afirmación comprobable → capacidad + versión/revisión + procedimiento + resultado + límite (formato Trust existente).
2. Dogfooding solo con alcance exacto: «la identidad del agente y el contexto del proyecto persistieron en los artefactos de gobernanza a través de múltiples sesiones y procesos» — nunca «probado en N harnesses» ni «continuidad demostrada entre agentes».
3. La adhesión en 9 harnesses sigue siendo **reportada por el proyecto** hasta que existan fichas de prueba.
4. PyPI 0.9.0 vs fuente 1.0.0: declarar la brecha donde ya se declara; evaluar en M2 si necesita más visibilidad (24/24 la mencionan).
5. Ningún texto nuevo que el sitio no pueda respaldar con Trust o con artefactos de gobernanza.

## 6. Matriz de decisiones (afirmación → decisión)

### CONSERVAR (verificado conforme — no se toca)

| Elemento | Ubicación | Justificación |
|---|---|---|
| Aforismo «Cada tarea deja algo más que un resultado» / "Every task leaves more than a result" | Inicio → `.hero-portable` | Frase rectora del manifiesto, texto intacto, **reubicada** como tagline de apoyo al H1-tríada (D-M1-03) |
| Sección `#failures` completa (5 modos de ruptura) | Inicio | Problema reconocible = mecanismo de identificación (22/24 valoran honestidad) |
| Demo `#local` + ejemplo conductor | Inicio↔Referencia | Literalmente idéntico EN/ES; continuidad de ejemplo exigida |
| `#next` «El trabajo cambia… criterios permanecen por proyecto, entre agentes» | Inicio | Expansión del lema del hero (D-M1-02, opción A): repite el motivo en forma desarrollada y añade «decisiones y evidencia» + rutas — motivo al inicio, desarrollo al cierre |
| Eyebrow hero «For people who run projects…» / «Para quien gestiona proyectos…» | Inicio | Ya comunica el ámbito de una persona en registro personal; sostiene D-M1-01 sin cambios |
| `#workflow` completo (etapas, metas, modal con case) | Referencia | Contrato v7 cumplido; ejemplo conductor coherente |
| `#dimensions` (hexágono, 6 dims, scope en details) | Referencia | Representación conceptual honesta con límites por dimensión |
| `#artifacts` (inspector, aviso ilustrativo, lección≠regla) | Referencia | Ámbitos proyecto/workspace correctos; advertencias esenciales |
| `#format` (comparador, nota correspondencia, disclaimer codec) | Referencia | Precisión sobre qué prueba el certificado |
| H2 «El gobierno pertenece al proyecto, no al agente» | Referencia `#compatibility` | Frase de diferenciación literal |
| `#intro`+`#first-task` de Primeros pasos (CLI sin agente declarado) | Start | Distinción prueba-CLI↔continuidad ya explícita |
| Confianza completa (3 responsabilidades, filtros de evidencia, 5 límites, codec) | Trust | El activo de credibilidad; sim-03: «no la suavice» |
| Tarjetas `#continue` agente/CLI con límite en B | Referencia | v7 correcto |

### PRECISAR (decisión tomada — texto literal en M2)

| # | Elemento | Decisión | Justificación |
|---|---|---|---|
| P-01 | Párrafo hero Inicio EN/ES | **Formulación del propietario:** ES «ArqUX es un framework para gobernar tus proyectos, ejecutados por agentes de IA.» / EN "ArqUX is a framework for governing your projects, executed by AI agents." — resto del párrafo (beneficios) sin cambios; el matiz léxico final (p.ej. ejecutados/desarrollados/built) se cierra en M2 | Categoría §2.1 en forma verbal + ámbito §2.2 vía «tus/your» (D-M1-01); resuelve D-M0-01/02 con evidencia sim-03 (23/24 multiuser) |
| P-02 | `<meta name="description">` Inicio EN/ES (+ og:/twitter: si existen) | Derivar de las formulaciones P-01 + P-07: categoría en forma verbal + lema o su esencia | D-M0-03: superficie indexable desalineada con la precisión aprobada |
| P-03 | H2 `#connect` Primeros pasos | «…referencias de gobierno del proyecto…» / "…the project's governance references…" (propuesta v8 ya auditada) | Alinea vocabulario con Referencia y categoría |
| P-04 | «Team/Equipo» como rol decisor | **Retirar del rol decisor**: kicker «Team decision/review» → decisión/proyecto; `case`/`who` «The team…»/«El equipo…» → el usuario/proyecto; h3 Trust «Team»/«Equipo» → «You»/«Tú» (cierra con «You decide»/«Tú decides»); «several teams or machines» → «several projects or machines» | §2.2 gobierno personal: «equipo» sugiere multi-persona; «Tú decides» ya existe como H2 — el h3 debe ser coherente |
| P-05 | Afirmación dogfooding | Añadir como **fila de evidencia en Confianza** (nivel «verificado»), con alcance exacto D-M0-07; NO en portada | Es evidencia real verificable; Trust es donde vive la evidencia; alcance honesto sin marketing |
| P-06 | Vocabulario de beneficios §IV | Alinear la prosa existente a los términos canónicos (continuidad/consistencia/control/trazabilidad/portabilidad/aprendizaje gobernado) sin añadir listas ni secciones nuevas | D-M0-05: nombrarlos no requiere componente nuevo; forzar una lista violaría «no todo necesita explicarse» |
| P-07 | H1 + tagline hero Inicio EN/ES | **Jerarquía B aprobada (D-M1-03):** el H1 pasa a ser el lema rector — ES `Tus agentes cambian.<br>Tus proyectos evolucionan.<br>Tu criterio permanece.` / EN `Your agents change.<br>Your projects evolve.<br>Your judgment endures.` (3 líneas, una por tiempo); `.hero-portable` pasa a ser el aforismo — ES «Cada tarea deja algo más que un resultado.» / EN "Every task leaves more than a result." | La tríada es más autorreconocible y comunica problema→beneficio (impacto de primera impresión > aforismo abstracto); el aforismo se preserva como corona de apoyo; `t16_home` assert del H1 se actualiza en M4 |

### RETIRAR

Ninguna **afirmación** actual requiere retirada — el escaneo §5.3 y la revisión página a página no encontraron violaciones ni claims sin respaldo. Matiz: P-04 retira el *término* «equipo/team» del rol decisor, pero como sustitución dentro de elementos conservados (PRECISAR), no como retiro de una afirmación.

### FUERA DE ALCANCE (registrado para ciclos posteriores — no proponer en este ciclo)

Prueba real de continuidad entre dos agentes/harnesses (producto), imagen Docker/oficial, integración con tickets/ADRs/LangGraph/Airflow, RBAC/retención/PII/modelo de amenazas, especificación pública de contratos MCP, publicación PyPI 1.0.0, test humano de 15 s + piloto real (Misión 5).

## 7. Lo que este contrato NO autoriza

- Ningún cambio de HTML/CSS/JS hasta Misión 2 + aprobación explícita (Misión 4 implementa).
- Ninguna nueva sección, componente, animación ni página.
- Ninguna afirmación de capacidad no presente en Trust o en artefactos de gobernanza.
- Merge, publicación ni despliegue.

## 8. Compuerta

**Pendiente:** aprobación del propietario de este contrato y de la matriz de decisiones. Con ella → Misión 2 (textos literales propuestos por elemento).
