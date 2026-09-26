import React from 'react';
import LoginForm from '../../components/features/Auth/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.overlay} />
      <div className={styles.formContainer}>
        <LoginForm />
      </div>
    </div>
  );
}
