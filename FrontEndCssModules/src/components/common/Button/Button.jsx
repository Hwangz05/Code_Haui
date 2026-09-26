import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'blue', 'secondary', 'outline', 'danger'
  size = 'md',        // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) {
  const classList = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classList}
      {...props}
    >
      {loading && <span className={styles.spinner}></span>}
      {children}
    </button>
  );
}
