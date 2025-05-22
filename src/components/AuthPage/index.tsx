'use client';
import React from 'react';
import styles from './auth.module.css';
import Container from '../Container';
import LoginForm from './components/LoginForm';
import Banner from '../Banner';
import { iButtonType } from '@/components/Common/button';
import { iSize, iVariant } from '@/lib/types';
import { FaQuestionCircle } from 'react-icons/fa';
import { useEventsContext } from '@/context/EventsContext';
import EventHighlight from '../TopBanner/components/EventHighlight';

export interface iAuthPageProps {
  formType: 'login' | 'signup';
}

const AuthPage: React.FC<iAuthPageProps> = ({ formType }) => {
  const { events } = useEventsContext();
  return (
    <>
      <Container>
        <div className={styles.AuthPage}>
          <div className={styles.authForm}>
            <LoginForm formType={formType} />
          </div>
          <div className={styles.reviews}>
            {/* <CustomerTestimonials
              theme={iTheme.Dark}
              title="Customer Testimonials"
              subtitle="Hear from our satisfied customers about their experiences."
              reviews={[
                {
                  content:
                    'I had a great experience with Only Friends. The platform is easy to use and the customer service is excellent.',
                  author: {
                    name: 'John Doe',
                    position: 'CEO, Event Co.',
                    verified: true,
                    source: <FcGoogle />,
                  },
                },
              ]}
            /> */}
            {events && <EventHighlight event={events[0]} mode="single" />}
          </div>
        </div>
      </Container>

      <Banner
        title={'Report Ticket System Issues'}
        content={'Encountered a problem? Let us know!'}
        size={iSize.Medium}
        image={{
          src: '/2b4e75d0-a0ad-406f-bf0b-912565d7a155 (1).jpg',
          alt: 'Report Issue Banner Background',
        }}
        actions={[
          {
            label: 'Report Issue',
            type: iButtonType.Link,
            url: {
              link: '/contact',
            },
          },
          {
            label: 'Check similar Issues',
            variant: iVariant.Secondary,
            iconEnd: <FaQuestionCircle />,
            type: iButtonType.Link,
            url: {
              link: '/faqs',
            },
          },
        ]}
      />
    </>
  );
};

export default AuthPage;
