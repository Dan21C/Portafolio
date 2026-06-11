import { useEffect, useRef } from 'react';
import { Hexagon, Cpu, BarChart2, Zap } from 'lucide-react';
import styles from './Hero.module.css';

const metrics = [
  { color: '#00AFFF', metricColor: '#00D1FF', metric: '+80',  label: 'marcas'     },
  { color: '#22C55E', metricColor: '#4ADE80', metric: '+35%', label: 'engagement' },
  { color: '#8B5CF6', metricColor: '#A78BFA', metric: '6',    label: 'verticales' },
];

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();

    const onResize = () => resize();
    const onMouse  = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener('resize',    onResize);
    window.addEventListener('mousemove', onMouse);

    const N = 85;
    const nodes = Array.from({ length: N }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r:  0.8 + Math.random() * 0.7,
    }));

    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const mx = (mouse.x / W - 0.5) * 0.06;
      const my = (mouse.y / H - 0.5) * 0.06;

      for (const n of nodes) {
        n.x += n.vx + mx;
        n.y += n.vy + my;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 130) * 0.30})`;
            ctx.lineWidth   = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,1)';
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',    onResize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <section className={styles.hero} id="inicio">

      {/* Layer 2 — massive radial glow */}
      <div className={styles.glowMain} />

      {/* Layer 3 — aurora clouds */}
      <div className={`${styles.aurora} ${styles.auroraA}`} />
      <div className={`${styles.aurora} ${styles.auroraB}`} />
      <div className={`${styles.aurora} ${styles.auroraC}`} />

      {/* Layer 4 — space dust */}
      <div className={styles.stars} />

      {/* Layer 5 — AI network canvas */}
      <canvas ref={canvasRef} className={styles.network} />

      {/* Layer 6 — perspective grid */}
      <div className={styles.perspGrid} />

      {/* Layer 7 — energy streaks */}
      <div className={styles.streakA} />
      <div className={styles.streakB} />
      <div className={styles.streakC} />

      {/* LEFT */}
      <div className={styles.left}>

        <h1 className={styles.headline}>
          Experiencias que conectan.<br />
          <span className={styles.headlineGrad}>Datos que impulsan.</span>
        </h1>

        <p className={styles.sub}>
          Diseñamos, desarrollamos e implementamos soluciones de gamificación,
          analítica e inteligencia artificial para transformar marcas y operaciones.
        </p>

        <div className={styles.metricCards}>
          {metrics.map(({ color, metricColor, metric, label }) => (
            <div key={label} className={styles.metricCard}>
              <div
                className={styles.iconGlow}
                style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
              />
              <Hexagon
                size={28}
                strokeWidth={1.8}
                color={color}
                className={styles.metricIcon}
                style={{ filter: `drop-shadow(0 0 8px ${color})` }}
              />
              <div className={styles.metricText}>
                <span className={styles.metricValue} style={{ color: metricColor }}>{metric}</span>
                <span className={styles.metricLabel}>{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="#contacto" className={styles.btnPrimary}>
            Agendar demo <Arrow />
          </a>
          <a href="#servicios" className={styles.btnSecondary}>
            Ver soluciones <Arrow />
          </a>
        </div>

        <p className={styles.trust}>
          Confiado por marcas en&nbsp;
          <img src="https://flagcdn.com/16x12/co.png" width="16" height="12" alt="Colombia" className={styles.flag} /> Colombia&nbsp;·&nbsp;
          <img src="https://flagcdn.com/16x12/mx.png" width="16" height="12" alt="México" className={styles.flag} /> México&nbsp;·&nbsp;
          <img src="https://flagcdn.com/16x12/ar.png" width="16" height="12" alt="Argentina" className={styles.flag} /> Argentina
        </p>

      </div>

      {/* RIGHT — Command center */}
      <div className={styles.right}>
        <div className={styles.frameOuter}>
          <div className={styles.visualFrame}>

            {/* Corner glows */}
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />

            {/* Holographic rings platform */}
            <div className={styles.ringsWrap}>
              <div className={styles.lightBeam} />
              <div className={`${styles.ring} ${styles.r1}`} />
              <div className={`${styles.ring} ${styles.r2}`} />
              <div className={`${styles.ring} ${styles.r3}`} />
              <div className={`${styles.ring} ${styles.r4}`} />
            </div>

            {/* Network data-flow SVG */}
            <svg className={styles.netSvg} viewBox="0 0 620 600" preserveAspectRatio="none">
              <path d="M 165 190 C 255 140 365 175 465 225" className={`${styles.fp} ${styles.fp1}`} />
              <path d="M 165 320 C 255 290 365 295 465 340" className={`${styles.fp} ${styles.fp2}`} />
              <path d="M 165 430 C 255 405 365 410 465 445" className={`${styles.fp} ${styles.fp3}`} />
              <path d="M 215 145 C 325 105 445 170 515 255" className={`${styles.fp} ${styles.fp4}`} />
              <path d="M 205 500 C 325 470 435 462 515 428" className={`${styles.fp} ${styles.fp5}`} />
            </svg>

            {/* Globe */}
            <div className={styles.globeWrap}>
              <div className={styles.globeAura} />
              <img src="/Assets/Hero/Planet.png" alt="" className={styles.globe} />
            </div>

            {/* Left — Capability Modules */}
            <div className={styles.leftModules}>
              {[
                { Icon: Cpu,       color: '#6366f1', accent: 'rgba(99,102,241,.40)',  title: 'Inteligencia Artificial',  desc: 'Modelos predictivos en tiempo real' },
                { Icon: BarChart2, color: '#06b6d4', accent: 'rgba(6,182,212,.40)',   title: 'Analytics 360°',           desc: 'Insights accionables y datos vivos' },
                { Icon: Zap,       color: '#10b981', accent: 'rgba(16,185,129,.40)',  title: 'Automatización',           desc: 'Flujos inteligentes y orquestación' },
              ].map(({ Icon, color, accent, title, desc }, i) => (
                <div key={title} className={`${styles.moduleCard} ${styles[`mc${i + 1}`]}`}>
                  <div className={styles.moduleGlow} style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
                  <div className={styles.moduleIcon} style={{ borderColor: accent, boxShadow: `0 0 14px ${color}22` }}>
                    <Icon size={16} strokeWidth={1.5} color={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
                  </div>
                  <div className={styles.moduleText}>
                    <span className={styles.moduleTitle}>{title}</span>
                    <span className={styles.moduleDesc}>{desc}</span>
                  </div>
                  <div className={styles.moduleAccent} style={{ background: `linear-gradient(90deg, ${color}88, transparent)` }} />
                </div>
              ))}
            </div>

            {/* Right — Service Cards */}
            <div className={styles.rightCards}>

              {/* EXPERIENCIAS */}
              <div className={`${styles.svcCard} ${styles.sc1}`}>
                <div className={styles.svcHeader}>
                  <div>
                    <div className={styles.svcTitle}>Experiencias</div>
                    <div className={styles.svcSub}>Gamificación &amp; Engagement</div>
                  </div>
                  <span className={styles.svcDot} />
                </div>
                <svg viewBox="0 0 170 34" fill="none" className={styles.svcChart}>
                  <defs>
                    <linearGradient id="ecg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,30 25,26 50,28 80,16 105,20 130,8 155,4 170,1 170,34 0,34" fill="url(#ecg1)" />
                  <polyline points="0,30 25,26 50,28 80,16 105,20 130,8 155,4 170,1"
                    stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className={styles.svcLine}
                  />
                  <circle cx="130" cy="8"  r="2.5" fill="#22d3ee" opacity="0.9" />
                  <circle cx="170" cy="1"  r="3"   fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 5px #06b6d4)' }} />
                </svg>
                <div className={styles.svcBottom}>
                  <span className={styles.svcVal}>+35%</span>
                  <span className={styles.svcLabel}>vs. trimestre anterior</span>
                </div>
              </div>

              {/* DESARROLLO */}
              <div className={`${styles.svcCard} ${styles.sc2}`}>
                <div className={styles.svcHeader}>
                  <div>
                    <div className={styles.svcTitle}>Desarrollo</div>
                    <div className={styles.svcSub}>Full-Stack &amp; Arquitectura</div>
                  </div>
                  <span className={styles.svcDot} style={{ background: '#6366f1', boxShadow: '0 0 10px rgba(99,102,241,.80)' }} />
                </div>
                <div className={styles.stackBars}>
                  {[
                    { label: 'Frontend', pct: 88, color: '#6366f1' },
                    { label: 'Backend',  pct: 94, color: '#06b6d4' },
                    { label: 'AI / ML',  pct: 76, color: '#10b981' },
                  ].map(({ label, pct, color }, idx) => (
                    <div key={label} className={styles.barRow}>
                      <span className={styles.barLabel}>{label}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${pct}%`,
                            background: color,
                            boxShadow: `0 0 8px ${color}55`,
                            animationDelay: `${idx * 0.14 + 0.5}s`,
                          }}
                        />
                      </div>
                      <span className={styles.barPct} style={{ color }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOLUCIONES IA */}
              <div className={`${styles.svcCard} ${styles.sc3}`}>
                <div className={styles.svcHeader}>
                  <div>
                    <div className={styles.svcTitle}>Soluciones IA</div>
                    <div className={styles.svcSub}>Precisión del modelo</div>
                  </div>
                  <span className={styles.svcDot} style={{ background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,.80)' }} />
                </div>
                <div className={styles.iaRow}>
                  <svg viewBox="0 0 70 70" className={styles.iaDonut}>
                    <defs>
                      <filter id="gglow">
                        <feGaussianBlur stdDeviation="1.8" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <circle cx="35" cy="35" r="27" stroke="rgba(16,185,129,0.10)" strokeWidth="4.5" fill="none" />
                    <circle cx="35" cy="35" r="27" stroke="#10b981" strokeWidth="4.5" fill="none"
                      strokeLinecap="round" transform="rotate(-90 35 35)"
                      className={styles.iaArc} filter="url(#gglow)"
                    />
                    <text x="35" y="32" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="700" fontFamily="sans-serif">94.6%</text>
                    <text x="35" y="43" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="6.5" fontFamily="sans-serif" letterSpacing="0.08em">ACCURACY</text>
                  </svg>
                  <div className={styles.iaSide}>
                    <span className={styles.iaTrend}>↑ 18%</span>
                    <svg viewBox="0 0 84 28" fill="none" className={styles.iaSparkline}>
                      <defs>
                        <linearGradient id="iag1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0"    />
                        </linearGradient>
                      </defs>
                      <polygon points="0,24 14,20 28,22 42,14 56,16 70,8 84,5 84,28 0,28" fill="url(#iag1)" />
                      <polyline points="0,24 14,20 28,22 42,14 56,16 70,8 84,5"
                        stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                    <span className={styles.iaVsText}>vs. trimestre anterior</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom info bar */}
            <div className={styles.infoBar}>
              <span className={styles.statusDot} />
              <span>Soluciones diseñadas para escalar negocios en Latinoamérica</span>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
