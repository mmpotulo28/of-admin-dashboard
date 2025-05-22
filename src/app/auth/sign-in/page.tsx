import React from 'react';
import AuthPage from '@/components/AuthPage';
import styles from './login.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <AuthPage formType={'login'} />
    </div>
  );
};

export default LoginPage;
