import { iButtonProps } from '@/components/Common/button';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import styles from './contentCards.module.css';
import React, { ReactElement } from 'react';
import Container from '../Container';
import ContentCard from '@/components/ContentCards/components/ContentCard';

export interface iContentCardsProps {
  id?: string;
  overline?: string;
  title: string;
  subline?: string;
  buttonLabel: string;
  theme?: iTheme;
  cardData: {
    title: string;
    description: string;
    icon?: ReactElement;
    button?: iButtonProps;
  }[];
}

const ContentCards: React.FC<iContentCardsProps> = ({
  id,
  overline,
  title,
  subline,
  cardData,
  theme = iTheme.Dark,
}) => {
  return (
    <Container fullWidth padded theme={theme}>
      <div id={id} className={styles.contentCards + ' ' + styles[theme]}>
        <div className={styles.topContent}>
          <LockUp
            overline={overline}
            title={title}
            subtitle={subline}
            size={iSize.Large}
            theme={theme === iTheme.Dark ? iTheme.Light : iTheme.Dark}
          />
        </div>
        <div className={styles.cards}>
          {cardData?.map((card) => (
            <ContentCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              button={card.button}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ContentCards;
