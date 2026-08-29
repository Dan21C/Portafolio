import { useEffect, useRef, useState } from 'react';
import styles from './Stack.module.css';

/* ─── Icons ──────────────────────────────────────────────────── */

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ─── Component ──────────────────────────────────────────────── */

const Stack = () => {
  const ctaWrapperRef  = useRef(null);
  const ctaRef         = useRef(null);
  const formStartedRef = useRef(0);

  const [ctaVisible, setCtaVisible] = useState(false);
  const [rotation,   setRotation]   = useState(0);   // 0–180 driven by scroll
  const [formSent,   setFormSent]   = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [step,       setStep]       = useState(1);
  const [currency,   setCurrency]   = useState('usd');
  const [formData,   setFormData]   = useState({
    name:'', lastName:'', email:'', phone:'', company:'', role:'', country:'',
    type:'', budget:'', urgency:'', source:'', msg:'', website:'', privacyAccepted:false,
  });

  useEffect(() => {
    formStartedRef.current = Date.now();
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
      const section = ctaRef.current;
      if (!wrapper || !section) return;
      const rect           = wrapper.getBoundingClientRect();
      const totalScrollable = wrapper.offsetHeight - section.offsetHeight;
      if (totalScrollable <= 0) return;

      const scrolled  = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, scrolled / totalScrollable);

      // Hold at 0° for first 40%, quick flip between 40–60%, hold at 180° last 40%
      const deg = rawProgress < 0.4
        ? 0
        : rawProgress > 0.6
          ? 180
          : ((rawProgress - 0.4) / 0.2) * 180;
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

  const openContact = () => {
    const top = (ctaWrapperRef.current?.offsetTop ?? 0)
      + (ctaWrapperRef.current?.offsetHeight ?? 0)
      - (ctaRef.current?.offsetHeight ?? window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const set = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }));

  const resetForm = () => {
    setFormSent(false);
    setStep(1);
    setCurrency('usd');
    setFormSending(false);
    setFormError('');
    formStartedRef.current = Date.now();
    setFormData({ name:'', lastName:'', email:'', phone:'', company:'', role:'', country:'', type:'', budget:'', urgency:'', source:'', msg:'', website:'', privacyAccepted:false });
  };

  const switchCurrency = (c) => {
    setCurrency(c);
    setFormData(p => ({ ...p, budget: '' }));
  };

  const submitContact = async (event) => {
    event.preventDefault();
    if (formSending) return;
    setFormSending(true);
    setFormError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name, lastName: formData.lastName, email: formData.email,
          phone: formData.phone, company: formData.company, role: formData.role,
          country: formData.country, projectType: formData.type, budgetRange: formData.budget,
          currency, urgency: formData.urgency, source: formData.source, message: formData.msg,
          website: formData.website, privacyAccepted: formData.privacyAccepted,
          startedAt: formStartedRef.current,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || 'No pudimos enviar el mensaje. Intenta nuevamente.');
      setFormSent(true);
    } catch (error) {
      setFormError(error.message || 'No pudimos enviar el mensaje. Intenta nuevamente.');
    } finally {
      setFormSending(false);
    }
  };

  return (
    <>
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
              className={`${styles.ctaCard} ${rotation >= 90 ? styles.ctaCardFlipped : ''}`}
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
                        onClick={openContact}
                        type="button"
                      >
                        Hablemos <Arrow />
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
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                      <form className={styles.ctaForm} onSubmit={submitContact}>
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
                        <div className={styles.honeypot} aria-hidden="true">
                          <label htmlFor="contact-website">Sitio web</label>
                          <input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={formData.website} onChange={set('website')} />
                        </div>
                        <label className={styles.privacyCheck}>
                          <input type="checkbox" required checked={formData.privacyAccepted} onChange={e => setFormData(p => ({ ...p, privacyAccepted: e.target.checked }))} />
                          <span>Acepto el tratamiento de mis datos para que APX responda esta solicitud. *</span>
                        </label>
                        {formError && <p className={styles.formError} role="alert">{formError}</p>}
                        <div className={styles.ctaFormNav}>
                          <button type="button" className={styles.ctaBtnBack} onClick={() => setStep(1)} disabled={formSending}>
                            ← Anterior
                          </button>
                          <button type="submit" className={styles.ctaBtnPrimary} disabled={formSending}>
                            {formSending ? 'Enviando…' : 'Enviar mensaje'} <Arrow />
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
              <span className={styles.ctaTrustDot} style={{ background: 'var(--accent)' }} />
              Respuesta en &lt; 24h
            </span>
            <span className={styles.ctaTrustSep} />
            <span className={styles.ctaTrustItem}>
              <span className={styles.ctaTrustDot} style={{ background: 'var(--accent)' }} />
              Sin compromiso inicial
            </span>
          </div>

        </div>
      </section>
      </div>{/* /ctaWrapper */}
    </>
  );
};

export default Stack;
