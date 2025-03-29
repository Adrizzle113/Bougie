//components/itineraries/itinerarytemplate/welcomepage/WelcomeSection.tsx
import { ChevronDown } from 'lucide-react';
import styles from './WelcomeSection.module.css';


export interface OverviewProps {
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
}

const Overview: React.FC<OverviewProps> = ({
  title,
  subtitle,
  startDate,
  endDate,
}) => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('travel-brief');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderDates = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (startDate) {
      return formatDate(startDate);
    }
    return "2025";
  };

  return (
    <section className={styles.welcomeSection}>
      <div className={styles.content}>
        <h3 className={styles.prepared}>prepared for</h3>
        <h1 className={styles.title}>
          {title}
        </h1>

        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}

        <p className={styles.date}>
          {renderDates()}
        </p>
      </div>

      <button 
        onClick={scrollToNext} 
        className={styles.scrollButton}
        aria-label="Scroll to next section"
      >
        <ChevronDown className={styles.scrollIcon} />
      </button>
    </section>
  );
};

export default Overview;