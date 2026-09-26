import React from 'react';
import styles from './Card.module.css';

export default function Card({ children, hover = true, className = '', ...props }) {
  const classList = [
    styles.card,
    hover ? styles.hoverable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classList} {...props}>
      {children}
    </div>
  );
}
