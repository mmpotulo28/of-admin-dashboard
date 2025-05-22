import type { Metadata } from 'next';
import './globals.css';
import ScrollToTop from '@/components/Common/ScrollToTop';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import CookieConsent from '@/components/Common/CookieConsent/';
import Providers from '@/components/core/providers';
import { EventsProvider } from '@/context/EventsContext';
import { GlobalProvider } from '@/context/TopNavContext';
import { stackServerApp } from '@/stack';
import { StackProvider, StackTheme } from '@stackframe/stack';

const customTheme = {
  light: {
    background: '#ffffff',
    foreground: '#00263f',
    card: '#ffffff',
    cardForeground: '#00263f',
    popover: '#ffffff',
    popoverForeground: '#00263f',
    primary: '#41b3ff',
    primaryForeground: '#ffffff',
    secondary: '#82afce',
    secondaryForeground: '#ffffff',
    muted: '#82afce',
    mutedForeground: '#0f0f10',
    accent: '#00263f',
    accentForeground: '#ffffff',
    destructive: '#00263f',
    destructiveForeground: '#ffffff',
    border: '#82afce',
    input: '#82afce',
    ring: '#41b3ff',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyfriendsent.com'),
  title: 'OnlyFriends Entertainment Ticket System - Buy Event Tickets Online',
  description:
    'Discover and buy tickets for the best events near you with OnlyFriends Entertainment Ticket System. Your trusted platform for seamless event ticketing.',
  category: 'Entertainment',
  icons: {
    icon: '/image/logo-long.jpg',
    shortcut: '/image/logo-long.jpg',
    apple: '/image/logo-long.jpg',
  },
  keywords: [
    'events',
    'tickets',
    'OnlyFriends',
    'buy tickets',
    'event platform',
  ],
  authors: [
    {
      name: 'OnlyFriends Entertainment Team',
      url: 'https://onlyfriendsent.com',
    },
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'OnlyFriends Entertainment Ticket System',
    description: 'Your go-to platform for event tickets.',
    url: 'https://onlyfriendsent.com',
    type: 'website',
    images: [
      {
        url: '/image/logo-long.jpg',
        width: 800,
        height: 600,
        alt: 'OnlyFriends Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnlyFriends Entertainment Ticket System',
    description: 'Your go-to platform for event tickets.',
    site: '@onlyfriends',
    creator: '@onlyfriends',
    images: ['/image/logo-long.jpg'],
  },
  applicationName: 'OnlyFriends Entertainment Ticket System System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="//code.tidio.co/bjwb65qwhm4noqkteuk33imyiqxskiwf.js"
          strategy="lazyOnload"
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HC6REXGK8B"
        ></Script>
        <Script id="google-analytics">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(...args) { window.dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', 'G-HC6REXGK8B');
  `}
        </Script>

        <Script id="trustpilot-script">
          {`(function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
            a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];
            f.parentNode.insertBefore(a,f)})(window,document,'script', 'https://invitejs.trustpilot.com/tp.min.js', 'tp');
            tp('register', 'zAXEhGcFXaJrfAer');`}
        </Script>

        <Script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        ></Script>

        <Script id="segment-snippet">
          {`
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="OSJrkV1OsDgUovAGNwgb5OKmoEXDyUEP";;analytics.SNIPPET_VERSION="5.2.0";
            analytics.load("OSJrkV1OsDgUovAGNwgb5OKmoEXDyUEP");
            analytics.page();
            }}();
          `}
        </Script>
      </head>
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme theme={customTheme}>
            <GlobalProvider>
              <EventsProvider>
                <Providers>
                  <main className="full-height">
                    {children}
                    <ScrollToTop />
                    <Toaster />
                  </main>

                  <CookieConsent />
                  <Analytics />
                </Providers>
              </EventsProvider>
            </GlobalProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
