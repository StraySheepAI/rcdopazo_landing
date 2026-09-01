// Diccionario bilingüe ES/EN. Español es el idioma inicial del sitio.
// No se traducen nombres propios ni marcas (R.C. Dopazo, MPA, Magia para
// Atrevidos, Stray Sheep, ¡Qué Embole!, Evigila, Lude, Transmuta, etc.) ni
// los títulos de las obras — conservan su identidad en ambos idiomas.

export type Locale = "es" | "en";

export const translations = {
  es: {
    nav: {
      inicio: "Inicio",
      mpa: "MPA",
      queEsMpa: "¿Qué es MPA?",
      mpaUniverse: "MPA Universe",
      mpaTransmuta: "MPA Transmuta",
      mpaFlow: "MPA Flow",
      mpaPublishingHouse: "MPA Publishing House",
      obras: "Obras",
      obrasDestacadas: "Destacadas",
      obrasTodas: "Todas",
      obrasLibros: "Libros",
      obrasMusica: "Música",
      obrasJuegos: "Juegos",
      obrasApps: "Apps & Experiencias",
      sobreRC: "Sobre R.C.",
      contacto: "Contacto",
      abrirMenu: "Abrir menú",
      cerrarMenu: "Cerrar menú",
      idioma: "Idioma",
    },
    hero: {
      eyebrow: "Una forma de mirar",
      title: "Hacer visible la configuración invisible.",
      tagline: "Estructura, narrativa y arte, en una misma mirada.",
      body: "Observo sistemas, experiencias y símbolos para encontrar las correspondencias capaces de transformar lo que parecía fijo. Mi trabajo vive en el cruce entre pensamiento sistémico, tecnología, escritura y creación.",
      ctaExplorar: "Explorar el universo",
      ctaContacto: "Contacto",
    },
    obrasDestacadas: {
      kicker: "Obras destacadas",
      tagRecien: "Recién publicado",
      verTodas: "Ver todas las obras",
    },
    ticker: {
      algunas: "personas necesitan creer para experimentar.",
      algunasB: "Algunas",
      otras: "necesitan experimentar para creer.",
      otrasB: "Otras",
    },
    sobreRC: {
      kicker: "Sobre R.C.",
      title: "Ver la configuración cambia el juego.",
      statement: "Porque una vez que ves, ya no podés desver. Y lo que se hace visible, se puede reconfigurar.",
      body: "Soy R.C. Dopazo. Me apasiona comunicar, reflexionar y transformar: convertir complejidad en lenguaje, experiencia en conocimiento y posibilidades dispersas en una configuración con sentido.",
      mensajeKicker: "Un mensaje para ti",
      mensajeIntro: "No necesitás manifestar. Porque no falta nada. Lo que anhelás ya existe…",
      mensajeCta: "Abrir la bitácora",
    },
    contacto: {
      kicker: "Contacto",
      title: "¿Qué correspondencia podemos construir?",
      intro: "Conversaciones, colaboraciones, proyectos y nuevas formas de hacer posible.",
      email: "Email",
      redes: "Redes",
      proximamente: "Próximamente",
      form: {
        heading: "¿Querés hablar?",
        subheading: "Escribime. Te respondo pronto.",
        name: "Nombre",
        namePlaceholder: "¿Cómo te llamás?",
        email: "Mail",
        emailPlaceholder: "Tu email",
        message: "Mensaje",
        messagePlaceholder: "¿Qué querés contarme?",
        send: "Enviar",
        sending: "Enviando…",
        success: "Recibido.",
        successDetail: "Te escribo pronto.",
        error: "No pudo enviarse. Probá nuevamente.",
      },
    },
    obrasPage: {
      title: "Obras",
      intro:
        "Un recorrido transversal por la producción de R.C. Dopazo, independientemente de la marca o ecosistema al que pertenezca cada pieza.",
      filtroDestacadas: "Destacadas",
      filtroTodas: "Todas",
      vacioDestacadas: "Todavía no hay obras destacadas en esta selección.",
      vacioTodas: "Todavía no hay obras publicadas en el catálogo.",
      vacioCategoria: "Obras en preparación.",
    },
    bitacora: {
      title: "Bitácora de fragmentos de presencia",
      intro: "Frases, fragmentos de libros, notas e ideas que atraviesan la obra de R.C. Dopazo.",
      fragmento: "No necesitás manifestar. Porque no falta nada. Lo que anhelás ya existe…",
      source: "R.C. Dopazo",
      abrir: "Abrir el mensaje",
      cerrar: "Cerrar el mensaje",
    },
    mpa: {
      titleIndex: "MPA · Magia para Atrevidos",
      introIndex:
        "Marca madre de un ecosistema propio. Cuatro expresiones — universo narrativo, práctica e investigación, aplicación profesional y sello editorial.",
      queEsMpaBody1:
        "Magia para Atrevidos (MPA) es el espacio donde integro estructura, narrativa y arte: una plataforma editorial, metodológica y creativa que toma una forma distinta según el terreno — a veces es un libro, a veces una metodología de consultoría, a veces una pieza visual.",
      queEsMpaBody2:
        "El nombre es una provocación amable: la Magia no es ilusión, es la capacidad de sostener una mirada distinta el tiempo suficiente como para que algo cambie. Atreverse es la parte que no se enseña en ningún manual.",
      queEsMpaBody3:
        "A esto lo llamamos Metalkimia: la práctica de participar con más vigilia — más capacidad de distinguir — en las transformaciones que ya están pasando. En vez de reaccionar por inercia: observar la configuración, distinguir qué depende de mí, y reconfigurar desde ahí.",
      transmutaKicker: "Triangulación sistémica",
      transmutaBody1:
        "Parto de una hipótesis: la unidad mínima generativa no es la dualidad, es la tríada. Dos elementos en relación generan una tercera realidad — la relación misma — que tiene identidad propia, produce consecuencias y se convierte en un nuevo elemento del sistema.",
      transmutaBody2:
        "Triangular no es mirar tres cosas: es entrenar la capacidad de reconocer ese tercer elemento cuando aparece y actuar sobre él. Estructura para que algo funcione, narrativa para que algo se entienda, arte para que algo se sienta — ninguno alcanza solo. Un sistema sin relato es ilegible; un relato sin estructura se dispersa; el arte sin ninguno de los dos es apenas decoración.",
      transmutaBody3:
        "La Arquitectura de Triangulación Sistémica es el método con el que esto se pone en práctica: organiza la forma de observar, discernir, intervenir y reconfigurar sistemas vivos, de manera iterativa. No busca modificar directamente a las personas, sino introducir discernimientos que reconfiguran el sistema — y así ampliar lo que cada parte puede ver, elegir y hacer.",
      flowBody: "Consultoría de arquitectura de sistemas y transformación organizacional.",
      flowCta: "Conocer la práctica",
      universeBadge: "Mecanismo de acceso pendiente de confirmar",
      universeIniciadosTitle: "Acceso para iniciados",
      universeIniciadosBody: "Si ya atravesaste el reto, tu clave te da entrada directa.",
      universeKeyPlaceholder: "Tu sello / llave de acceso",
      universeEnter: "Atravesar la puerta",
      universeAccepted: "Sello reconocido. El destino interior está por revelarse.",
      universeRejected: "El sello no reconoce todavía esta configuración.",
      universeNoIniciadosTitle: "¿Aún no te has iniciado?",
      universeNoIniciadosBody: "Al Universo de MPA no se entra clickeando, se entra jugando.",
      universeChallenge: "Descubre lo que oculta el velo de iniciación",
      publishingBadge: "Sección en construcción",
      publishingBody: "Sello editorial de MPA. ¡Qué Embole!, de Stray Sheep, está publicado bajo este sello.",
    },
    common: {
      leerMas: "Leer más",
    },
  },
  en: {
    nav: {
      inicio: "Home",
      mpa: "MPA",
      queEsMpa: "What is MPA?",
      mpaUniverse: "MPA Universe",
      mpaTransmuta: "MPA Transmuta",
      mpaFlow: "MPA Flow",
      mpaPublishingHouse: "MPA Publishing House",
      obras: "Works",
      obrasDestacadas: "Featured",
      obrasTodas: "All",
      obrasLibros: "Books",
      obrasMusica: "Music",
      obrasJuegos: "Games",
      obrasApps: "Apps & Experiences",
      sobreRC: "About R.C.",
      contacto: "Contact",
      abrirMenu: "Open menu",
      cerrarMenu: "Close menu",
      idioma: "Language",
    },
    hero: {
      eyebrow: "A way of looking",
      title: "Making the invisible configuration visible.",
      tagline: "Structure, narrative and art, in a single gaze.",
      body: "I observe systems, experiences and symbols to find the correspondences capable of transforming what seemed fixed. My work lives at the crossing of systems thinking, technology, writing and creation.",
      ctaExplorar: "Explore the universe",
      ctaContacto: "Contact",
    },
    obrasDestacadas: {
      kicker: "Featured works",
      tagRecien: "Just published",
      verTodas: "See all works",
    },
    ticker: {
      algunas: "people need to believe to experience.",
      algunasB: "Some",
      otras: "need to experience to believe.",
      otrasB: "Others",
    },
    sobreRC: {
      kicker: "About R.C.",
      title: "Seeing the configuration changes the game.",
      statement: "Because once you see, you can't unsee. And what becomes visible can be reconfigured.",
      body: "I'm R.C. Dopazo. I'm passionate about communicating, reflecting and transforming: turning complexity into language, experience into knowledge, and scattered possibilities into a configuration that makes sense.",
      mensajeKicker: "A message for you",
      mensajeIntro: "You don't need to manifest. Because nothing is missing. What you long for already exists…",
      mensajeCta: "Open the logbook",
    },
    contacto: {
      kicker: "Contact",
      title: "What correspondence can we build?",
      intro: "Conversations, collaborations, projects and new ways of making things possible.",
      email: "Email",
      redes: "Social",
      proximamente: "Coming soon",
      form: {
        heading: "Want to talk?",
        subheading: "Write to me. I'll get back to you soon.",
        name: "Name",
        namePlaceholder: "What's your name?",
        email: "Email",
        emailPlaceholder: "Your email",
        message: "Message",
        messagePlaceholder: "What would you like to tell me?",
        send: "Send",
        sending: "Sending…",
        success: "Received.",
        successDetail: "I'll write back soon.",
        error: "It couldn't be sent. Please try again.",
      },
    },
    obrasPage: {
      title: "Works",
      intro:
        "A transversal walk through R.C. Dopazo's production, regardless of the brand or ecosystem each piece belongs to.",
      filtroDestacadas: "Featured",
      filtroTodas: "All",
      vacioDestacadas: "There are no featured works in this selection yet.",
      vacioTodas: "There are no published works in the catalog yet.",
      vacioCategoria: "Works in progress.",
    },
    bitacora: {
      title: "Logbook of fragments of presence",
      intro: "Phrases, book fragments, notes and ideas running through the work of R.C. Dopazo.",
      fragmento: "You don't need to manifest. Because nothing is missing. What you long for already exists…",
      source: "R.C. Dopazo",
      abrir: "Open the message",
      cerrar: "Close the message",
    },
    mpa: {
      titleIndex: "MPA · Magia para Atrevidos",
      introIndex:
        "Parent brand of its own ecosystem. Four expressions — narrative universe, practice and research, professional application and publishing imprint.",
      queEsMpaBody1:
        "Magia para Atrevidos (MPA) is the space where I integrate structure, narrative and art: an editorial, methodological and creative platform that takes a different shape depending on the terrain — sometimes a book, sometimes a consulting methodology, sometimes a visual piece.",
      queEsMpaBody2:
        "The name is a gentle provocation: Magic isn't illusion, it's the capacity to hold a different gaze long enough for something to change. Daring is the part no manual teaches.",
      queEsMpaBody3:
        "We call this Metalkimia: the practice of participating with more wakefulness — more capacity to discern — in the transformations already underway. Instead of reacting out of inertia: observing the configuration, discerning what depends on me, and reconfiguring from there.",
      transmutaKicker: "Systemic triangulation",
      transmutaBody1:
        "I start from a hypothesis: the minimal generative unit isn't duality, it's the triad. Two elements in relation generate a third reality — the relationship itself — which has its own identity, produces consequences and becomes a new element of the system.",
      transmutaBody2:
        "Triangulating isn't looking at three things: it's training the capacity to recognize that third element when it appears and act on it. Structure so something works, narrative so something is understood, art so something is felt — none is enough alone. A system without a story is illegible; a story without structure scatters; art without either is mere decoration.",
      transmutaBody3:
        "Systemic Triangulation Architecture is the method that puts this into practice: it organizes the way of observing, discerning, intervening and reconfiguring living systems, iteratively. It doesn't seek to directly change people, but to introduce discernments that reconfigure the system — expanding what each part can see, choose and do.",
      flowBody: "Systems architecture consulting and organizational transformation.",
      flowCta: "Learn about the practice",
      universeBadge: "Access mechanism pending confirmation",
      universeIniciadosTitle: "Access for the initiated",
      universeIniciadosBody: "If you've already been through the challenge, your key grants direct entry.",
      universeKeyPlaceholder: "Your seal / access key",
      universeEnter: "Cross the threshold",
      universeAccepted: "Seal recognized. The inner destination is yet to be revealed.",
      universeRejected: "The seal does not yet recognize this configuration.",
      universeNoIniciadosTitle: "Haven't been initiated yet?",
      universeNoIniciadosBody: "You don't click your way into the MPA Universe — you play your way in.",
      universeChallenge: "Discover what the veil of initiation conceals",
      publishingBadge: "Section under construction",
      publishingBody: "MPA's publishing imprint. ¡Qué Embole!, by Stray Sheep, is published under this imprint.",
    },
    common: {
      leerMas: "Read more",
    },
  },
} as const;

type DeepStringShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : DeepStringShape<T[Key]>;
};

export type TranslationShape = DeepStringShape<typeof translations.es>;
