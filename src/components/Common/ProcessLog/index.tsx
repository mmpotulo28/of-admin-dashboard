import React, { useState } from 'react';
import styles from './ProcessLog.module.css';
import { FiCopy } from 'react-icons/fi';
import Actions from '@/components/Common/Actions';
import { FaChevronDown, FaChevronUp, FaRegCheckCircle } from 'react-icons/fa';
import { iButtonType } from '../button';
import { iSize, iVariant } from '@/lib/types';

interface ProcessLogProps {
  logs: string[];
  title?: string;
}

const ProcessLog: React.FC<ProcessLogProps> = ({
  logs = ['No Logs Yet...'],
  title = 'Process Log',
}) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!logs || logs.length === 0) {
    logs = [':: No Logs Yet...'];
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setCopySuccess('Failed to copy!');
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.logContainer}>
      <div className={styles.logHeader}>
        <h3 className={styles.logTitle}>{title}</h3>
        <div className={styles.headerActions}>
          {copySuccess && (
            <div className={styles.copyMessage}>{copySuccess}</div>
          )}
          <Actions
            actions={[
              {
                key: 'copy',
                iconEnd: copySuccess ? <FaRegCheckCircle /> : <FiCopy />,
                click: handleCopyClick,
                variant: iVariant.Tertiary,
                type: iButtonType.Icon,
                size: iSize.Small,
              },
              {
                key: 'collapse',
                iconEnd: isCollapsed ? <FaChevronDown /> : <FaChevronUp />,
                click: handleToggleCollapse,
                variant: iVariant.Tertiary,
                type: iButtonType.Icon,
                size: iSize.Small,
              },
            ]}
          />
        </div>
      </div>
      {!isCollapsed && (
        <div className={styles.log}>
          {logs.map((log, index) => (
            <div key={index} className={styles.logEntry}>
              :: {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessLog;
