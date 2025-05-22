'use client';
import React, { JSX, Suspense } from 'react';
import styles from './imagecontent.module.css';
import Image, { ImageProps } from 'next/image';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import Container, { iContainerProps } from '../Container';
import { iButtonProps } from '@/components/Common/button';
import { FaCircle } from 'react-icons/fa';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useGlobalContext } from '@/context/TopNavContext';

export interface iImageContentProps extends iContainerProps {
  id?: string;
  overline?: string;
  title: string;
  subline?: string;
  content: string;
  actions?: iButtonProps[];
  centered?: boolean;
  image: ImageProps;
  reverse?: boolean;
  theme?: iTheme;
  extraContent?: JSX.Element;
  showContentAsList?: boolean;
}

export interface iContentProps {
  overline?: string;
  title: string;
  subline?: string;
  content: string;
  actions?: iButtonProps[];
  theme: iTheme;
  extraContent?: JSX.Element;
  showContentAsList?: boolean;
  animationClass?: string;
}

const Content: React.FC<iContentProps> = ({
  title,
  overline,
  subline,
  content,
  actions,
  theme,
  extraContent,
  showContentAsList = false,
  animationClass,
}) => {
  const { isMobile } = useGlobalContext();
  return (
    <div
      id={`contentImageContainer${title}`}
      className={styles.content + ` ${animationClass}`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LockUp
          size={iSize.Large}
          overline={overline}
          title={title}
          subtitle={subline}
          theme={theme}
        />
      </Suspense>

      {/* content */}
      {showContentAsList ? (
        <ul className={styles.list}>
          {content
            ?.split(/[\n.]+/)
            ?.filter((n) => n.trim() != '')
            .map((text) => (
              <li key={text}>
                <span>
                  <FaCircle />
                </span>
                {text.trim()}.
              </li>
            ))}
        </ul>
      ) : (
        content?.split('\\n')?.map((text) => <p key={text}>{text}</p>)
      )}

      {/* extra content */}
      {extraContent}

      <Actions
        fullWidth={isMobile}
        actions={actions?.map((action) => ({
          ...action,
          click: action.click ? () => action.click() : undefined, // Ensure proper wrapping
        }))}
      />
    </div>
  );
};

const ContentImage: React.FC<{ image: ImageProps }> = ({ image }) => {
  return (
    <div className={styles.image}>
      {image && (
        <Image src={image.src} alt={image.alt} width={200} height={200} />
      )}
    </div>
  );
};

const ImageContent: React.FC<iImageContentProps> = ({
  id,
  title,
  overline,
  subline,
  content,
  actions,
  image,
  centered = true,
  reverse = false,
  theme = iTheme.Light,
  extraContent,
  showContentAsList,
  fullWidth,
  padded,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const ctn = centered ? 'centered' : '';
  const tm = theme === iTheme.Light ? 'light' : 'dark';

  return (
    <Container padded={padded} fullWidth={fullWidth} theme={theme}>
      <section
        id={id}
        ref={elementRef}
        className={`${styles.imageContent} ${styles[ctn]} ${styles[tm]} `}
      >
        {reverse ? (
          <>
            <ContentImage image={image} />
            <Content
              title={title}
              overline={overline}
              subline={subline}
              content={content}
              actions={actions}
              theme={theme === iTheme.Light ? iTheme.Dark : iTheme.Light}
              extraContent={extraContent}
              showContentAsList={showContentAsList}
              animationClass={isVisible ? 'slideInRight' : ''}
            />
          </>
        ) : (
          <>
            <Content
              title={title}
              overline={overline}
              subline={subline}
              content={content}
              actions={actions}
              theme={theme === iTheme.Light ? iTheme.Dark : iTheme.Light}
              extraContent={extraContent}
              showContentAsList={showContentAsList}
              animationClass={isVisible ? 'slideInLeft' : ''}
            />
            <ContentImage image={image} />
          </>
        )}
      </section>
    </Container>
  );
};

export default ImageContent;
