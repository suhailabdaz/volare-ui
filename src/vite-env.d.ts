/// <reference types="vite/client" />

import { RecaptchaVerifier } from 'firebase/auth';

// This ensures TypeScript understands the global variable
export {};

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier; // Using optional chaining in case it's not defined
  }
}
