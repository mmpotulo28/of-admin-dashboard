import styles from './select.module.css';

interface SelectProps {
  label?: string;
  value: string | number;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  error?: string;
  options: { value: string | number; label: string; hide?: boolean }[];
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  handleSelectChange,
  name,
  id,
  className,
  error,
  options,
  disabled,
  required,
}) => {
  const selectId = id || name;
  const errorId = `${selectId}-error`;

  return (
    <div
      className={`${styles.selectContainer} ${className || ''}`}
      role="group"
      aria-labelledby={label ? `${selectId}-label` : undefined}
    >
      <select
        name={name}
        id={selectId}
        value={value}
        disabled={disabled}
        className={styles.select}
        onChange={handleSelectChange}
        aria-label={label ? undefined : 'Select'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        required={required}
      >
        {options?.map(
          (option) =>
            !option.hide && (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
        )}
      </select>
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
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

export default Select;
