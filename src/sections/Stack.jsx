import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Play } from 'lucide-react';
import styles from './Stack.module.css';
import '../styles/motion.css';
import useInView from './landing/useInView';

const rv = (type = 'up', i = 0) => ({ 'data-rv': type, style: { '--i': i } });

const emptyForm = {
  name: '', lastName: '', email: '', phone: '', company: '', role: '', country: '',
  type: '', budget: '', urgency: '', source: '', msg: '', website: '', privacyAccepted: false,
};

const Field = ({ label, children, wide }) => (
  <label className={`${styles.field} ${wide ? styles.wide : ''}`} data-rv="up">
    <span className={styles.fieldLabel}>{label}</span>
    {children}
  </label>
);

const Select = ({ value, onChange, placeholder = 'Selecciona', required, children }) => (
  <span className={styles.selectWrap}>
    <select className={`${styles.input} ${value ? '' : styles.placeholder}`} value={value} onChange={onChange} required={required}>
      <option value="">{placeholder}</option>
      {children}
    </select>
    <ChevronDown size={16} aria-hidden="true" />
  </span>
);

const Stack = () => {
  const formStartedRef = useRef(0);
  const formRef = useRef(null);
  const [sectionRef, inView] = useInView(0.15);

  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('usd');
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    formStartedRef.current = Date.now();
  }, []);

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const resetForm = () => {
    setFormSent(false);
    setStep(1);
    setCurrency('usd');
    setFormSending(false);
    setFormError('');
    formStartedRef.current = Date.now();
    setFormData(emptyForm);
  };

  const switchCurrency = (c) => {
    setCurrency(c);
    setFormData((p) => ({ ...p, budget: '' }));
  };

  const focusForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
    <section ref={sectionRef} data-in={inView} id="contacto" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow} {...rv('up', 0)}>CONVIERTE TU IDEA EN REALIDAD</p>
        <h2 id="contact-title" {...rv('up', 1)}>¿Tienes una idea?<br />Hagámosla real.</h2>
        <p className={styles.lead} {...rv('up', 2)}>Cuéntanos tu proyecto y conversemos sobre<br />cómo podemos hacerlo realidad.</p>
        <div className={styles.actions} {...rv('up', 3)}>
          <button type="button" className={styles.btnWhite} onClick={focusForm}>Hablemos <ArrowRight size={18} /></button>
          <a href="/productos" className={styles.btnGhost}><Play size={18} /> Descubre nuestro trabajo</a>
        </div>
      </div>

      <div ref={formRef} className={styles.panel} {...rv('left', 2)}>
        <p className={styles.formEyebrow}>FORMULARIO DE CONTACTO</p>
        <div className={styles.head}>
          <h3>{formSent ? '¡Mensaje enviado!' : step === 1 ? 'Tu información' : 'Tu proyecto'}</h3>
          {!formSent && (
            <ol className={styles.stepper} aria-label={`Paso ${step} de 2`}>
              <li className={styles.on}>1</li>
              <li className={`${styles.line} ${step >= 2 ? styles.on : ''}`} aria-hidden="true" />
              <li className={step >= 2 ? styles.on : ''}>2</li>
            </ol>
          )}
        </div>

        {formSent ? (
          <div className={styles.success}>
            <p>Te respondemos en menos de 24 horas hábiles.</p>
            <button type="button" className={styles.btnGhost} onClick={resetForm}>Enviar otro mensaje</button>
          </div>
        ) : step === 1 ? (
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className={styles.grid}>
              <Field label="NOMBRE *"><input className={styles.input} type="text" placeholder="Tu nombre" required value={formData.name} onChange={set('name')} /></Field>
              <Field label="APELLIDO"><input className={styles.input} type="text" placeholder="Tu apellido" value={formData.lastName} onChange={set('lastName')} /></Field>
              <Field label="EMAIL *"><input className={styles.input} type="email" placeholder="tu@email.com" required value={formData.email} onChange={set('email')} /></Field>
              <Field label="TELÉFONO"><input className={styles.input} type="tel" placeholder="+57 300 000 0000" value={formData.phone} onChange={set('phone')} /></Field>
              <Field label="EMPRESA"><input className={styles.input} type="text" placeholder="Nombre de tu empresa" value={formData.company} onChange={set('company')} /></Field>
              <Field label="CARGO">
                <Select value={formData.role} onChange={set('role')}>
                  <option value="ceo">CEO / Fundador</option>
                  <option value="cto">CTO / Dir. Técnico</option>
                  <option value="director">Director / Gerente</option>
                  <option value="coord">Coordinador / Jefe</option>
                  <option value="consultor">Freelancer / Consultor</option>
                  <option value="otro">Otro</option>
                </Select>
              </Field>
              <Field label="PAÍS" wide>
                <Select value={formData.country} onChange={set('country')} placeholder="Selecciona tu país">
                  <option value="co">Colombia</option>
                  <option value="mx">México</option>
                  <option value="ar">Argentina</option>
                  <option value="cl">Chile</option>
                  <option value="pe">Perú</option>
                  <option value="ec">Ecuador</option>
                  <option value="us">Estados Unidos</option>
                  <option value="es">España</option>
                  <option value="otro">Otro</option>
                </Select>
              </Field>
            </div>
            <div className={styles.nav}>
              <button type="submit" className={`${styles.btnWhite} ${styles.full}`}>Continuar <ArrowRight size={18} /></button>
            </div>
          </form>
        ) : (
          <form className={styles.form} onSubmit={submitContact}>
            <div className={styles.grid}>
              <Field label="TIPO DE PROYECTO *">
                <Select value={formData.type} onChange={set('type')} required>
                  <option value="web">Desarrollo Web / App</option>
                  <option value="ia">IA & Automatización</option>
                  <option value="data">Datos & Analytics</option>
                  <option value="exp">Experiencia Digital</option>
                  <option value="integracion">Integración de Sistemas</option>
                  <option value="otro">Otro</option>
                </Select>
              </Field>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>PRESUPUESTO APROX.</span>
                <div className={styles.budget}>
                  <Select value={formData.budget} onChange={set('budget')} placeholder="Selecciona rango">
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
                  </Select>
                  <div className={styles.currency}>
                    <button type="button" className={currency === 'usd' ? styles.currencyOn : ''} onClick={() => switchCurrency('usd')}>USD</button>
                    <button type="button" className={currency === 'cop' ? styles.currencyOn : ''} onClick={() => switchCurrency('cop')}>COP</button>
                  </div>
                </div>
              </div>
              <Field label="URGENCIA">
                <Select value={formData.urgency} onChange={set('urgency')}>
                  <option value="now">Lo antes posible</option>
                  <option value="1-3m">1 – 3 meses</option>
                  <option value="3-6m">3 – 6 meses</option>
                  <option value="gt6m">Más de 6 meses</option>
                </Select>
              </Field>
              <Field label="¿CÓMO NOS ENCONTRASTE?">
                <Select value={formData.source} onChange={set('source')}>
                  <option value="google">Google / Búsqueda web</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram / Redes sociales</option>
                  <option value="referido">Referido</option>
                  <option value="evento">Evento / Conferencia</option>
                  <option value="otro">Otro</option>
                </Select>
              </Field>
              <Field label="CUÉNTANOS TU RETO *" wide>
                <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Describe brevemente tu proyecto o necesidad..." rows={3} required value={formData.msg} onChange={set('msg')} />
              </Field>
            </div>
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-website">Sitio web</label>
              <input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={formData.website} onChange={set('website')} />
            </div>
            <label className={styles.consent}>
              <input type="checkbox" required checked={formData.privacyAccepted} onChange={(e) => setFormData((p) => ({ ...p, privacyAccepted: e.target.checked }))} />
              <span>Acepto el tratamiento de mis datos para que APX responda esta solicitud. *</span>
            </label>
            {formError && <p className={styles.formError} role="alert">{formError}</p>}
            <div className={styles.nav}>
              <button type="button" className={styles.btnGhost} onClick={() => setStep(1)} disabled={formSending}><ArrowLeft size={18} /> Anterior</button>
              <button type="submit" className={styles.btnWhite} disabled={formSending}>{formSending ? 'Enviando…' : 'Continuar'} <ArrowRight size={18} /></button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Stack;
