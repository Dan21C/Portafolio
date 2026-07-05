const BrainLogo = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="rgba(255,70,77,0.1)" stroke="rgba(255,70,77,0.35)" strokeWidth="1.5"/>
    {/* Brain shape */}
    <path
      d="M27 30c0-5.5 4.5-10 10-10 2.2 0 4.2.7 5.8 1.9 1.1-1.2 2.7-1.9 4.5-1.9 4.4 0 8 3.6 8 8 0 1-.2 2-.5 2.9 2.1 1.5 3.5 4 3.5 6.8 0 4.7-3.8 8.3-8.5 8.3H30c-4.4 0-8-3.6-8-8 0-1.8.6-3.5 1.6-4.9C23.2 32.5 23 31.3 23 30h4z"
      stroke="#9B7FFF"
      strokeWidth="1.8"
      fill="rgba(255,70,77,0.07)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Circuit nodes */}
    <circle cx="33" cy="38" r="2.5" fill="#7B5CF0"/>
    <circle cx="40" cy="32" r="2.5" fill="#7B5CF0"/>
    <circle cx="47" cy="38" r="2.5" fill="#7B5CF0"/>
    <circle cx="40" cy="44" r="2.5" fill="#9B7FFF"/>
    {/* Connections */}
    <line x1="33" y1="38" x2="40" y2="32" stroke="#7B5CF0" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="40" y1="32" x2="47" y2="38" stroke="#7B5CF0" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="33" y1="38" x2="40" y2="44" stroke="#7B5CF0" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="47" y1="38" x2="40" y2="44" stroke="#7B5CF0" strokeWidth="1" strokeDasharray="2 2"/>
    {/* Antenna */}
    <line x1="40" y1="20" x2="40" y2="14" stroke="#9B7FFF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="40" cy="12" r="2" fill="#9B7FFF"/>
    {/* Side lines */}
    <line x1="27" y1="30" x2="21" y2="24" stroke="#9B7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="53" y1="30" x2="59" y2="24" stroke="#9B7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Bottom outputs */}
    <line x1="34" y1="48" x2="34" y2="56" stroke="#9B7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="40" y1="48" x2="40" y2="56" stroke="#9B7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="46" y1="48" x2="46" y2="56" stroke="#9B7FFF" strokeWidth="1.2" strokeLinecap="round"/>
    {/* Animated rotating ring */}
    <circle cx="40" cy="40" r="36" stroke="rgba(255,70,77,0.12)" strokeWidth="1" strokeDasharray="4 8" fill="none">
      <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="20s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export default BrainLogo;
