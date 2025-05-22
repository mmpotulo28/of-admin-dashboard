import Actions from '@/components/Common/Actions';
import styles from './dashboard.module.css';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';
import { iButtonProps } from '@/components/Common/button';
import { FaCaretRight } from 'react-icons/fa6';

export enum iGridColSpan {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}

interface DashCardProps {
  title: string;
  children: React.ReactNode;
  button?: iButtonProps;
  colSpan?: iGridColSpan;
}

const DashCard: React.FC<DashCardProps> = ({
  title,
  children,
  button,
  colSpan,
}) => {
  return (
    <div
      className={
        styles.dashCard + ' ' + (colSpan ? styles[`colSpan${colSpan}`] : '')
      }
    >
      <div>
        <div className={styles.header}>
          <LockUp
            centered
            title={title}
            theme={iTheme.Dark}
            size={iSize.Small}
          />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
      {button && (
        <Actions
          fullWidth
          actions={[
            {
              ...button,
              variant: iVariant.Secondary,
              size: iSize.Small,
              iconEnd: <FaCaretRight />,
            },
          ]}
        />
      )}
    </div>
  );
};

export default DashCard;
