import { useEffect, useRef, useState } from 'react';
import styles from './Stack.module.css';

/* ─── Icons ──────────────────────────────────────────────────── */

const ITag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IScreen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4" width="19" height="14" rx="2"/>
    <path d="M8 21h8M12 18v3M9 10l-2 2 2 2M15 10l2 2-2 2"/>
  </svg>
);

const IStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────── */

const SOLUTIONS = [
  {
    id: 'exp',
    accent: '#FF464D', rgb: '255,70,77',
    Icon: IScreen,
    label: 'EXPERIENCIAS',
    headline: 'Experiencias que activan marcas.',
    desc: 'Tecnología inmersiva en cada punto de contacto. Convertimos presencia física en participación medible y recuerdo de marca que dura.',
    isMain: true,
    services: [
      { dot: '#FF464D', dotRgb: '255,70,77',  name: 'Activaciones interactivas', detail: 'Pantallas táctiles · Totems · Kioscos' },
      { dot: '#E4585E', dotRgb: '228,88,94',  name: 'Gamificación & Loyalty',    detail: 'Puntos · Retos · Rankings · Recompensas' },
      { dot: '#C9353D', dotRgb: '201,53,61',  name: 'Micrositios & Registro',    detail: 'Landing de evento · Formularios · QR' },
      { dot: '#B6BEC8', dotRgb: '182,190,200', name: 'Contenido & Motion',       detail: 'Video · Animación · Branding digital' },
    ],
  },
  {
    id: 'events',
    accent: '#C9353D', rgb: '201,53,61',
    Icon: IStar,
    label: 'EVENTOS 360',
    headline: 'Del concepto al evento. Sin detalles perdidos.',
    desc: 'Estrategia, producción y operación completa. Cada evento es una historia que posiciona marca y convierte audiencia en comunidad.',
    metric: '360°', metricLabel: 'producción integral',
    tags: ['Estrategia & Concept', 'Producción', 'Lanzamientos', 'Conferencias'],
  },
  {
    id: 'merch',
    accent: '#8A939E', rgb: '138,147,158',
    Icon: ITag,
    label: 'MERCH & STANDS',
    headline: 'Marca en cada detalle.',
    desc: 'Diseño e impresión de todo lo que viste al evento. Stands, merch exclusivo, señalética y material de marca de alto impacto.',
    metric: '+50', metricLabel: 'marcas en eventos',
    tags: ['Diseño de stands', 'Merch exclusivo', 'Señalética', 'Branded content'],
  },
];

/* ─── Component ──────────────────────────────────────────────── */

const Stack = () => {
  const ref            = useRef(null);
  const ctaWrapperRef  = useRef(null);
  const ctaRef         = useRef(null);

  const [visible,    setVisible]    = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [rotation,   setRotation]   = useState(0);   // 0–180 driven by scroll
  const [formSent,   setFormSent]   = useState(false);
  const [step,       setStep]       = useState(1);
  const [currency,   setCurrency]   = useState('usd');
  const [formData,   setFormData]   = useState({
    name:'', lastName:'', email:'', phone:'', company:'', role:'', country:'',
    type:'', budget:'', urgency:'', source:'', msg:'',
  });

  // Stack section reveal
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  // CTA section reveal (wrapper enters viewport)
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCtaVisible(true); },
      { threshold: 0.05 }
    );
    o.observe(ctaRef.current);
    return () => o.disconnect();
  }, []);

  // Scroll-driven card rotation
  useEffect(() => {
    const handleScroll = () => {
      const wrapper = ctaWrapperRef.current;
      if (!wrapper) return;
      const rect           = wrapper.getBoundingClientRect();
      const totalScrollable = wrapper.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled  = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, scrolled / totalScrollable);

      // Hold at 0° for first 15%, flip between 15–85%, hold at 180° last 15%
      const deg = rawProgress < 0.15
        ? 0
        : rawProgress > 0.85
          ? 180
          : ((rawProgress - 0.15) / 0.70) * 180;
      setRotation(deg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // sync on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flipBack = () => {
    const top = ctaWrapperRef.current?.offsetTop ?? 0;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }));

  const resetForm = () => {
    setFormSent(false);
    setStep(1);
    setCurrency('usd');
    setFormData({ name:'', lastName:'', email:'', phone:'', company:'', role:'', country:'', type:'', budget:'', urgency:'', source:'', msg:'' });
  };

  const switchCurrency = (c) => {
    setCurrency(c);
    setFormData(p => ({ ...p, budget: '' }));
  };

  return (
    <>
      {/* ── SOLUCIONES ─────────────────────────────────────────── */}
      <section ref={ref} id="soluciones" className={`${styles.section} ${visible ? styles.visible : ''}`}>

        <div className={styles.bgNebula}  />
        <div className={styles.bgNebula2} />
        <div className={styles.bgScan}    />

        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            SOLUCIONES
          </div>
          <h2 className={styles.headline}>
            Todo lo que<br />
            tu negocio <span className={styles.gradWord}>necesita</span>.
          </h2>
          <p className={styles.sub}>
            Software inteligente, experiencias digitales y producción de eventos.<br />
            Una sola alianza, sin intermediarios.
          </p>
        </div>

        <div className={styles.grid}>
          {SOLUTIONS.map((sol, i) => (
            <div
              key={sol.id}
              className={`${styles.card} ${sol.isMain ? styles.solCardMain : ''}`}
              style={{ '--accent': sol.accent, '--rgb': sol.rgb, '--delay': `${i * 120}ms` }}
            >
              <div className={styles.cardGlow} />
              <div
                className={styles.accentBar}
                style={{ background: `linear-gradient(90deg, ${sol.accent}CC, transparent)` }}
              />

              <div className={styles.cardHead}>
                <div
                  className={styles.iconBox}
                  style={{
                    color:        sol.accent,
                    borderColor: `rgba(${sol.rgb},.24)`,
                    background:  `rgba(${sol.rgb},.09)`,
                  }}
                >
                  <sol.Icon />
                </div>
                <span
                  className={styles.pill}
                  style={{
                    color:       sol.accent,
                    borderColor: `rgba(${sol.rgb},.30)`,
                    background:  `rgba(${sol.rgb},.09)`,
                  }}
                >
                  {sol.label}
                </span>
              </div>

              <div className={styles.catTitleWrap}>
                <h4 className={styles.catTitle}>{sol.headline}</h4>
              </div>
              <p className={styles.catDesc}>{sol.desc}</p>

              {sol.isMain ? (
                <div className={styles.solServices}>
                  {sol.services.map((svc, si) => (
                    <div
                      key={svc.name}
                      className={styles.solServiceRow}
                      style={{ '--s-delay': `${si * 80}ms` }}
                    >
                      <span
                        className={styles.solServiceDot}
                        style={{
                          background:  svc.dot,
                          boxShadow:  `0 0 8px rgba(${svc.dotRgb},.70)`,
                        }}
                      />
                      <div>
                        <div className={styles.solServiceName}>{svc.name}</div>
                        <div className={styles.solServiceDetail}>{svc.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className={styles.solMetric}>
                    <span className={styles.solMetricNum} style={{ '--rgb': sol.rgb }}>
                      {sol.metric}
                    </span>
                    <span className={styles.solMetricLabel}>{sol.metricLabel}</span>
                  </div>
                  <div className={styles.techWrap}>
                    {sol.tags.map((t, ti) => (
                      <span
                        key={t}
                        className={styles.techPill}
                        style={{
                          borderColor: `rgba(${sol.rgb},.20)`,
                          background:  `rgba(${sol.rgb},.07)`,
                          '--pill-i':  ti,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA wrapper — provides scroll room for the flip ─── */}
      <div ref={ctaWrapperRef} className={styles.ctaWrapper}>
      <section
        ref={ctaRef}
        id="contacto"
        className={`${styles.ctaSection} ${ctaVisible ? styles.ctaVisible : ''}`}
      >
        <div className={styles.ctaTopLine} />
        <div className={styles.ctaAurora}  />
        <div className={styles.ctaAurora2} />
        <div className={styles.ctaAurora3} />
        <div className={styles.ctaGrid}    />

        <div className={styles.ctaInner}>

          <p className={styles.ctaEyebrow}>
            <span className={styles.ctaEyebrowDot} />
            ¿Tienes un proyecto en mente?
          </p>

          {/* ── 3D Flip Card ──────────────────────────────── */}
          <div className={styles.ctaScene}>
            <div
              className={styles.ctaCard}
              style={{ transform: `rotateY(${rotation}deg)` }}
            >

              {/* FRONT — headline + CTAs */}
              <div className={styles.ctaFront}>
                <div className={styles.ctaFrontGlow} />
                <div className={styles.ctaFrontTopBar} />

                <div className={styles.ctaFrontLayout}>
                  {/* Left — headline + acciones */}
                  <div className={styles.ctaFrontLeft}>
                    <div className={styles.ctaFrontTag}>
                      <span className={styles.ctaTagDot} />
                      Proyecto en mente
                    </div>
                    <h2 className={styles.ctaTitle}>
                      Ingeniería que<br />
                      <span className={styles.ctaGradWord}>transforma</span><br />
                      negocios.
                    </h2>
                    <p className={styles.ctaSub}>
                      Sin plantillas. Sin intermediarios.<br />
                      Del reto a producción.
                    </p>
                    <div className={styles.ctaFrontActions}>
                      <button
                        className={styles.ctaBtnPrimary}
                        onClick={() => {
                          const top = (ctaWrapperRef.current?.offsetTop ?? 0)
                            + (ctaWrapperRef.current?.offsetHeight ?? 0)
                            - window.innerHeight;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }}
                        type="button"
                      >
                        Escribir mensaje <Arrow />
                      </button>
                      <a
                        href="https://wa.me/573000000000"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.ctaBtnText}
                      >
                        WhatsApp directo →
                      </a>
                    </div>
                  </div>

                  <div className={styles.ctaFrontDivider} />

                  {/* Right — diferenciadores */}
                  <div className={styles.ctaFrontRight}>
                    {[
                      'Solución 100% personalizada',
                      'Sin plantillas ni intermediarios',
                      'Equipo senior dedicado',
                      'Soporte post-lanzamiento',
                    ].map(f => (
                      <div key={f} className={styles.ctaFeatureItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BACK — contact form */}
              <div className={styles.ctaBack}>
                <div className={styles.ctaFrontGlow} />
                <div className={styles.ctaBackTopBar} />

                {/* Header row */}
                <div className={styles.ctaBackHead}>
                  <div>
                    <p className={styles.ctaFormLabel}>Formulario de contacto</p>
                    <h3 className={styles.ctaFormTitle}>
                      {formSent ? '¡Mensaje enviado!' : step === 1 ? 'Tu información' : 'Tu proyecto'}
                    </h3>
                  </div>
                  <button className={styles.ctaFlipBack} onClick={flipBack} type="button" aria-label="Cerrar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {formSent ? (
                  /* ── Success ── */
                  <div className={styles.ctaSuccess}>
                    <div className={styles.ctaSuccessIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF464D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <p className={styles.ctaSuccessText}>Te respondemos en menos de 24 horas hábiles.</p>
                    <button className={styles.ctaBtnSecondary} onClick={() => { flipBack(); resetForm(); }} type="button">
                      Volver al inicio
                    </button>
                  </div>

                ) : (
                  <>
                    {/* ── Step indicator ── */}
                    <div className={styles.stepBar}>
                      <div className={`${styles.stepDot} ${step >= 1 ? styles.stepDotOn : ''}`}>1</div>
                      <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineOn : ''}`} />
                      <div className={`${styles.stepDot} ${step >= 2 ? styles.stepDotOn : ''}`}>2</div>
                    </div>

                    {step === 1 ? (
                      /* ── Step 1 ── */
                      <form className={styles.ctaForm} onSubmit={e => { e.preventDefault(); setStep(2); }}>
                        <div className={styles.ctaFormRow}>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Nombre *</label>
                            <input className={styles.ctaInput} type="text" placeholder="Tu nombre" required value={formData.name} onChange={set('name')} />
                          </div>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Apellido</label>
                            <input className={styles.ctaInput} type="text" placeholder="Tu apellido" value={formData.lastName} onChange={set('lastName')} />
                          </div>
                        </div>
                        <div className={styles.ctaFormRow}>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Email *</label>
                            <input className={styles.ctaInput} type="email" placeholder="tu@email.com" required value={formData.email} onChange={set('email')} />
                          </div>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Teléfono</label>
                            <input className={styles.ctaInput} type="tel" placeholder="+57 300 000 0000" value={formData.phone} onChange={set('phone')} />
                          </div>
                        </div>
                        <div className={styles.ctaFormRow}>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Empresa</label>
                            <input className={styles.ctaInput} type="text" placeholder="Nombre de tu empresa" value={formData.company} onChange={set('company')} />
                          </div>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Cargo</label>
                            <select className={styles.ctaInput} value={formData.role} onChange={set('role')}>
                              <option value="">Selecciona</option>
                              <option value="ceo">CEO / Fundador</option>
                              <option value="cto">CTO / Dir. Técnico</option>
                              <option value="director">Director / Gerente</option>
                              <option value="coord">Coordinador / Jefe</option>
                              <option value="consultor">Freelancer / Consultor</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.ctaField}>
                          <label className={styles.ctaFieldLabel}>País</label>
                          <select className={styles.ctaInput} value={formData.country} onChange={set('country')}>
                            <option value="">Selecciona tu país</option>
                            <option value="co">Colombia</option>
                            <option value="mx">México</option>
                            <option value="ar">Argentina</option>
                            <option value="cl">Chile</option>
                            <option value="pe">Perú</option>
                            <option value="ec">Ecuador</option>
                            <option value="us">Estados Unidos</option>
                            <option value="es">España</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                        <button type="submit" className={styles.ctaBtnPrimary}>
                          Continuar <Arrow />
                        </button>
                      </form>

                    ) : (
                      /* ── Step 2 ── */
                      <form className={styles.ctaForm} onSubmit={e => { e.preventDefault(); setFormSent(true); }}>
                        <div className={styles.ctaFormRow}>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Tipo de proyecto *</label>
                            <select className={styles.ctaInput} required value={formData.type} onChange={set('type')}>
                              <option value="">Selecciona</option>
                              <option value="web">Desarrollo Web / App</option>
                              <option value="ia">IA & Automatización</option>
                              <option value="data">Datos & Analytics</option>
                              <option value="exp">Experiencia Digital</option>
                              <option value="integracion">Integración de Sistemas</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Presupuesto aprox.</label>
                            <div className={styles.budgetInput}>
                              <select className={styles.budgetSelect} value={formData.budget} onChange={set('budget')}>
                                <option value="">Selecciona rango</option>
                                {currency === 'usd' ? (<>
                                  <option value="lt2k">Menos de $2,000</option>
                                  <option value="2-5k">$2,000 – $5,000</option>
                                  <option value="5-15k">$5,000 – $15,000</option>
                                  <option value="15-40k">$15,000 – $40,000</option>
                                  <option value="40-100k">$40,000 – $100,000</option>
                                  <option value="gt100k">Más de $100,000</option>
                                </>) : (<>
                                  <option value="lt8m">Menos de $8M</option>
                                  <option value="8-20m">$8M – $20M</option>
                                  <option value="20-60m">$20M – $60M</option>
                                  <option value="60-150m">$60M – $150M</option>
                                  <option value="150-400m">$150M – $400M</option>
                                  <option value="gt400m">Más de $400M</option>
                                </>)}
                                <option value="nd">Por definir</option>
                              </select>
                              <div className={styles.currencyToggle}>
                                <button type="button" className={`${styles.currencyBtn} ${currency === 'usd' ? styles.currencyBtnOn : ''}`} onClick={() => switchCurrency('usd')}>USD</button>
                                <button type="button" className={`${styles.currencyBtn} ${currency === 'cop' ? styles.currencyBtnOn : ''}`} onClick={() => switchCurrency('cop')}>COP</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.ctaFormRow}>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>Urgencia</label>
                            <select className={styles.ctaInput} value={formData.urgency} onChange={set('urgency')}>
                              <option value="">Selecciona</option>
                              <option value="now">Lo antes posible</option>
                              <option value="1-3m">1 – 3 meses</option>
                              <option value="3-6m">3 – 6 meses</option>
                              <option value="gt6m">Más de 6 meses</option>
                            </select>
                          </div>
                          <div className={styles.ctaField}>
                            <label className={styles.ctaFieldLabel}>¿Cómo nos encontraste?</label>
                            <select className={styles.ctaInput} value={formData.source} onChange={set('source')}>
                              <option value="">Selecciona</option>
                              <option value="google">Google / Búsqueda web</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="instagram">Instagram / Redes sociales</option>
                              <option value="referido">Referido</option>
                              <option value="evento">Evento / Conferencia</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.ctaField}>
                          <label className={styles.ctaFieldLabel}>Cuéntanos tu reto *</label>
                          <textarea className={styles.ctaTextarea} placeholder="Describe brevemente tu proyecto o necesidad..." rows={2} required value={formData.msg} onChange={set('msg')} />
                        </div>
                        <div className={styles.ctaFormNav}>
                          <button type="button" className={styles.ctaBtnBack} onClick={() => setStep(1)}>
                            ← Anterior
                          </button>
                          <button type="submit" className={styles.ctaBtnPrimary}>
                            Enviar mensaje <Arrow />
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
          {/* ── /3D Card ───────────────────────────────────── */}

          <div className={styles.ctaTrust}>
            <span className={styles.ctaTrustItem}>
              <span className={styles.ctaTrustDot} style={{ background: '#FF464D' }} />
              Respuesta en &lt; 24h
            </span>
            <span className={styles.ctaTrustSep} />
            <span className={styles.ctaTrustItem}>
              <span className={styles.ctaTrustDot} style={{ background: '#E4585E' }} />
              Sin compromiso inicial
            </span>
            <span className={styles.ctaTrustSep} />
            <span className={styles.ctaTrustItem}>
              <span className={styles.ctaTrustDot} style={{ background: '#B6BEC8' }} />
              +80 marcas atendidas
            </span>
          </div>

        </div>
      </section>
      </div>{/* /ctaWrapper */}
    </>
  );
};

export default Stack;
