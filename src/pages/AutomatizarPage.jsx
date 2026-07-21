import { AutomationProductsSection } from '../sections/Services';
import servicesStyles from '../sections/Services.module.css';

const AutomatizarPage = ({ theme = 'dark' }) => (
  <div className={`${servicesStyles.section} ${servicesStyles[theme]}`}>
    <AutomationProductsSection />
  </div>
);

export default AutomatizarPage;
