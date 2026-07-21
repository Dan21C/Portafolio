import { BrandActivationCatalogSection } from '../sections/Services';
import servicesStyles from '../sections/Services.module.css';

const ActivarMarcaPage = ({ theme = 'dark' }) => (
  <div className={`${servicesStyles.section} ${servicesStyles[theme]}`}>
    <BrandActivationCatalogSection />
  </div>
);

export default ActivarMarcaPage;
