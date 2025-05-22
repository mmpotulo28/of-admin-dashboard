import React, { FC, JSX } from 'react';
import styles from './button.module.css';
import Link from 'next/link';
import { iSize, iVariant } from '@/lib/types';
import { TbLoader3 } from 'react-icons/tb';

export enum iButtonType {
  Link = 'link',
  Button = 'button',
  Icon = 'icon',
  Submit = 'submit',
}

export enum iTarget {
  Blank = '_blank',
  Self = '_self',
  Parent = '_parent',
  Top = '_top',
  Empty = '',
}

export interface iButtonProps {
  hide?: boolean;
  variant?: iVariant;
  size?: iSize;
  iconEnd?: React.ReactNode;
  iconStart?: React.ReactNode;
  label?: string;
  className?: string;
  disabled?: boolean;
  centered?: boolean;
  isLoading?: boolean;
  key?: string | number;
  click?: any;
  type?: iButtonType;
  url?: {
    link: string;
    target?: iTarget;
  };
}

const Button: FC<iButtonProps> = ({
  variant = iVariant.Primary,
  size = iSize.Large,
  iconEnd,
  iconStart,
  label = 'Button',
  className = '',
  click = () => {},
  type = iButtonType.Button,
  disabled = false,
  centered = true,
  isLoading = false,
  url = {
    link: '#',
    target: iTarget.Blank,
  },
}) => {
  const commonClassNames = `${styles.button} ${styles[variant]} ${
    styles[size]
  } ${className} ${disabled ? styles.disabled : ''} ${
    centered ? styles.centered : ''
  }`;

  const renderButtonContent = (
    type: 'button' | 'submit' | 'reset' | undefined
  ): JSX.Element => {
    return (
      <button
        type={type}
        onClick={() => click()}
        className={commonClassNames}
        aria-label={label || 'Button'}
      >
        {iconStart && <span>{iconStart}</span>}
        {label && <span>{label}</span>}
        {isLoading ? (
          <span className={styles.loadingIcon}>
            <TbLoader3 />
          </span>
        ) : (
          iconEnd && <span>{iconEnd}</span>
        )}
      </button>
    );
  };

  switch (type) {
    case iButtonType.Link:
      return (
        <Link
          className={commonClassNames}
          href={url.link}
          target={url.target || iTarget.Empty}
        >
          {iconStart && <span>{iconStart}</span>}
          {label && <span>{label}</span>}
          {isLoading ? (
            <span className={styles.loadingIcon}>
              <TbLoader3 />
            </span>
          ) : (
            iconEnd && <span>{iconEnd}</span>
          )}
        </Link>
      );
    case iButtonType.Icon:
      return (
        <button
          type="button"
          aria-label={label || 'Button'}
          onClick={() => click()}
          className={`${commonClassNames} ${styles.iconButton}`}
        >
          {iconStart}
          {iconEnd}
        </button>
      );
    case iButtonType.Submit:
      return renderButtonContent('submit');
    default:
      return renderButtonContent('button');
  }
};

export default Button;
