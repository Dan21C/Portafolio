import styles from './Ticker.module.css';

const items = [
  'Un solo equipo, sin intermediarios', 'Soluciones a la medida de tu marca',
  'Resultados medibles desde el primer proyecto', 'Tecnología propia, no plantillas',
  'Acompañamiento de principio a fin', 'Experiencia en marcas de toda Latinoamérica',
  'Entregas rápidas, sin sacrificar calidad', 'Soporte real después del lanzamiento',
];

const Ticker = () => (
  <div className={styles.ticker}>
    <div className={styles.track}>
      {[...items, ...items].map((item, i) => (
        <span key={i} className={styles.item}>
          {item}
          <span className={styles.sep}>·</span>
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
