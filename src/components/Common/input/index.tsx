import styles from './input.module.css';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string | number | string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  id?: string;
  className?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  showLabel?: boolean;
  checked?: boolean;
}

/**
 * A React functional component for rendering an input field with a label.
 * @param {string} label - The label for the input field.
 * @returns {React.Element} The rendered input component.
 */
const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  type = 'text',
  name,
  id,
  className,
  error,
  min,
  max,
  step,
  disabled,
  required,
  multiple,
  showLabel = false,
  checked,
}) => {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div
      className={`${styles[type]} ${styles.inputContainer} ${className || ''} ${
        showLabel ? styles.showLabel : ''
      }`}
      role="group"
      aria-labelledby={label ? `${inputId}-label` : undefined}
    >
      <input
        name={name}
        type={type}
        id={inputId || name}
        placeholder={showLabel ? placeholder : placeholder || label || ''}
        value={value}
        disabled={disabled}
        required={required}
        className={`${styles.input}`}
        onChange={onChange}
        onFocus={(e) => {
          e.target.classList.add(styles.focused);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          e.target.classList.remove(styles.focused);
          if (onBlur) onBlur(e);
        }}
        min={min}
        max={max}
        step={step}
        aria-label={label ? undefined : placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        multiple={multiple}
        checked={checked}
      />
      {label && (
        <label
          id={`${inputId}-label`}
          htmlFor={inputId || name}
          className={value ? styles.active : ''}
        >
          {label}
        </label>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
