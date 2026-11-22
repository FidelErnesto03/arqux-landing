# sim-03 — Evaluación web guiada: uso y utilidad real de ArqUX

**Fecha:** 2026-11-22
**Fuente:** `http://localhost:8137/es/` (landing `preliminar-b` de Proyecto_X, servida en local).
**Método:** 24 personas neutrales, navegador local (Chrome vía Playwright), recorrido real por 4 páginas: home, confianza, referencia y empezar.
**Modelo:** `deepseek-v4.1-flash` vía LiteLLM (fallbacks: `minimax-m3.1-flash`, `vatrox-llm`).
**Datos:** 24 evaluaciones finales; 96 evaluaciones de página; capturas y textos renderizados por persona.
**Veredicto global:** **24/24 utilidad condicionada**. 22 con decisión 2/3 (piloto condicionado); 2 con 1/3 (no por ahora). **Nadie dijo “no sirve” y nadie dijo “lo adopto ya”.**

---

## 1. Veredicto ejecutivo

La página logra algo que la simulación anterior no lograba: **que el visitante entienda qué es ArqUX**. En esta corrida limpia, las 24 personas lo describen como un **framework/capa de gobernanza de contexto, decisiones y evidencia para proyectos con agentes**. Ninguna lo confunde con un orquestador, un modelo o una herramienta de UX.

Pero la página **no logra que el visitante crea que el beneficio central está probado**. La utilidad es real y concreta, pero condicionada:

- entienden el problema y el mecanismo;
- encuentran un caso de uso en su trabajo;
- valoran la honestidad de la página sobre sus límites;
- pero no ven una prueba de **continuidad entre agentes, sesiones y harnesses**;
- y chocan con condiciones operativas: versión 1.0.0 vs 0.9.0, coordinación multiusuario, integración con su flujo, permisos/retención/evidencia, fricción de instalación.

La frase que resume el resultado:

> **La página vende bien el “qué” y el “por qué”. Todavía no prueba el “cómo funciona en la práctica” ni el “esto ya funciona en mi realidad”.**

---

## 2. Método

- **24 personas neutrales**, 6 segmentos: tech leads, desarrolladores que retoman trabajo, consultores/handoffs, plataforma/harness, auditoría/compliance y juniors/maintainers.
- Cada persona empieza en `/es/`, lee la página renderizada, responde preguntas de producto y elige el siguiente enlace.
- Cobertura mínima: home, referencia, empezar y confianza. Todas la cumplieron.
- **Rutas reales:** 12/24 fueron a Confianza como segunda página; 8 a Referencia; 4 a Empezar. La página de confianza es el segundo destino más elegido.
- El agente no recibe un brief sintetizado: recibe el texto real de la página, los enlaces reales y una captura.
- No se premia la opinión positiva. Se registra utilidad, beneficio, fricción, evidencia y veredicto.

### Rutas más frecuentes

| Ruta | Personas |
|---|---:|
| home → confianza → referencia → empezar | 7 |
| home → referencia → empezar → confianza | 7 |
| home → confianza → empezar → referencia | 5 |
| home → empezar → referencia → confianza | 3 |
| home → empezar → confianza → referencia | 1 |
| home → referencia → confianza → empezar | 1 |

---

## 3. Lo que la página logra

### 3.1 La categoría se entiende

Las 24 personas describen a ArqUX como capa/framework de gobernanza de contexto, decisiones y evidencia. Ninguna lo llama orquestador.

> “ArqUX se me presenta como una capa de gobernanza y evidencia para proyectos con agentes, no como un orquestador.” — N03, Paula Cárdenas

> “Veo a ArqUX como un framework abierto y local que ordena el gobierno por proyecto y que es inusualmente honesto sobre sus límites.” — N17, Ana Lucía Paredes

> “ArqUX es un framework de gobernanza de contexto para proyectos con agentes de IA: guarda identidad, reglas, contexto, decisiones y evidencia como referencias.” — N16, Martín Quiroga

### 3.2 El problema se reconoce

La home y la escena de “dos sesiones, una decisión” conectan con el dolor real: perder el criterio, reexplicar, reconstruir al cambiar de agente o sesión.

> “Sí reconozco el dolor: no entender por qué se decidió algo y terminar preguntando al equipo. La página describe eso como que ‘recuperar el criterio puede costar más que recuperar el resultado’.” — N21, Javier Ponce

> “Aborda justo mi dolor: cuando cambia la persona o el agente, hay que reexplicar el criterio.” — N01, Sofía Herrera

### 3.3 La honestidad sobre límites genera confianza

22 de 24 personas mencionan positivamente que la página separa lo probado, lo comprobado en código y lo pendiente, y que declara límites.

> “La página es honesta al separar lo probado en ejecución, lo comprobado en código y lo reportado o pendiente, y al declarar límites como que el hash no prueba autoría o que la obediencia del agente no está garantizada.” — N07, Camila Ortega

> “El gesto de clasificar cada afirmación según evidencia y de admitir límites… justo por eso no puedo tomarlo como resuelto.” — N12, Ignacio Fuentes

### 3.4 La primera tarea es concreta y reproducible

La página de Empezar da un caso verificable: instalar una revisión fijada, crear un archivo, cerrar una tarea, ver el hash y el evento PULSE.

> “El recorrido revisable, las referencias persistentes del proyecto y la separación entre lo que controla el código, interpreta el agente y decide el equipo apuntan a mi necesidad.” — N07, Camila Ortega

> “Probaría en un repo de servicios de prueba… ejecutar T-001, contrastar el SHA-256 con la evidencia, correr `sync-harnesses`, verificar qué archivo lee mi cliente y usar `drift-check`.” — N13, Tomás Ibarra

---

## 4. Lo que la página no logra

### 4.1 No prueba la continuidad, que es el beneficio central

La página muestra una tarea por CLI, **sin agente**, y ella misma advierte que eso no demuestra continuidad entre harnesses. Para las personas, ese es exactamente el punto que hay que probar.

> “La página no demuestra que el contexto sobreviva entre orquestador y harness, ni cómo se relaciona con LangGraph.” — N03, Paula Cárdenas

> “La prueba no demuestra continuidad entre harnesses.” — N13, Tomás Ibarra

> “No hay prueba de continuidad entre harnesses; la prueba CLI se ejecutó sin agente.” — N22, Valentina Rueda

> “No puedo probar que el contexto exacto del agente al decidir quede registrado y sea consultable; la página solo lo muestra como comprobado en código.” — N07, Camila Ortega

### 4.2 No muestra cómo se registra y se recupera una decisión

La página explica las seis dimensiones y las referencias del proyecto, pero no da un ejemplo paso a paso de “registro esta decisión con su criterio y otro agente la consulta después”.

> “La home y la página de inicio no muestran cómo se registra ni se recupera el motivo de una decisión; solo muestran una tarea, un archivo, un hash y PULSE.” — N21, Javier Ponce

> “La página no dice cómo se consulta ni cómo se exporta el contexto de una decisión concreta.” — N07, Camila Ortega

> “No hay un registro canónico de decisiones con su porqué demostrado en la página.” — N11, Esteban Cordero

### 4.3 La integración con el flujo real no está resuelta

Las personas no saben cómo convive ArqUX con tickets, ADRs, chat, PRs, LangGraph, MCP, Airflow o Kubernetes. La página no lo dice.

> “La página no dice que ArqUX se integre con Airflow ni SQL, ni que sincronice la memoria del agente con el estado real del pipeline.” — N08, Diego Salazar

> “La página no dice cómo se integra con issues, plantillas de PR ni con la revisión entre personas.” — N12, Ignacio Fuentes

> “No menciona LangGraph ni detalla cómo se articula con un orquestador existente.” — N03, Paula Cárdenas

### 4.4 La brecha de versión bloquea la confianza

La página declara 1.0.0 desde fuente y 0.9.0 en PyPI. Para casi todas las personas, eso impide fijar una revisión y tratar la instalación como reproducible.

> “Si no logro instalar 1.0.0 desde la fuente, no arranco; PyPI muestra 0.9.0.” — N21, Javier Ponce

> “El desfase de versión entre fuente 1.0.0 y PyPI 0.9.0 queda sin explicación en la página.” — N03, Paula Cárdenas

### 4.5 La coordinación multiusuario no está demostrada

El journal es local y la plataforma alojada no está en 1.0.0. Para equipos de 8 personas, consultores o maintainers, eso es un bloqueo.

> “No hay plataforma multiusuario alojada en 1.0.0, y mi equipo es de ocho personas.” — N01, Sofía Herrera

> “No hay servicio multiusuario alojado, así que no me sirve para coordinar contribuyentes externos en simultáneo.” — N12, Ignacio Fuentes

### 4.6 Seguridad, retención y auditoría formal

Para CISO, auditoría y compliance, la página es honesta pero insuficiente: falta modelo de amenazas, RBAC, retención/PII, exportación y atribución.

> “El hash detecta cambios pero no identifica al autor.” — N17, Ana Lucía Paredes

> “La ausencia de controles explícitos de retención, PII, acceso y borrado bloquea mi uso con datos sensibles de salud.” — N19, Mariana Solís

> “La página no documenta RBAC completo ni permisos explícitos por herramienta y por dato.” — N20, Sebastián Bravo

---

## 5. Utilidad por segmento

### Tech leads (N01–N04)
- **Utilidad:** piloto acotado para reducir reexplicaciones y conservar criterio entre agentes/sesiones.
- **Condiciones:** coordinación de equipo, integración con ADRs/tickets, evidencia de continuidad real.
- **Veredicto:** condicionado, score 2 (N03 score 1 por la falta de articulación con LangGraph).

### Desarrolladores que retoman trabajo (N05–N08)
- **Utilidad:** retomar una incidencia o tarea sin reconstruir el criterio desde tickets, commits y chat.
- **Condiciones:** integración con PR/logs/tickets, prueba de que el contexto de decisión es consultable y exportable.
- **Veredicto:** condicionado, score 2.

### Consultores y handoffs (N09–N12)
- **Utilidad:** dejar un proyecto de cliente con reglas, decisiones y evidencia inspeccionables; facilitar el handoff.
- **Condiciones:** transferencia verificable entre organizaciones, registro canónico de decisiones, multiusuario.
- **Veredicto:** condicionado, score 2.

### Plataforma y harness (N13–N16)
- **Utilidad:** capa de gobierno por proyecto con CLI, archivos de instrucciones y MCP opcional.
- **Condiciones:** SLO, modo degradado, imagen oficial/Docker, contrato MCP, prueba de continuidad entre harnesses.
- **Veredicto:** condicionado, score 2.

### Auditoría, seguridad y compliance (N17–N20)
- **Utilidad:** evidencia por tarea, drift-check y referencias del proyecto; base para auditoría.
- **Condiciones:** modelo de amenazas, RBAC, retención/PII, exportación verificable, atribución (hash ≠ autor), plan de salida.
- **Veredicto:** condicionado, score 2.

### Juniors y maintainers (N21–N24)
- **Utilidad:** entender el producto y probar una primera tarea sin depender de un experto; dejar reglas para contribuyentes.
- **Condiciones:** instalación 1.0.0 sencilla, ejemplo de decisión de punta a punta, especificación MCP.
- **Veredicto:** condicionado; N24 score 1 por falta de contrato MCP público.

---

## 6. Temas transversales

Sobre el corpus de 24 evaluaciones finales:

| Tema | Personas que lo mencionan |
|---|---:|
| Brecha de versión 1.0.0 vs 0.9.0 | **24/24** |
| Integración con el flujo existente | **24/24** |
| Evidencia, atribución y exportación | **24/24** |
| Fricción de instalación/configuración | **24/24** |
| Utilidad ligada a contexto/decisión | **24/24** |
| Coordinación multiusuario/equipo | **23/24** |
| Honestidad y límites (positivo) | **22/24** |
| Seguridad/compliance | **16/24** |

---

## 7. Qué debe agregar la página

1. **Prueba de continuidad real, no CLI sin agente.** Un caso de dos agentes o dos harnesses: sesión A decide, sesión B retoma, el criterio se conserva y se verifica. Sin eso, el beneficio central queda como promesa.
2. **Ejemplo de “registrar una decisión → recuperarla después”.** Paso a paso, con el artifact y la consulta. La página explica el modelo, no la mecánica.
3. **Sección de versión y release.** Publicar 1.0.0 o decir claramente “source-only preview” con la ruta exacta y la razón de la brecha con PyPI.
4. **Integración y convivencia.** Cómo se articula con tickets, ADRs, chat, PRs, LangGraph, CrewAI, AutoGen y MCP; quién es dueño del estado; por qué no es un segundo orquestador.
5. **Multiusuario y equipo.** Qué está disponible en 1.0.0 y qué está pendiente; cómo se coordina un equipo de 8 personas con journal local.
6. **Paquete de confianza para CISO/auditoría.** Modelo de amenazas, RBAC, retención/PII, exportación verificable, atribución, plan de salida.
7. **Instalación reproducible.** Imagen oficial/Docker o una ruta que no dependa de instalar desde fuente en modo editable.
8. **Mantener la honestidad.** La página de Confianza es un activo: separa lo probado, lo comprobado y lo pendiente. No la suavice.

---

## 8. Conclusión

La página **comunica bien el producto y el problema**. La categoría quedó clara en esta corrida limpia: ArqUX es una capa de gobernanza de contexto, no un orquestador. La honestidad sobre límites es una fortaleza real.

Lo que falta no es más copy: es **prueba del beneficio central** y **condiciones de adopción**. La página demuestra una tarea por CLI con evidencia; no demuestra que el contexto sobreviva a un cambio de agente, sesión o harness. Y sin esa prueba, la utilidad queda —honestamente— en “piloto condicionado”.

La frase que mejor resume el resultado:

> **“Me sirve, pero todavía no me alcanza para creer que el contexto sobrevive.”**

---

## 9. Limitaciones

- **24 personas simuladas, no humanas.** Generan hipótesis y lenguaje; no sustituyen una prueba con usuarios reales.
- **Una sola corrida** por persona; sin repetición para medir estabilidad.
- **Texto renderizado**, no visión. Las capturas se guardaron como evidencia, pero el modelo no las analizó.
- **Cobertura mínima de 4 páginas**; la navegación fue libre dentro de esa restricción. No se exploraron a fondo las páginas de explorar, codec-cortex o comunidad.
- **Landing `preliminar-b`**, no la versión publicada en `arqux.ai`.
- **Modelo `deepseek-v4.1-flash`**; puede ser más consistente y verbal que un visitante real.
- No hubo piloto real ni medición de uso.

---

## 10. Artefactos

- `runs/full/N01…N24/` — recorrido, respuestas, páginas y capturas por persona.
- `runs/full/run-meta.json` — configuración y resumen de la corrida.
- `results/finals.json` — 24 evaluaciones finales.
- `results/aggregate.json` — conteos, rutas y temas.
- `results/utility-map.md` — mapa de utilidad por persona.
- `runs/pilot/` — piloto de 3 personas.
- `page/` — capturas iniciales de la landing real.
- `protocol/` — preguntas, rúbrica y esquema.
- `personas/neutral-roster-24.md` — roster neutral.

---

*Fin del informe sim-03. La página está más cerca de “me sirve” que de “lo adopto”; el siguiente paso es prueba reproducible, no más adjetivos.*
