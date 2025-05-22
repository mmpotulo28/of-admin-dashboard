import 'server-only';

import { StackServerApp } from '@stackframe/stack';

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    handler: '/auth-ext',
    signIn: '/',
    signUp: '/auth/sign-up',
    afterSignIn: '/secure',
    afterSignUp: '/',
    home: '/secure',
    signOut: '/',
  },
});
