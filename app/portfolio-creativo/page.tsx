"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useLanguage } from "../lib/i18n/LanguageContext";
import styles from "./portfolio.module.css";

const copy = {
  es: {
    eyebrow: "R.C. Dopazo · Escritora · Ilustradora · Vision Builder",
    title: "Construyo nuevas formas de ver, narrar y jugar.",
    intro: "Soy R.C. Dopazo, escritora, ilustradora, diseñadora de experiencias y Vision Builder. Traduzco una intención en un sistema visual, narrativo o lúdico capaz de expresar lo que todavía no encontraba su forma.",
    pdf: "Descargar dossier breve",
    explore: "Explorar proyectos",
    visionKicker: "Vision Builder",
    visionTitle: "No llego con una estética prefabricada. Encuentro la forma que la visión necesita.",
    visionBody: "Observo el propósito, el público y la experiencia que una idea quiere producir. A partir de ahí construyo lenguajes: personajes, símbolos, ilustraciones, tableros, consignas, secuencias y mundos que vuelven la propuesta reconocible y jugable.",
    services: ["Dirección de arte e ilustración editorial", "Diseño visual de juegos de ingenio", "Personajes, símbolos y universos narrativos", "Conceptualización y rediseño de experiencias"],
    selected: "Trabajo seleccionado",
    selectedTitle: "Una idea puede convertirse en libro, juego, personaje o puerta.",
    emboleKicker: "Universo editorial · Libro + experiencia",
    emboleTitle: "¡Qué Embole!",
    emboleBody: "Una obra expandida desde la escritura hacia la ilustración, los personajes, las escenas, los objetos simbólicos y las experiencias interactivas. La identidad visual no acompaña el relato: también lo cuenta.",
    emboleAppKicker: "Expansión digital · Miniapp",
    emboleAppTitle: "El libro continúa después de cerrar la tapa.",
    emboleAppBody: "La miniapp transforma la lectura en recorrido: organiza umbrales, propone jugadas, registra la vigilia y conecta el universo editorial con experiencias interactivas.",
    tarotKicker: "Sistema simbólico · Ilustración + lectura",
    tarotTitle: "El Tarot de los Essentors",
    tarotBody: "Desarrollo de un universo visual y pedagógico donde cada imagen funciona como escena, personaje y dispositivo de observación. La guía integra ilustración, composición editorial y una lectura que enseña a mirar antes de interpretar.",
    productsKicker: "Objetos editoriales · EVIGILA",
    productsTitle: "El universo también se puede tocar.",
    productsBody: "La Box Tábula MPA es una caja-objeto de PVC: abre, guarda las cartas y permite cambiar los paneles de lectura según la tirada. Puede venir en acabado madera o negro, con una plancha de stickers MPA y Atrevia para personalizarla. Stickers MPA · Próximamente.",
    digitalKicker: "Diseño de sistemas digitales · Narrativa + interfaz",
    digitalTitle: "Universo Magia para Atrevidos.",
    digitalBody: "Diseñé un territorio digital donde la navegación también cuenta la historia: umbrales, portales, personajes, desafíos y dispositivos simbólicos construyen una experiencia inmersiva. Estas imágenes muestran su arquitectura, pero el Universo MPA no tiene un acceso directo: solo se llega jugando.",
    gamesKicker: "Diseño de experiencias · Ingenio + narrativa",
    gamesTitle: "Jugar también es una forma de mirar.",
    gamesBody: "Diseño mecánicas, consignas y recorridos visuales que convierten una idea abstracta en una experiencia clara, atractiva y participativa. Mi interés no es decorar el juego: es hacer que su lógica se vuelva visible y memorable.",
    writingKicker: "Escritura",
    writingQuote: "Todo parece estar en orden. Tenés rutina. Tenés estructura. Tenés una vida que funciona. Y, sin embargo, un día aparece la frase: ‘Uh… qué embole.’",
    writingBody: "Escribo para volver observable una configuración. El texto, la imagen y el juego son tres modos de abrir la misma pregunta.",
    contactKicker: "Colaboraciones editoriales",
    contactTitle: "¿Qué visión necesita encontrar una nueva forma?",
    contactBody: "Puedo integrarme a un universo existente, rediseñar su lenguaje visual o construir una experiencia desde cero junto al equipo editorial.",
    contact: "Conversar sobre un proyecto",
  },
  en: {
    eyebrow: "R.C. Dopazo · Writer · Illustrator · Vision Builder",
    title: "I build new ways of seeing, narrating and playing.",
    intro: "I'm R.C. Dopazo, writer, illustrator, experience designer and Vision Builder. I translate an intention into a visual, narrative or playful system capable of expressing what had not yet found its form.",
    pdf: "Download short portfolio",
    explore: "Explore projects",
    visionKicker: "Vision Builder",
    visionTitle: "I do not arrive with a prefabricated aesthetic. I find the form each vision needs.",
    visionBody: "I observe the purpose, audience and experience an idea intends to create. From there I build languages: characters, symbols, illustrations, boards, prompts, sequences and worlds that make the proposal recognizable and playable.",
    services: ["Art direction and editorial illustration", "Visual design for puzzle games", "Characters, symbols and narrative universes", "Experience conceptualization and redesign"],
    selected: "Selected work",
    selectedTitle: "An idea can become a book, a game, a character or a doorway.",
    emboleKicker: "Editorial universe · Book + experience",
    emboleTitle: "¡Qué Embole!",
    emboleBody: "A work expanded from writing into illustration, characters, scenes, symbolic objects and interactive experiences. The visual identity does not merely accompany the story: it tells it too.",
    emboleAppKicker: "Digital expansion · Mini app",
    emboleAppTitle: "The book continues after the cover closes.",
    emboleAppBody: "The mini app turns reading into a journey: it organizes thresholds, proposes moves, records progress and connects the editorial universe with interactive experiences.",
    tarotKicker: "Symbolic system · Illustration + reading",
    tarotTitle: "The Tarot of the Essentors",
    tarotBody: "A visual and pedagogical universe where each image works as a scene, a character and an observation device. The guide combines illustration, editorial composition and a reading that teaches us to look before interpreting.",
    productsKicker: "Editorial objects · EVIGILA",
    productsTitle: "The universe can also be held.",
    productsBody: "The Box Tábula MPA is a PVC object-box: it opens, stores the cards and lets you change the reading panels for each spread. It can come in wood-look or black, with an MPA and Atrevia sticker sheet for personalization. MPA stickers · Coming soon.",
    digitalKicker: "Digital systems design · Narrative + interface",
    digitalTitle: "The Magia para Atrevidos Universe.",
    digitalBody: "I designed a digital territory where navigation also tells the story: thresholds, portals, characters, challenges and symbolic devices build an immersive experience. These images reveal its architecture, but the MPA Universe has no direct entrance: it can only be reached through play.",
    gamesKicker: "Experience design · Puzzles + narrative",
    gamesTitle: "Playing is also a way of seeing.",
    gamesBody: "I design mechanics, prompts and visual journeys that transform an abstract idea into a clear, compelling and participatory experience. I am not interested in decorating a game, but in making its logic visible and memorable.",
    writingKicker: "Writing",
    writingQuote: "Everything seems to be in order. You have a routine. You have structure. You have a life that works. And yet, one day the phrase appears: ‘Ugh… how boring.’",
    writingBody: "I write to make a configuration observable. Text, image and play are three ways of opening the same question.",
    contactKicker: "Editorial collaborations",
    contactTitle: "What vision needs to find a new form?",
    contactBody: "I can enter an existing universe, redesign its visual language or build an experience from scratch together with an editorial team.",
    contact: "Discuss a project",
  },
};

export default function PortfolioCreativoPage() {
  const { locale } = useLanguage();
  const t = copy[locale];

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className={styles.lead}>{t.intro}</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="/portfolio-creativo/rocio-dopazo-portfolio-creativo.pdf" download>{t.pdf} ↓</a>
              <a className={styles.secondary} href="#proyectos">{t.explore} →</a>
            </div>
          </div>
          <figure className={styles.heroVisionImage}>
            <Image src="/portfolio-creativo/portfolio-creativo-hero.png" alt="Mujer escribiendo frente a un libro abierto del que emergen las cartas, caminos, símbolos y portales del universo creativo MPA" width={690} height={962} priority sizes="(max-width: 900px) 92vw, 44vw" />
          </figure>
        </section>

        <section className={styles.vision}>
          <div>
            <p className={styles.kicker}>{t.visionKicker}</p>
            <h2>{t.visionTitle}</h2>
            <p>{t.visionBody}</p>
          </div>
          <ol>{t.services.map((service, index) => <li key={service}><span>{String(index + 1).padStart(2, "0")}</span>{service}</li>)}</ol>
        </section>

        <section className={styles.projects} id="proyectos">
          <header>
            <p className={styles.kicker}>{t.selected}</p>
            <h2>{t.selectedTitle}</h2>
          </header>

          <article className={`${styles.project} ${styles.embole}`}>
            <div className={styles.projectText}><p className={styles.kicker}>{t.emboleKicker}</p><h3>{t.emboleTitle}</h3><p>{t.emboleBody}</p><Link href="/mpa/publishing-house/stray-sheep-collection">Abrir universo →</Link></div>
            <div className={styles.emboleGallery}>
              <Image className={styles.book} src="/portfolio-creativo/embole-book-cover.png" alt="Ejemplar físico de ¡Qué Embole!" width={1086} height={1448} sizes="28vw" />
              <Image src="/portfolio-creativo/embole-book-bolas.png" alt="Doble página física de ¡Qué Embole! con personajes Bolas" width={1086} height={1448} sizes="28vw" />
              <Image src="/portfolio-creativo/embole-book-nigredo.png" alt="Doble página física del capítulo Nigredo" width={1086} height={1448} sizes="28vw" />
              <Image src="/portfolio-creativo/embole-book-lab.png" alt="Doble página física del Stray Mini Lab" width={1086} height={1448} sizes="28vw" />
            </div>
            <div className={styles.emboleAppFeature}>
              <div className={styles.emboleAppScreens}>
                <Image src="/portfolio-creativo/embole-miniapp.png" alt="Inicio de la miniapp interactiva de ¡Qué Embole!" width={1320} height={1522} sizes="34vw" />
                <Image src="/portfolio-creativo/embole-app-recorrido.png" alt="Recorrido del libro dentro de la miniapp de ¡Qué Embole!" width={1342} height={1528} sizes="28vw" />
                <Image src="/portfolio-creativo/embole-app-jugar.png" alt="Ruleta y juego interactivo de la miniapp de ¡Qué Embole!" width={1564} height={1564} sizes="28vw" />
              </div>
              <div>
                <p className={styles.kicker}>{t.emboleAppKicker}</p>
                <h4>{t.emboleAppTitle}</h4>
                <p>{t.emboleAppBody}</p>
              </div>
            </div>
          </article>

          <article className={`${styles.project} ${styles.tarot}`}>
            <div className={styles.tarotGallery}>
              <Image className={styles.tarotProductDeck} src="/portfolio-creativo/tarot-product-deck.png" alt="Producto físico del Tarot MPA: composición del mazo Infants" width={1152} height={1441} sizes="36vw" />
              <Image className={styles.tarotProductHarmonia} src="/portfolio-creativo/tarot-product-harmonia.png" alt="Producto físico del Tarot MPA: carta Harmonia Pactum" width={1152} height={1402} sizes="30vw" />
              <Image className={styles.tarotBack} src="/portfolio-creativo/tarot-back.png" alt="Contracara del sistema de cartas MPA" width={1004} height={1476} sizes="16vw" />
              <Image className={styles.tarotCreatix} src="/portfolio-creativo/tarot-creatix.png" alt="Carta Creatrix Imperatum del set Infants" width={1004} height={1476} sizes="16vw" />
              <Image className={styles.tarotBox} src="/portfolio-creativo/products/evigila-box-closed-reference.png" alt="Caja cerrada del Tarot EVIGILA" width={1536} height={1024} sizes="24vw" />
              <Image className={styles.tarotDorso} src="/portfolio-creativo/products/evigila-dorso.png" alt="Dorso del sistema EVIGILA Tarot" width={1024} height={1536} sizes="14vw" />
            </div>
            <div className={styles.projectText}><p className={styles.kicker}>{t.tarotKicker}</p><h3>{t.tarotTitle}</h3><p>{t.tarotBody}</p></div>
          </article>

          <article className={`${styles.project} ${styles.products}`}>
            <div className={styles.productGallery}>
              <Image src="/portfolio-creativo/products/evigila-universo-completo.png" alt="Universo EVIGILA con Box Tábula, caja cerrada, cartas del tarot y dorso integrado" width={1536} height={1024} sizes="(max-width: 900px) 92vw, 44vw" />
            </div>
            <div className={styles.projectText}><p className={styles.kicker}>{t.productsKicker}</p><h3>{t.productsTitle}</h3><p>{t.productsBody}</p></div>
          </article>

          <article className={`${styles.project} ${styles.digital}`}>
            <div className={styles.projectText}>
              <p className={styles.kicker}>{t.digitalKicker}</p>
              <h3>{t.digitalTitle}</h3>
              <p>{t.digitalBody}</p>
            </div>
            <div className={styles.digitalGallery}>
              <Image className={styles.digitalUniverse} src="/portfolio-creativo/embole-digital-universo.png" alt="Vista del Universo Magia para Atrevidos" width={2048} height={1002} sizes="62vw" />
              <Image className={styles.digitalPortals} src="/portfolio-creativo/embole-digital-portales.png" alt="Sistema de portales y experiencias del Universo MPA" width={2048} height={986} sizes="48vw" />
              <Image className={styles.digitalMirror} src="/portfolio-creativo/embole-digital-espejo.png" alt="Experiencia narrativa del Espejo en el Universo MPA" width={1528} height={1446} sizes="28vw" />
            </div>
          </article>

          <article className={`${styles.project} ${styles.games}`}>
            <div className={styles.projectText}><p className={styles.kicker}>{t.gamesKicker}</p><h3>{t.gamesTitle}</h3><p>{t.gamesBody}</p><Link href="/dima">Explorar DIMA →</Link></div>
            <div className={styles.gameGallery}>
              <Image src="/stray-laboratorio.png" alt="Experiencia lúdica del universo Stray Sheep" width={715} height={944} sizes="30vw" />
              <Image src="/dima-machine-cutout-v1.png" alt="DIMA, dispositivo interactivo de palabras" width={1024} height={1536} sizes="30vw" />
            </div>
          </article>
        </section>

        <section className={styles.writing}>
          <p className={styles.kicker}>{t.writingKicker}</p>
          <blockquote>{t.writingQuote}</blockquote>
          <p>{t.writingBody}</p>
        </section>

        <section className={styles.contact}>
          <p className={styles.kicker}>{t.contactKicker}</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactBody}</p>
          <Link href="/#contacto">{t.contact} →</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
