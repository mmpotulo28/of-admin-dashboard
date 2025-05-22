import React, { JSX } from 'react';
import styles from './actions.module.css';
import Button, { iButtonProps } from '@/components/Common/button';

export interface iActionProps {
  actions?: iButtonProps[];
  fullWidth?: boolean;
  className?: string;
}

/**
 * The `Actions` component renders a list of action buttons.
 *
 * @param {iActionProps} props - The properties for the Actions component.
 * @param {Array} props.actions - An array of action objects to be rendered as buttons.
 * @param {boolean} [props.fullWidth=false] - A flag to determine if the buttons should take the full width of the container.
 *
 * @returns {JSX.Element} A div containing a list of buttons.
 */
const Actions: React.FC<iActionProps> = ({
  actions,
  fullWidth = false,
  className = '',
}: iActionProps): JSX.Element => {
  return (
    <div
      className={`${className} ${styles.actions} ${
        fullWidth ? styles.fullWidth : ''
      }`}
    >
      {actions?.map((action) =>
        action.hide ? null : (
          <Button
            key={`${action.key}-${action.label}`}
            {...action}
            label={action.label}
            click={action.click ? () => action.click() : undefined}
          />
        )
      )}
    </div>
  );
};

export default Actions;
