export function CosmicMotion() {
  return (
    <svg className="cosmic-motion-overlay" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="light-branch branch-gold">
        <path d="M-70 165 L90 120 L175 188 L290 132 L405 205" />
        <path d="M90 120 L132 52 M175 188 L205 260 M290 132 L338 72" />
        <circle cx="90" cy="120" r="3" /><circle cx="175" cy="188" r="2.5" /><circle cx="290" cy="132" r="3.5" /><circle cx="405" cy="205" r="2" />
      </g>
      <g className="light-branch branch-violet">
        <path d="M580 420 L665 350 L750 405 L835 318 L930 370 L1060 305" />
        <path d="M665 350 L625 278 M750 405 L728 493 M835 318 L872 245 M930 370 L960 454" />
        <circle cx="665" cy="350" r="3" /><circle cx="750" cy="405" r="2.5" /><circle cx="835" cy="318" r="3.5" /><circle cx="930" cy="370" r="3" />
      </g>
      <g className="light-branch branch-pink">
        <path d="M90 625 L185 555 L270 602 L355 530 L470 585" />
        <path d="M185 555 L150 480 M270 602 L300 675 M355 530 L405 458" />
        <circle cx="185" cy="555" r="3" /><circle cx="270" cy="602" r="2.5" /><circle cx="355" cy="530" r="3.5" /><circle cx="470" cy="585" r="2" />
      </g>
    </svg>
  );
}
