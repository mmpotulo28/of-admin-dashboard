import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import styles from './insights.module.css';

export interface iInsight {
  label: string;
  value: number | string;
}

export interface iInsightProps {
  insights: iInsight[];
}

/**
 * A functional component that displays a list of insights.
 * Each insight contains a label and a value, styled as cards.
 *
 * @param {iInsightProps} props - The props containing the insights array.
 * @returns {JSX.Element} The rendered insights component.
 */
const Insight: React.FC<iInsightProps> = ({ insights }) => {
  return (
    <div className={styles.insights}>
      {insights?.map((insight) => (
        <div key={insight.label} className={styles.insightCard}>
          <LockUp
            title={insight.label}
            size={iSize.Small}
            theme={iTheme.Dark}
          />
          <p>{insight.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Insight;
