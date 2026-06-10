import styles from './Ticker.module.css';

const items = [
  'Gamificación', 'Experiencias Interactivas', 'Inteligencia Artificial',
  'Análisis de Datos', 'Automatización', 'Desarrollo de Software',
  'Tótems Interactivos', 'Activaciones de Marca',
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
