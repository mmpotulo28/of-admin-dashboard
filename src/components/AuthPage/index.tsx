'use client';
import React from 'react';
import styles from './auth.module.css';
import Container from '../Container';
import LoginForm from './components/LoginForm';

export interface iAuthPageProps {
  formType: 'login' | 'signup';
}

const AuthPage: React.FC<iAuthPageProps> = ({ formType }) => {
  return (
    <>
      <Container>
        <div className={styles.AuthPage}>
          <div className={styles.authForm}>
            <LoginForm formType={formType} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default AuthPage;
