import React from 'react';
import styles from './stepIndicator.module.css';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className={styles.stepIndicator}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.step} ${
            index + 1 === currentStep
              ? styles.active
              : index + 1 < currentStep
              ? styles.completed
              : ''
          }`}
        >
          <div className={styles.circle}>{index + 1}</div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
