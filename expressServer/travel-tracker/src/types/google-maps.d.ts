// Global type declarations for Google Maps API

declare global {
  interface Window {
    google: typeof google;
  }
}

// Make sure the google namespace is available
declare var google: any;

export {};
