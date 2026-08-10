import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './Products.module.css';
import { products, productBackground, parallaxOffsets } from './products.data';

const AREA_BY_ID = {
  'holo-frame': 'pulse',
  'data-intelligence': 'nexo',
  'software-studio': 'bloom',
  'reflex-matrix': 'trace',
  'vector-maze': 'orbit',
  'touch-duel': 'kiosk',
  'imagine-ai': 'drift',
  'levitate': 'signal',
};

const LAYOUT_CLASS = {
  'hero-left': 'layoutHero',
  'hero-right': 'layoutHero',
  medium: 'layoutMedium',
  small: 'layoutSmall',
};

/* Decorative, near-invisible trajectories — clustered top-right / bottom-left,
   center kept clear so it never competes with the products. */
const LINE_PATHS = [
  { d: 'M 980 0 C 1120 90 1080 200 1300 240 S 1520 180 1620 260', dur: 26, o: 0.07, w: 0.7 },
  { d: 'M 1060 40 C 1180 140 1140 40 1360 120 S 1560 260 1640 180', dur: 31, o: 0.05, w: 0.6, blur: true },
  { d: 'M 900 -20 C 1040 60 1220 20 1300 140 S 1480 60 1660 40', dur: 22, o: 0.06, w: 0.6 },
  { d: 'M 1140 -10 C 1200 120 1360 80 1400 220 S 1600 140 1700 260', dur: 34, o: 0.09, w: 0.7 },
  { d: 'M 980 160 C 1160 100 1240 260 1420 200 S 1560 60 1700 120', dur: 28, o: 0.05, w: 0.6, blur: true },
  { d: 'M -60 620 C 80 700 40 780 220 820 S 380 900 480 840', dur: 30, o: 0.07, w: 0.7 },
  { d: 'M -80 720 C 60 660 40 840 260 800 S 420 940 520 880', dur: 24, o: 0.05, w: 0.6, blur: true },
  { d: 'M -40 540 C 120 620 160 700 320 660 S 460 780 560 760', dur: 33, o: 0.06, w: 0.6 },
  { d: 'M -60 860 C 100 800 180 900 340 880 S 480 780 600 840', dur: 27, o: 0.09, w: 0.7 },
  { d: 'M -20 480 C 100 560 220 520 300 620 S 440 640 540 700', dur: 20, o: 0.05, w: 0.6, blur: true },
];

const ProductBackground = () => {
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    const update = () => setAllowVideo(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const showVideo = allowVideo && !videoFailed;

  return (
    <div className={styles.background} aria-hidden="true">
      {!posterFailed && (
        <img
          className={styles.backgroundMedia}
          src={productBackground.poster}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setPosterFailed(true)}
        />
      )}
      {showVideo && (
        <video
          className={styles.backgroundMedia}
          src={productBackground.video}
          poster={productBackground.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
        />
      )}
      <svg className={styles.lines} viewBox="0 0 1440 950" preserveAspectRatio="none">
        {LINE_PATHS.map((path, index) => (
          <path
            key={index}
            d={path.d}
            style={{
              stroke: `rgba(255,255,255,${path.o})`,
              strokeWidth: path.w,
              filter: path.blur ? 'blur(1.2px)' : 'none',
              animationDuration: `${path.dur}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const ProductCard = ({ product, eager, cardRef }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const layoutClass = styles[LAYOUT_CLASS[product.layout] || 'layoutSmall'];

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${layoutClass}`}
      style={{ gridArea: AREA_BY_ID[product.id] }}
    >
      <div className={styles.cardMedia}>
        {!imgFailed ? (
          <img
            src={product.image}
            alt={`APX ${product.name}`}
            style={{ transformOrigin: product.objectPosition }}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={styles.cardPlaceholder} aria-hidden="true">
            <span>APX</span>
          </div>
        )}
      </div>
      <div className={styles.cardText}>
        <span className={styles.cardEyebrow}>APX</span>
        <strong className={styles.cardName}>{product.name.toUpperCase()}</strong>
        <p className={styles.cardDescription}>{product.description}</p>
      </div>
    </article>
  );
};

const ProductsHeader = () => (
  <div className={styles.header}>
    <span className={styles.label}>
      <i /> PRODUCTOS APX <i />
    </span>
    <h2 className={styles.title}>
      Soluciones listas<br />para activar.
    </h2>
    <p className={styles.description}>
      Tecnología modular y experiencias diseñadas para transformar cada punto de contacto.
    </p>
    <a href="/productos" className={styles.cta}>
      Ver productos <ArrowRight aria-hidden="true" />
    </a>
  </div>
);

const SideRune = ({ side }) => (
  <span className={`${styles.rune} ${side === 'right' ? styles.runeRight : styles.runeLeft}`} aria-hidden="true">
    <i />
    <b>A<br />P<br />X</b>
  </span>
);

const Products = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    let frame = null;

    const applyParallax = () => {
      frame = null;
      const el = sectionRef.current;
      if (!el) return;

      if (!desktopQuery.matches) {
        Object.values(cardRefs.current).forEach((node) => {
          if (node) node.style.setProperty('--py', '0px');
        });
        return;
      }

      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(-1, rect.top / (window.innerHeight || 1)));

      Object.entries(cardRefs.current).forEach(([id, node]) => {
        if (!node) return;
        const max = parallaxOffsets[id] || 0;
        node.style.setProperty('--py', `${(-progress * max).toFixed(2)}px`);
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(applyParallax);
    };

    applyParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const setCardRef = (id) => (node) => {
    cardRefs.current[id] = node;
  };

  return (
    <section
      id="productos"
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ''}`}
      aria-label="Productos APX"
    >
      <ProductBackground />
      <SideRune side="left" />
      <SideRune side="right" />

      <div className={styles.inner}>
        <div className={styles.headerMobile}>
          <ProductsHeader />
        </div>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              eager={index === 0}
              cardRef={setCardRef(product.id)}
            />
          ))}
          <div className={styles.centerSlot}>
            <ProductsHeader />
          </div>
        </div>

        <div className={styles.track} role="list" aria-label="Productos APX">
          {products.map((product) => (
            <div className={styles.trackItem} role="listitem" key={`m-${product.id}`}>
              <ProductCard product={product} eager={false} cardRef={null} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
