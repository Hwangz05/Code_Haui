import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children, variant = 'orange', className = '' }) {
  const classList = [
    styles.badge,
    styles[variant] || styles.orange,
    className
  ].filter(Boolean).join(' ');

  return <span className={classList}>{children}</span>;
}
