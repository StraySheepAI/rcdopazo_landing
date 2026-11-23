// Every entry contains a word-specific reading. The cited dictionary supports only the linguistic step.
// The other seven steps are editorial DIMA proposals, not additional historical claims.
export type EditorialEntry = { palabra: string; url: string; diccionario?: string; referencias?: { titulo: string; url: string }[]; pasos: [string, string, string, string, string, string, string, string] };
export const EDITORIAL_ENTRIES: EditorialEntry[] = [
  { palabra: "Normal", url: "https://dle.rae.es/normal", pasos: [
    "El DLE remite al latín normālis. Sus usos actuales incluyen lo habitual y lo ajustado a una norma; también tiene un sentido geométrico. Esta fuente no justifica dividir la forma española en sílabas con significados independientes.",
    "Ajuste respecto de una referencia: una diferencia se compara con un patrón y se ubica dentro o fuera de él.",
    "Algo se observa, una norma se toma como referencia y una comparación produce la clasificación. La operación cambia si cambia el patrón; no describe por sí sola la naturaleza de una persona.",
    "Frecuente no equivale a correcto, saludable ni deseable. Una norma técnica y una expectativa social tampoco tienen el mismo alcance.",
    "La relación une a quien clasifica, lo clasificado y la referencia elegida. Hay agencia al preguntar quién fijó esa referencia, para qué sirve y si admite excepciones.",
    "Reemplazar «esto no es normal» por una descripción comprobable: es poco frecuente en este contexto, o no cumple esta regla concreta. Después decidir si la regla ayuda.",
    "DIMA propone leer normal como una posición relativa a un patrón, que necesita contexto antes de convertirse en un juicio sobre lo posible.",
    "Antes de ajustarme, miro la regla con la que me miden."
  ]},
  { palabra: "Miedo", url: "https://dle.rae.es/miedo", pasos: [
    "El DLE lo deriva del latín metus, referido al temor. En español nombra angustia ante un daño real o imaginado y aprensión ante algo no deseado. No se segmenta miedo en supuestas raíces españolas.",
    "Anticipación protectora: la atención se orienta hacia una amenaza posible antes de que su desenlace esté confirmado.",
    "Una situación se interpreta como amenaza para algo valorado. La interpretación puede movilizar cautela o retirada; sentirla no prueba que el daño vaya a ocurrir.",
    "Distinguimos amenaza, probabilidad, sensación y certeza. Cautela y parálisis no son lo mismo, ni valentía significa ausencia de miedo.",
    "El vínculo está entre quien teme, lo que quiere preservar y la situación. La agencia puede estar en pedir información, buscar apoyo o reducir una exposición concreta.",
    "Cambiar «no puedo porque tengo miedo» por «temo este daño; voy a distinguir qué sé, qué imagino y qué acción prudente puedo tomar».",
    "DIMA propone leer miedo como una orientación ante una amenaza percibida, que puede informar una decisión sin sustituirla.",
    "Escucho la alarma y después miro qué está pasando."
  ]},
  { palabra: "Transmutación", url: "https://dle.rae.es/transmutación", pasos: [
    "El DLE remite al latín transmutatio, -ōnis y define la acción y el efecto de transmutar. Registra también trasmutación. La lectura del cambio que sigue es metodológica; no demuestra una transformación física de la materia.",
    "Paso de una configuración a otra: lo que ya existe cambia de organización o de relación.",
    "Hay un estado inicial, una operación y una diferencia reconocible después de ella. Para afirmar un cambio hace falta describir qué cambió y qué permaneció.",
    "Renombrar no equivale a transformar. Tampoco son idénticos cambio, sustitución, adaptación y mejora: cambiar no garantiza mejorar.",
    "La relación involucra una situación y a quienes pueden intervenir en ella. La agencia se reconoce distinguiendo condiciones modificables de límites presentes.",
    "Elegir una relación concreta, modificar una condición y observar su efecto. Por ejemplo, pasar de una orden ambigua a un acuerdo verificable.",
    "Para DIMA, transmutación es una reconfiguración cuyo efecto puede describirse, en lugar de una promesa de volverse otra persona.",
    "Cambio una relación y observo qué se vuelve posible."
  ]},
  { palabra: "Molde", url: "https://dle.rae.es/molde", pasos: [
    "El DLE sitúa su procedencia en el catalán antiguo motle. Nombra instrumentos que dan forma y, por extensión, modelos de referencia. No se deriva aquí de una división simbólica de sus letras.",
    "Conformación: una materia o práctica recibe límites que orientan la forma que podrá adoptar.",
    "Un material entra en relación con una matriz y un procedimiento. El molde habilita una forma repetible y limita otras; su utilidad depende del resultado buscado.",
    "Un modelo puede orientar sin tener que imponerse. Repetición, aprendizaje y uniformidad son operaciones diferentes.",
    "La relación une a quien diseña, quien utiliza y aquello que toma forma. Hay agencia al elegir el molde, adaptarlo o reconocer cuándo dejó de servir.",
    "Preguntar qué parte del modelo facilita la tarea y qué parte exige una adaptación innecesaria. Conservar la primera y probar una variación en la segunda.",
    "DIMA propone leer molde como una estructura que hace reproducible una forma a costa de restringir otras posibilidades.",
    "Uso el molde mientras me ayuda a dar forma."
  ]},
  { palabra: "Juego", url: "https://dle.rae.es/juego", pasos: [
    "El DLE lo remite al latín iocus, ligado a la broma y la diversión. En español también nombra actividades con reglas y otros usos específicos. No todas las acepciones se reducen al entretenimiento.",
    "Exploración dentro de un marco: se prueban movimientos cuyo sentido depende de unas reglas.",
    "Participantes, posibilidades y límites organizan una actividad. Cambiar una regla puede cambiar la experiencia sin cambiar a quienes participan.",
    "Jugar no implica ausencia de consecuencias. Competencia, diversión y aprendizaje pueden coincidir, pero ninguna de ellas está garantizada por la otra.",
    "La relación está entre participantes y reglas. La agencia aparece al conocer el marco, acordar límites y decidir qué movimientos hacer dentro de él.",
    "Ante una situación rígida, ensayar una alternativa pequeña y reversible: cambiar un turno, una pregunta o una condición, y observar el resultado.",
    "DIMA propone leer juego como un espacio organizado para explorar posibilidades mediante acciones y respuestas.",
    "Conozco las reglas para descubrir qué puedo jugar."
  ]},
  { palabra: "Trabajo", url: "https://dle.rae.es/trabajar", pasos: [
    "El DLE relaciona trabajar con el latín vulgar reconstruido *tripaliāre y tripalium. Hoy registra actividad física o intelectual, empleo y elaboración de materia. Ese antecedente no demuestra que todo trabajo sea tortura ni autoriza una etimología alternativa de tri- y palium.",
    "Aplicación de capacidad a una tarea: una actividad sostenida busca producir un efecto.",
    "Una persona o un conjunto de medios actúa sobre una tarea bajo condiciones concretas. El resultado depende también de herramientas, tiempo, recursos y coordinación.",
    "Trabajo no equivale solo a empleo remunerado. Esfuerzo, valor producido y reconocimiento tampoco crecen siempre en la misma proporción.",
    "La relación incluye a quien realiza la tarea, quien recibe su resultado y quienes fijan las condiciones. La agencia puede ejercerse al acordar alcance, medios y límites.",
    "Sustituir «tengo que trabajar más» por una pregunta precisa: qué resultado falta y qué condición impide obtenerlo. Ajustar esa condición antes de sumar horas.",
    "DIMA propone leer trabajo como una actividad organizada que transforma una situación, cuyo costo y sentido deben examinarse en contexto.",
    "No cuento solo lo que esfuerzo: miro qué transformo."
  ]},
  { palabra: "Persona", url: "https://dle.rae.es/persona", pasos: [
    "El DLE remite al latín persōna, con sentidos como máscara, personaje e individuo. La palabra actual también designa al ser humano y al sujeto de derecho. No se presenta per-sonare como una descomposición documentada por esta fuente.",
    "Identificación relacional: alguien es reconocido como interlocutor y participante, más allá de un papel puntual.",
    "Un individuo aparece ante otros dentro de funciones, nombres y derechos. El papel organiza una interacción, pero no agota a quien lo desempeña.",
    "Persona, personaje y función no son equivalentes. Un papel social tampoco prueba que la vida de alguien sea una máscara o un engaño.",
    "La relación une a alguien con quienes lo reconocen y con las condiciones de ese reconocimiento. La agencia incluye poder expresar una posición sin quedar reducido al rol asignado.",
    "En lugar de «vos sos así», describir una acción situada y abrir respuesta: hiciste esto en esta ocasión, ¿cómo lo entendés?",
    "DIMA propone leer persona como alguien que participa en relaciones y excede las funciones con las que se lo identifica.",
    "Puedo ocupar un papel sin quedar encerrado en él."
  ]},
  { palabra: "Éxito", url: "https://dle.rae.es/éxito", pasos: [
    "El DLE remite al latín exĭtus, salida. Registra el resultado favorable y, con menor uso, la terminación de un asunto. No se supone que la historia de la palabra determine qué resultados deberían valorar todas las personas.",
    "Llegada a un resultado valorado: un proceso se compara con aquello que se esperaba conseguir.",
    "Hay una acción, un resultado y un criterio de valoración. Sin declarar ese criterio, éxito puede nombrar logros muy diferentes.",
    "Reconocimiento público, dinero, satisfacción y cumplimiento de un objetivo no son equivalentes. Un buen resultado tampoco convierte a alguien en superior.",
    "La relación incluye a quien actúa, quienes evalúan y quienes reciben sus efectos. La agencia está en discutir el criterio y reconocer las condiciones que permitieron el resultado.",
    "Antes de empezar una tarea, escribir qué resultado sería suficiente y qué costos no se quieren asumir para alcanzarlo.",
    "DIMA propone leer éxito como una evaluación favorable de un resultado según criterios que conviene hacer visibles.",
    "Defino mi llegada antes de correr hacia ella."
  ]},
  { palabra: "Educar", url: "https://dle.rae.es/educar", pasos: [
    "El DLE deriva educar del latín educāre. Incluye orientar y desarrollar capacidades mediante ejercicios y ejemplos. No se identifica sin más con educere ni con una fórmula histórica de sacar lo que alguien lleva dentro.",
    "Desarrollo acompañado: una capacidad se ejercita y gana posibilidades en una relación de aprendizaje.",
    "Alguien aprende, alguien o algo orienta, y unas prácticas permiten contrastar lo aprendido. La operación necesita participación y condiciones, no solo transmisión de información.",
    "Informar, instruir, adiestrar y educar no son idénticos. Acompañar tampoco elimina la asimetría de responsabilidad entre quien enseña y quien aprende.",
    "La relación incluye a quien aprende, quien enseña y el contexto. La agencia del aprendiz crece cuando puede preguntar, ensayar y revisar lo recibido.",
    "Transformar una explicación cerrada en una situación que permita hacer, recibir una devolución y volver a intentar.",
    "DIMA propone leer educar como organizar condiciones para que una capacidad pueda desarrollarse y ponerse a prueba.",
    "Enseñar abre un ensayo que otra persona puede hacer suyo."
  ]},
  { palabra: "Esfuerzo", url: "https://dle.rae.es/esfuerzo", pasos: [
    "El DLE lo vincula a esforzar y al uso intenso de fuerza o actividad para superar dificultades. Es un sustantivo ligado al verbo; no se le atribuyen significados independientes a es- y fuerzo sin documentación adicional.",
    "Intensificación ante una resistencia: se movilizan recursos para sostener o modificar una situación.",
    "Una tarea presenta una dificultad y alguien aplica capacidad para resolverla. El esfuerzo depende tanto de esa dificultad como de los medios disponibles.",
    "Esfuerzo no equivale a sufrimiento, eficacia ni mérito. Una tarea puede exigir mucho porque está mal organizada, no porque tenga más valor.",
    "La relación une a quien actúa, la resistencia y los apoyos. La agencia incluye pedir medios, revisar el método y reconocer un límite, además de insistir.",
    "Precisar dónde está la resistencia y probar una herramienta o un cambio de secuencia antes de aumentar la intensidad.",
    "DIMA propone leer esfuerzo como una movilización de recursos frente a una dificultad, cuya dirección importa tanto como su intensidad.",
    "Oriento la fuerza antes de exigirle más."
  ]},
  { palabra: "Deber", url: "https://dle.rae.es/deber", pasos: [
    "El DLE remite el verbo a debēre. Distingue obligación, deuda, relación causal y usos de probabilidad; también registra el sustantivo deber. Una misma forma puede operar de modos distintos según la frase.",
    "Vinculación: una acción queda ligada a una obligación, una deuda o una expectativa.",
    "Alguien aparece obligado a hacer algo por una norma, un acuerdo o una interpretación. Para entender la operación hay que identificar la fuente y el alcance de esa obligación.",
    "Una obligación legal, un compromiso elegido y una expectativa ajena no son lo mismo. «Debe de estar» puede expresar probabilidad y no una orden.",
    "La relación incluye a quien queda obligado, aquello que se exige y quien puede exigirlo. La agencia depende de reconocer compromisos válidos y márgenes de negociación.",
    "Cambiar un «debo» impreciso por «acordé», «la regla exige» o «temo decepcionar». Elegir después qué acción corresponde.",
    "DIMA propone leer deber como una relación que vincula una acción con una exigencia cuyo origen debe poder nombrarse.",
    "Antes de obedecer al debo, pregunto de dónde viene."
  ]},
  { palabra: "Tiempo", url: "https://dle.rae.es/tiempo", pasos: [
    "El DLE deriva tiempo del latín tempus. Registra secuencia, duración, época, disponibilidad y otros sentidos. La lectura de organización que sigue no sustituye su significado como magnitud física.",
    "Ordenación del cambio: los acontecimientos se distinguen por su antes, su después y su duración.",
    "Una actividad ocupa un intervalo y se relaciona con otras mediante secuencias y plazos. Lo disponible para una tarea no es lo mismo que el tiempo medido por un reloj.",
    "Duración, urgencia y prioridad no son equivalentes. Estar ocupado tampoco demuestra que una actividad necesite ocupar todo el intervalo asignado.",
    "La relación une tareas, personas y plazos. La agencia aparece al acordar secuencias, explicitar dependencias y proteger intervalos para lo importante.",
    "Pasar de «no tengo tiempo» a nombrar qué ocupa el intervalo, qué compromiso puede moverse y qué límite necesita hacerse explícito.",
    "DIMA propone leer tiempo disponible como la relación entre una duración y los compromisos que la ocupan.",
    "Miro qué ocupa mis horas para elegir qué lugar doy."
  ]},
  { palabra: "Rutina", url: "https://dle.rae.es/rutina", pasos: [
    "El DLE remite al francés routine, relacionado con route. En español designa un hábito adquirido por repetición y también una secuencia reutilizable de instrucciones informáticas. No implica por definición un hábito perjudicial.",
    "Repetición estabilizadora: un recorrido conocido reduce la necesidad de decidir cada paso.",
    "Una secuencia se repite ante condiciones semejantes. La operación ahorra decisiones mientras esas condiciones siguen siendo pertinentes.",
    "Repetir no equivale a estar estancado. Un hábito, un ritual y una obligación pueden compartir acciones, pero difieren en función y sentido.",
    "La relación une a quien repite, el recorrido y la situación. La agencia incluye conservar lo que sostiene y detectar lo que se mantiene sin necesidad.",
    "Revisar una sola repetición: qué facilita, qué cuesta y qué ocurriría si se cambia un paso durante un período acotado.",
    "DIMA propone leer rutina como una secuencia estabilizada cuyo valor depende de seguir sirviendo a la situación.",
    "Repito lo que sostiene; reviso lo que dejó de servir."
  ]},
  { palabra: "Ganar", url: "https://dle.rae.es/ganar", pasos: [
    "El DLE presenta como posible, no segura, una procedencia gótica con influencia germánica. Sus sentidos incluyen adquirir y vencer. Se conserva esa incertidumbre histórica sin derivar de ella una supuesta esencia de codicia.",
    "Adquisición o ventaja: cambia a favor de alguien una cantidad, una posición o un resultado.",
    "Hay algo que se obtiene y un criterio que permite decir que se ganó. En una competencia el marco distribuye posiciones; en otros usos puede haber beneficio compartido.",
    "Ganar dinero, ganar tiempo y ganar una discusión no producen el mismo efecto. Obtener una ventaja no demuestra que el procedimiento haya sido justo.",
    "La relación incluye a quien gana, lo obtenido y quienes participan en su distribución. La agencia está también en elegir qué juego y qué costos aceptar.",
    "Antes de buscar una victoria, precisar qué se quiere obtener y qué relación podría dañarse al obtenerlo de esa manera.",
    "DIMA propone leer ganar como obtener una ventaja o un recurso dentro de condiciones que necesitan hacerse visibles.",
    "Miro qué gano y qué pongo en juego para ganarlo."
  ]},
  { palabra: "Perder", url: "https://dle.rae.es/perder", pasos: [
    "El DLE remite a perdĕre. La palabra abarca dejar de tener, no encontrar y resultar vencido, entre otros usos. No se impone a todas esas situaciones un único significado moral.",
    "Separación respecto de algo tenido o esperado: cambia una relación de disponibilidad o una posición.",
    "Había un recurso, una expectativa o una ventaja y después deja de estar disponible de la misma manera. La causa y la posibilidad de recuperación deben examinarse por separado.",
    "Extraviar, ceder, soltar y ser derrotado no son equivalentes. Una pérdida involuntaria no se vuelve elegida por llamarla oportunidad.",
    "La relación une a quien pierde, lo perdido y las condiciones del cambio. La agencia puede estar en buscar, reparar, pedir apoyo o reorganizar lo que permanece.",
    "Nombrar qué se perdió realmente y qué sigue disponible, sin convertir un resultado adverso en una definición total de la persona.",
    "DIMA propone leer perder como una modificación de la relación con algo que se tenía o se esperaba conservar.",
    "Reconozco lo perdido sin borrar lo que permanece."
  ]},
  { palabra: "Correcto", url: "https://dle.rae.es/correcto", pasos: [
    "El DLE remite al latín correctus. Entre sus acepciones están la conformidad con reglas y la conducta adecuada. No se convierte automáticamente esa procedencia en una medida universal de bondad.",
    "Ajuste evaluado: algo se compara con una regla y se considera conforme a ella.",
    "Una acción o expresión se examina según un criterio. La corrección depende de que el criterio sea pertinente y de que su aplicación pueda explicarse.",
    "Exacto, aceptado, legal, cortés y justo no son sinónimos perfectos. Lo correcto en una gramática no resuelve una cuestión ética.",
    "La relación incluye a quien evalúa, el objeto evaluado y la regla. La agencia está en pedir razones y discutir el alcance de la evaluación.",
    "Reemplazar «es lo correcto» por «cumple esta regla para este propósito», y examinar si ese propósito sigue siendo adecuado.",
    "DIMA propone leer correcto como una evaluación de conformidad que necesita declarar su regla y su campo de aplicación.",
    "La respuesta se entiende mejor cuando la regla está a la vista."
  ]},
  { palabra: "Productividad", url: "https://dle.rae.es/productividad", pasos: [
    "El DLE la describe como cualidad de productivo y como capacidad de producción por unidad de ciertos recursos. Esa relación léxica permite distinguir producción y productividad; no aporta por sí sola una historia completa de todos sus componentes.",
    "Relación de rendimiento: se compara un resultado con los recursos que se emplearon para obtenerlo.",
    "Se eligen un producto, un intervalo o recurso y una forma de medir. El número cambia si cambian la unidad o los resultados que se dejan fuera.",
    "Producir más no equivale necesariamente a producir mejor. La productividad de una tarea tampoco mide el valor de una persona.",
    "La relación incluye a quien produce, quien mide y quien recibe los efectos. Hay agencia al discutir qué se cuenta y qué costos quedan invisibles.",
    "Evaluar un resultado junto con su calidad, los recursos usados y sus costos, en lugar de perseguir solo una cifra creciente.",
    "DIMA propone leer productividad como una comparación situada entre resultados y recursos, cuya utilidad depende de qué se decidió medir.",
    "Antes de producir más, miro qué estoy contando."
  ]},
  { palabra: "Sacrificio", url: "https://dle.rae.es/sacrificio", pasos: [
    "El DLE remite al latín sacrificium. Conserva usos religiosos de ofrenda y usos relacionados con renuncia o esfuerzo. Una interpretación del costo personal no reemplaza la historia ni los sentidos religiosos de la palabra.",
    "Entrega con costo: algo valorado se cede o se compromete en relación con otro fin.",
    "Alguien entrega un recurso, acepta una pérdida o soporta una dificultad por un propósito. Para analizar la operación importan consentimiento, necesidad y distribución del costo.",
    "Renuncia voluntaria, imposición y explotación no son equivalentes. Que algo haya costado mucho no garantiza que el resultado valga ese costo.",
    "La relación une a quien aporta, quien recibe y el fin invocado. La agencia incluye decidir qué puede darse y reconocer cuándo el costo fue impuesto.",
    "Hacer explícito qué se está entregando, para quién y durante cuánto tiempo. Revisar el acuerdo si el costo supera lo que se aceptó.",
    "DIMA propone leer sacrificio, en su uso cotidiano, como una entrega cuyo sentido requiere examinar el fin y la libertad con que se realiza.",
    "Una entrega merece también mirar a quien la sostiene."
  ]},
  { palabra: "Fracaso", url: "https://dle.rae.es/fracaso", pasos: [
    "El DLE vincula fracaso con fracasar y registra el resultado adverso de una empresa, entre otros sentidos. No se deduce del sustantivo una identidad permanente ni se atribuye al término una segmentación gráfica inventada.",
    "Interrupción o desajuste: un resultado se separa de aquello que se buscaba alcanzar.",
    "Se esperaba un efecto, se realizó una acción y el resultado no cumplió el criterio. Para entenderlo hay que revisar también condiciones y recursos.",
    "Una tentativa fallida no equivale a una persona fallida. Error de ejecución, objetivo inviable y cambio de contexto requieren respuestas distintas.",
    "La relación incluye a quien intenta, el objetivo y las condiciones. La agencia puede estar en reparar, aprender, cambiar el objetivo o dar por terminada la tentativa.",
    "Cambiar «soy un fracaso» por «esta acción no produjo este resultado bajo estas condiciones», y elegir qué variable conviene revisar.",
    "DIMA propone leer fracaso como una evaluación de un resultado situado, no como una sentencia sobre quien lo produjo.",
    "Un resultado me informa; no me termina de definir."
  ]},
  { palabra: "Obediencia", url: "https://dle.rae.es/obediencia", pasos: [
    "El DLE deriva obediencia del latín oboedientia y la relaciona con obedecer. También registra usos religiosos específicos. Esta referencia no basta para reconstruir por cuenta propia toda su morfología latina.",
    "Orientación de la acción por una instrucción: una indicación recibida se transforma en conducta.",
    "Hay una orden o regla, una autoridad reconocida y alguien que actúa según ella. La legitimidad y los límites no se prueban por el mero hecho de obedecer.",
    "Obedecer no equivale a comprender, consentir ni estar de acuerdo. Cooperación y subordinación tampoco describen la misma relación.",
    "El vínculo une a quien instruye y quien ejecuta, dentro de responsabilidades concretas. La agencia incluye conocer el alcance de la autoridad y pedir aclaraciones.",
    "Antes de cumplir una instrucción ambigua, precisar el propósito, el alcance y la responsabilidad de cada participante.",
    "DIMA propone leer obediencia como la conversión de una instrucción en acción dentro de una relación de autoridad que debe poder examinarse.",
    "Cumplir una orden no me impide preguntar por su sentido."
  ]},
  { palabra: "Control", url: "https://dle.rae.es/control", pasos: [
    "El DLE señala la procedencia francesa contrôle. Sus acepciones incluyen comprobación, mando y regulación. El préstamo no se descompone aquí en supuestos morfemas españoles con un significado oculto.",
    "Regulación o comprobación: se observa una variable y se intenta mantenerla dentro de ciertos límites.",
    "Un observador o regulador compara un estado con una referencia e interviene sobre una diferencia. Observar una variable no implica poder gobernar todo el sistema.",
    "Verificar, regular y dominar son operaciones distintas. Tener información tampoco equivale a tener poder de decisión.",
    "La relación incluye a quien controla, aquello sobre lo que interviene y quienes reciben sus efectos. La agencia requiere reconocer un ámbito real de influencia.",
    "Separar lo que puedo decidir, lo que puedo influir y lo que solo puedo observar. Elegir la intervención desde esa diferencia.",
    "DIMA propone leer control como una relación de seguimiento o intervención cuyo alcance necesita límites explícitos.",
    "Distingo dónde puedo intervenir para no exigir gobernarlo todo."
  ]},
  { palabra: "Influencer", url: "https://dle.rae.es/influencer", pasos: [
    "El DLE registra influencer para una persona con influencia sobre gustos y comportamientos a través de sus seguidores en redes. La entrada consultada no desarrolla su genealogía; no se inventa una historia adicional de sus componentes.",
    "Orientación por exposición: una presencia reiterada puede modificar qué se mira, se desea o se considera relevante.",
    "Una persona comunica, una plataforma distribuye y una audiencia interpreta. La influencia depende también de confianza, repetición e incentivos comerciales.",
    "Visibilidad, experiencia, autoridad y confiabilidad no son equivalentes. Muchos seguidores no constituyen por sí solos una prueba de una afirmación.",
    "La relación incluye a creador, audiencia, plataforma y posibles anunciantes. La agencia de quien recibe está en contrastar y reconocer los incentivos de la recomendación.",
    "Ante una recomendación, preguntar qué evidencia la sostiene, quién obtiene un beneficio y si sirve para la propia situación.",
    "DIMA propone leer influencer como una posición de intermediación que orienta atención y decisiones en una red de relaciones.",
    "Puedo escuchar una recomendación sin delegarle mi criterio."
  ]},
  { palabra: "Ego", url: "https://dle.rae.es/ego", pasos: [
    "El DLE deriva ego del latín ego, yo. Distingue su uso técnico en psicoanálisis del uso coloquial referido al exceso de autoestima. La etimología no permite diagnosticar a una persona.",
    "Referencia a sí: una experiencia se organiza desde la posición de quien dice yo.",
    "Alguien se reconoce como participante de una situación y organiza intereses, recuerdos y expectativas. Esa operación no implica necesariamente desprecio por otras personas.",
    "Ego, identidad, autoestima y arrogancia no son equivalentes. Un término técnico no debe usarse como insulto ni como diagnóstico improvisado.",
    "La relación vincula la propia perspectiva con las perspectivas ajenas. La agencia aparece al sostener una posición y admitir que no agota la situación.",
    "Cambiar «esto amenaza lo que soy» por «esto cuestiona una idea o un papel que estoy sosteniendo», cuando esa distinción sea pertinente.",
    "DIMA propone leer ego, fuera del diagnóstico clínico, como la posición desde la que organizo mi participación en una relación.",
    "Tengo una perspectiva; no tengo todas las perspectivas."
  ]},
  { palabra: "Realidad", url: "https://dle.rae.es/realidad", pasos: [
    "El DLE registra realidad como existencia efectiva y como aquello que ocurre. La relación léxica con real permite reconocer su campo de sentido, pero esta entrada no documenta una segmentación histórica completa de la palabra.",
    "Referencia a lo que sucede: una interpretación busca sostenerse frente a una situación que puede ofrecer resistencia.",
    "Hay acontecimientos, formas de observarlos y afirmaciones sobre ellos. La observación es situada, pero eso no vuelve intercambiables todas las explicaciones.",
    "Un hecho, una percepción y una interpretación no son lo mismo. Reconocer la perspectiva propia no implica negar hechos comprobables.",
    "La relación une a quien observa, lo observado y los medios de contraste. La agencia está en revisar una interpretación cuando aparece información relevante.",
    "Separar «ocurrió esto» de «lo interpreté así» y buscar qué dato permitiría contrastar la interpretación.",
    "DIMA propone leer realidad como aquello con lo que una interpretación necesita contrastarse, sin confundir su relato con la totalidad de lo que ocurre.",
    "Lo que veo es un punto de partida para mirar mejor."
  ]},
  { palabra: "Fama", url: "https://dle.rae.es/fama", pasos: [
    "El DLE remite al latín fama. Registra tanto notoriedad como la opinión que otras personas tienen de alguien o algo. Esa polisemia impide equipararla siempre con prestigio favorable.",
    "Circulación de una imagen: un nombre o relato adquiere presencia entre personas que lo transmiten.",
    "Alguien es nombrado, otros repiten una imagen y ciertos medios amplifican su alcance. La circulación puede exceder el control de la persona nombrada.",
    "Ser conocido, ser apreciado y ser confiable no son equivalentes. La reputación puede apoyarse en hechos o en repeticiones sin contraste.",
    "La relación incluye a la persona nombrada, quienes hablan de ella y los medios de difusión. La agencia propia no alcanza a controlar todas las recepciones.",
    "Elegir qué se quiere comunicar y con qué evidencia, sin tomar cada reacción pública como una medida total del propio valor.",
    "DIMA propone leer fama como una imagen que circula en una red social y no como una propiedad que alguien posee por completo.",
    "Mi nombre puede circular más lejos que mi control sobre él."
  ]},
  { palabra: "Mérito", url: "https://dle.rae.es/mérito", pasos: [
    "El DLE deriva el sustantivo del latín merĭtum. Lo relaciona con acciones o cualidades que reciben valoración y reconocimiento. No determina por sí solo cómo debería distribuirse una recompensa.",
    "Atribución de reconocimiento: una acción o cualidad se vincula con un valor dentro de un criterio.",
    "Se observa una contribución, se la evalúa y se atribuye reconocimiento. La operación depende de qué contribuciones se ven y cuáles quedan fuera.",
    "Mérito, esfuerzo, resultado y oportunidad no son idénticos. Reconocer una contribución no obliga a negar las condiciones que la hicieron posible.",
    "La relación incluye a quien contribuye, quien evalúa y quienes sostienen el proceso. La agencia está en argumentar criterios y visibilizar aportes omitidos.",
    "Nombrar la contribución concreta y sus apoyos, en lugar de convertir un premio en prueba de superioridad personal.",
    "DIMA propone leer mérito como una atribución de valor a una contribución, que necesita criterios y contexto para ser defendible.",
    "Reconozco el aporte sin borrar las condiciones que lo sostuvieron."
  ]},
  { palabra: "Sumisión", url: "https://dle.rae.es/sumisión", pasos: [
    "El DLE remite al latín submissio, -ōnis. Registra sometimiento, subordinación y acatamiento, además de un uso jurídico. El sentido de la relación debe identificarse antes de aplicar una lectura personal.",
    "Subordinación: una posición o un juicio queda sujeto a la decisión de otra instancia.",
    "Una parte dispone y otra ajusta su conducta o criterio a esa disposición. El grado de elección, la posibilidad de disentir y el costo de hacerlo cambian la relación.",
    "Consentir una tarea, cooperar y quedar sometido no son lo mismo. La ausencia de protesta no demuestra libertad de elección.",
    "El vínculo incluye a quien dispone, quien se somete y las condiciones de dependencia. La agencia puede requerir apoyo y cambios de condiciones, no solo una decisión individual.",
    "Identificar un margen concreto para expresar una preferencia, pedir una explicación o buscar apoyo, sin ignorar los límites reales de la situación.",
    "DIMA propone leer sumisión como una relación de subordinación cuyo análisis exige mirar también la posibilidad efectiva de disentir.",
    "Para hablar de elección, miro si también puedo decir que no."
  ]},
  { palabra: "Ambición", url: "https://dle.rae.es/ambición", pasos: [
    "El DLE deriva ambición del latín ambitio, -ōnis. Registra un deseo intenso de conseguir algo y también aquello que se desea. No convierte toda aspiración en codicia ni toda intensidad en virtud.",
    "Proyección hacia un logro: un objetivo concentra atención y moviliza recursos más allá del estado presente.",
    "Alguien desea alcanzar una posición o resultado y organiza esfuerzos para ello. La dirección necesita examinarse junto con sus costos y sus efectos sobre otros.",
    "Aspirar, competir y acumular no son lo mismo. La intensidad del deseo no decide si el fin o el procedimiento son adecuados.",
    "La relación une a quien aspira, el objetivo y quienes participan de sus costos. La agencia incluye cambiar la medida del logro y reconocer cuándo basta.",
    "Formular qué se quiere conseguir, por qué importa y qué límite no se quiere cruzar para alcanzarlo.",
    "DIMA propone leer ambición como una orientación intensa hacia una posibilidad, que gana claridad al declarar sus fines y límites.",
    "Quiero llegar sin perder de vista cómo quiero hacerlo."
  ]},
  { palabra: "Orgullo", url: "https://dle.rae.es/orgullo", pasos: [
    "El DLE remite al catalán orgull y a una forma franca reconstruida. Distingue satisfacción por logros o pertenencias y una valoración propia excesiva. La palabra conserva sentidos distintos que no conviene moralizar en bloque.",
    "Afirmación de valor: alguien se reconoce vinculado con algo que aprecia o considera valioso.",
    "Una acción, capacidad o pertenencia recibe una valoración y se incorpora a la imagen propia. El vínculo puede reconocer un logro o transformarlo en comparación de superioridad.",
    "Satisfacción y arrogancia no son equivalentes. Sentirse orgulloso de otra persona tampoco supone apropiarse de su logro.",
    "La relación incluye al sujeto, aquello que valora y quienes comparten o discuten esa valoración. La agencia está en reconocer sin convertir toda diferencia en amenaza.",
    "Pasar de «esto demuestra que soy mejor» a nombrar qué se valora y qué se aprendió para hacerlo posible.",
    "DIMA propone leer orgullo como una afirmación de valor vinculada con la propia identidad, cuyo alcance depende de cómo se relaciona con los demás.",
    "Puedo valorar lo mío sin disminuir lo ajeno."
  ]},
  { palabra: "Virtud", url: "https://dle.rae.es/virtud", pasos: [
    "El DLE deriva virtud del latín virtus, -ūtis. Incluye capacidad de producir efectos y sentidos morales. No toda aparición de la palabra se refiere a bondad personal.",
    "Capacidad que se hace efectiva: una disposición se reconoce por el modo en que actúa bajo ciertas condiciones.",
    "Se atribuye una cualidad a algo o alguien a partir de efectos o conductas. El criterio y las condiciones deben distinguirse de una etiqueta general de excelencia.",
    "Capacidad, buena intención y conducta observada no son equivalentes. Una virtud atribuida no garantiza un comportamiento idéntico en todas las situaciones.",
    "La relación incluye a quien actúa, el efecto y la comunidad que lo valora. La agencia puede estar en practicar una conducta concreta y revisar sus consecuencias.",
    "Sustituir «quiero ser virtuoso» por una práctica observable: escuchar sin interrumpir, cumplir un acuerdo o reconocer un error.",
    "DIMA propone leer virtud como una capacidad o disposición valorada por sus efectos, que necesita ejercerse para no quedar en una etiqueta.",
    "Una cualidad se vuelve visible cuando encuentra una práctica."
  ]},
  { palabra: "Empezar", url: "https://dle.rae.es/empezar", pasos: [
    "El DLE lo relaciona con en- y pieza. Su uso actual incluye dar principio a algo. Esa formación no permite deducir que toda iniciativa deba comenzar de una única manera.",
    "Iniciación: una posibilidad deja de estar solo prevista y adquiere un primer movimiento.",
    "Una intención se traduce en una acción que abre una secuencia. El primer paso no necesita contener ni garantizar todo el recorrido.",
    "Empezar, planificar y comprometerse no son equivalentes. Un inicio pequeño puede ser real aunque todavía no sea público o definitivo.",
    "La relación une a quien inicia, los recursos disponibles y el siguiente paso. La agencia se concreta al elegir una acción viable en lugar de esperar todas las condiciones ideales.",
    "Convertir un propósito amplio en un primer acto verificable: escribir una línea, pedir una fecha o preparar el material necesario.",
    "DIMA propone leer empezar como el paso de una posibilidad a una acción que hace existir una secuencia.",
    "Un primer movimiento no necesita fingir que ya conoce el final."
  ]},
  { palabra: "Volver", url: "https://dle.rae.es/volver", pasos: [
    "El DLE remite al latín volvĕre y registra sentidos de retorno y cambio de dirección. También aparece en construcciones de repetición. No se asume que todos esos usos describan un regreso idéntico.",
    "Retorno o reorientación: un movimiento se relaciona de nuevo con un lugar, una práctica o una referencia anterior.",
    "Hay un recorrido previo y una nueva aproximación a algo conocido. El punto puede parecer el mismo, mientras las condiciones y quien regresa cambiaron.",
    "Volver no equivale a retroceder ni a repetir exactamente. Retomar una tarea y regresar a una relación requieren preguntas distintas.",
    "La relación incluye a quien retorna, aquello a lo que retorna y el tiempo transcurrido. La agencia está en decidir qué retomar y bajo qué condiciones.",
    "Antes de repetir una experiencia, distinguir qué se desea recuperar y qué condición anterior conviene no reproducir.",
    "DIMA propone leer volver como una nueva relación con una referencia anterior, abierta a diferencias en lugar de una restauración perfecta.",
    "Vuelvo a un lugar; no vuelvo siendo exactamente el mismo."
  ]},
  { palabra: "Presente", url: "https://dle.rae.es/presente", pasos: [
    "El DLE remite al latín praesens, -entis. La forma española puede indicar presencia, tiempo actual o un obsequio según la frase. No se segmenta en pre-, sen y -te como historia documentada.",
    "Disponibilidad situada: algo o alguien comparece en una relación que ocurre ahora.",
    "Un participante está en una situación y puede responder a ella. Estar en el mismo sitio y prestar atención son condiciones diferentes.",
    "Presencia física, atención y disponibilidad no son idénticas. El presente gramatical tampoco coincide siempre con el instante de habla.",
    "La relación incluye a quien está, lo que ocurre y quienes solicitan respuesta. La agencia aparece al elegir una forma posible de participar y reconocer límites de atención.",
    "Cambiar una presencia meramente formal por una acción situada: escuchar una pregunta, registrar un dato o decir con claridad que ahora no se puede responder.",
    "DIMA propone leer presente como una posición de participación situada, cuyo sentido se reconoce por la relación con lo que está ocurriendo.",
    "Estoy aquí: distingo de qué manera puedo participar."
  ]},
  { palabra: "Ausencia", url: "https://dle.rae.es/ausencia", pasos: [
    "El DLE deriva ausencia del latín absentia. Designa el estar ausente o el efecto de ausentarse. La entrada no basta para convertir cada ausencia en abandono ni para atribuirle una finalidad positiva.",
    "Separación respecto de una presencia esperada: una relación cambia porque alguien o algo no está.",
    "Un lugar, actividad o vínculo conserva una referencia a lo que falta. La operación depende de quién esperaba esa presencia y bajo qué condiciones.",
    "Ausencia, distancia, pérdida y abandono no son equivalentes. Una pausa elegida y una separación impuesta tampoco producen el mismo margen de acción.",
    "La relación incluye a quien falta, quien registra la falta y lo que se esperaba. La agencia puede estar en acordar presencia, comunicar una pausa o reorganizar apoyos.",
    "Precisar qué presencia se necesita, para qué y de qué modo puede pedirse o reemplazarse, sin atribuir automáticamente intención a quien no está.",
    "DIMA propone leer ausencia como una modificación de la relación con una presencia esperada, cuyo sentido necesita contexto.",
    "Para entender lo que falta, miro qué relación esperaba encontrar."
  ]},
  { palabra: "Deseo", url: "https://dle.rae.es/deseo", pasos: [
    "El DLE remite deseo al latín vulgar desidium y lo relaciona con desidia. En el uso actual nombra apetencia y su objeto. Esta referencia no respalda la conocida segmentación de deseo como de- más estrellas ni permite imponer a todo deseo aquella explicación histórica.",
    "Orientación hacia algo apetecido: una posibilidad adquiere fuerza suficiente para atraer la atención.",
    "Alguien desea algo desde una situación concreta. Entre la orientación y su realización intervienen medios, otras personas y límites.",
    "Desear no equivale a necesitar, decidir ni tener derecho a obtener. El deseo propio no determina el consentimiento de otra persona.",
    "La relación une a quien desea, lo deseado y las condiciones de acceso. La agencia consiste en reconocer esa orientación y elegir cómo responder a ella.",
    "Cambiar «lo quiero, entonces debo conseguirlo» por «esto me atrae; voy a distinguir qué busco y qué modos de acercarme respetan los límites».",
    "DIMA propone leer deseo como una orientación afectiva hacia una posibilidad, que señala una dirección sin decidir por sí sola el recorrido.",
    "Mi deseo señala una dirección; mis decisiones construyen el camino."
  ]},
  { palabra: "Common", url: "https://www.etymonline.com/word/common", diccionario: "Online Etymology Dictionary", referencias: [{ titulo: "Oxford Advanced Learner’s Dictionary: common", url: "https://www.oxfordlearnersdictionaries.com/definition/english/common_1" }], pasos: [
    "En inglés, Etymonline sitúa common en el francés antiguo comun y el latín communis. Registra sentidos de pertenencia compartida y de frecuencia. No son equivalentes en todos los contextos ni requieren que todas las personas sean iguales.",
    "Puesta en común: varias posiciones se relacionan con un recurso, una práctica o una referencia compartida.",
    "Un conjunto de participantes tiene algo en común. El alcance depende de quién integra ese conjunto y cómo se distribuye el acceso.",
    "Compartido no equivale a uniforme. Common como frecuente tampoco significa necesariamente público, disponible para todos o poco valioso.",
    "La relación une a los participantes y aquello que comparten. La agencia aparece al discutir reglas de acceso y reconocer a quienes quedaron excluidos.",
    "Ante algo llamado común, preguntar de quiénes es y cómo se decide su uso, en lugar de dar por supuesto un acceso igualitario.",
    "DIMA propone leer common, en su sentido compartido, como una relación de pertenencia o uso entre varios, que necesita un conjunto y unas reglas.",
    "Lo común se sostiene haciendo visible quién puede participar."
  ]},
  { palabra: "Work", url: "https://www.etymonline.com/word/work", diccionario: "Online Etymology Dictionary", pasos: [
    "Etymonline remite el sustantivo inglés a weorc, del inglés antiguo, asociado con acción, actividad y lo producido. El verbo tiene su propia historia relacionada. No se deriva del antecedente latino que el DLE propone para trabajar.",
    "Puesta en operación: una capacidad actúa y puede producir una obra, un servicio o un funcionamiento.",
    "Alguien o algo opera sobre una tarea. La palabra puede nombrar la actividad, su producto o el hecho de que un mecanismo funcione.",
    "Work no siempre equivale a empleo, ni todas sus acepciones se traducen igual. Un trabajo artístico y una máquina que funciona no comparten las mismas condiciones.",
    "La relación une al agente, la tarea y los efectos. La agencia se aclara al precisar qué resultado se busca y qué condiciones lo sostienen.",
    "Reemplazar una exigencia vaga de trabajar más por la identificación de la operación que falta o dejó de funcionar.",
    "DIMA propone leer work como actividad o funcionamiento que adquiere sentido en relación con una tarea y un efecto.",
    "Miro qué hace mi acción, además de cuánto ocupa."
  ]},
  { palabra: "Right", url: "https://www.etymonline.com/word/right", diccionario: "Online Etymology Dictionary", pasos: [
    "Etymonline remite right al inglés antiguo riht y distingue desarrollos de sentidos como correcto, recto y el lado derecho. La relación histórica no prueba que derecha signifique bondad ni que todos los sentidos sean intercambiables.",
    "Orientación respecto de una referencia: una posición o afirmación se ubica dentro de un marco.",
    "En cada frase hay que reconocer si se habla de corrección, dirección, derecho o énfasis. La operación cambia con la construcción y el contexto.",
    "Tener razón, tener un derecho y estar a la derecha no son equivalentes. Una coincidencia de forma no convierte una posición espacial en un valor moral.",
    "La relación une a quien afirma, la referencia y quienes reconocen o cuestionan el criterio. La agencia está en explicitar de qué sentido se está hablando.",
    "Antes de traducir o discutir right, reconstruir la frase completa y precisar qué referencia necesita ese uso.",
    "DIMA propone leer right como una forma polisémica cuya interpretación depende del marco relacional de la frase.",
    "Una misma palabra puede orientar en más de un sentido."
  ]},
  { palabra: "Infans", url: "https://atlas.perseus.tufts.edu/dictionaries/entry/urn%3Acite2%3Ascaife-viewer%3Adictionary-entries.atlas_v1%3Alat.ls.perseus-eng2-n23109/", diccionario: "Lewis & Short · Perseus", pasos: [
    "Lewis & Short registra el latín infans, infantis, con la composición in- y la forma vinculada a hablar; incluye no hablar y el niño pequeño. Se conserva el contexto latino: no es una descripción universal de la infancia actual.",
    "Expresión aún no articulada en palabras: algo necesita otras formas de ser advertido o acompañado.",
    "Alguien no puede expresarse verbalmente de cierta manera y otros interpretan señales. La falta de palabras no demuestra falta de experiencia ni de necesidades.",
    "No hablar, no comprender y no tener voz social son situaciones diferentes. Una categoría histórica no justifica negar la participación actual de un niño.",
    "La relación une a quien expresa y a quien interpreta. La agencia de quien acompaña incluye escuchar otras señales sin afirmar que sabe por completo lo que el otro vive.",
    "Pasar de decidir por alguien sin escuchar a ofrecer modos adecuados de expresión y revisar la propia interpretación.",
    "DIMA propone leer infans como una posición que requiere mediación de la expresión, sin reducir a quien la ocupa a aquello que todavía no puede decir.",
    "Que no haya palabras no significa que no haya algo para escuchar."
  ]},
  { palabra: "Adultus", url: "https://logeion.org/adultus", diccionario: "Lewis & Short · Logeion", pasos: [
    "Logeion recoge adultus, adulta, adultum como forma participial de adolesco, relacionada con haber crecido o madurado. El valor de resultado de un crecimiento no implica haber terminado todo desarrollo posible.",
    "Consolidación de un crecimiento: una capacidad o etapa aparece suficientemente desarrollada en un contexto.",
    "Un proceso previo permite atribuir un estado alcanzado. El criterio de madurez depende de aquello que se evalúa y no convierte todos los aspectos de una persona en equivalentes.",
    "Edad, autonomía, experiencia y responsabilidad no son idénticas. Una categoría legal tampoco prueba madurez en toda situación.",
    "La relación une a quien es reconocido como adulto y a quienes distribuyen derechos y responsabilidades. La agencia incluye asumir tareas y reconocer necesidades de apoyo.",
    "Cambiar «un adulto debería poder con todo» por una responsabilidad concreta y los medios necesarios para ejercerla.",
    "DIMA propone leer adultus como un estado de crecimiento reconocido que habilita responsabilidades sin cancelar la posibilidad de seguir aprendiendo.",
    "Haber crecido no me obliga a dejar de aprender."
  ]},
  { palabra: "Puer", url: "https://atlas.perseus.tufts.edu/dictionaries/entry/urn%3Acite2%3Ascaife-viewer%3Adictionary-entries.atlas_v1%3Alat.ls.perseus-eng2-n39429/", diccionario: "Lewis & Short · Perseus", pasos: [
    "Lewis & Short registra el latín puer, pueri para niño o muchacho y documenta usos históricos distintos, incluidos los de servidor. No se lo trata como nombre de un arquetipo psicológico universal ni se inventan raíces a partir de sus letras.",
    "Crecimiento en relación: una posición de aprendizaje necesita oportunidades de ensayo y acompañamiento.",
    "Una persona joven participa en un mundo cuyas reglas y recursos no controla por completo. La relación puede habilitar aprendizaje o restringir su expresión.",
    "Juventud no equivale a incapacidad total. Aprender, jugar y depender de cuidados son dimensiones diferentes que pueden coincidir.",
    "El vínculo une a quien aprende con quienes cuidan, enseñan y fijan límites. La agencia crece con oportunidades de participar que correspondan a la situación.",
    "Revisar una regla que excluye toda participación y convertirla, cuando sea posible, en una oportunidad acotada de elegir o ensayar.",
    "DIMA propone leer puer como una posición de crecimiento cuyo desarrollo depende de relaciones que permitan participación y cuidado.",
    "Acompañar el crecimiento también es dejar espacio para intentar."
  ]},
];
