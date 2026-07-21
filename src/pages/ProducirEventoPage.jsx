import { EventProductionSection } from '../sections/Services';
import servicesStyles from '../sections/Services.module.css';

const ProducirEventoPage = ({ theme = 'dark' }) => (
  <div className={`${servicesStyles.section} ${servicesStyles[theme]}`}>
    <EventProductionSection />
  </div>
);

export default ProducirEventoPage;
