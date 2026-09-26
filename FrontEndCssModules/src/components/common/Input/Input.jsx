import React from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputBox}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
          className={[
            styles.input,
            icon ? styles.withIcon : '',
            error ? styles.inputError : '',
            className
          ].filter(Boolean).join(' ')}
          {...props}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
