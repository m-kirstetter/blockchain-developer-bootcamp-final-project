// import { MetaMaskInpageProvider } from '@metamask/providers';

interface Window {
  store: any;
  __NUXT__: any;
  $workbox: any;
  // ethereum: MetaMaskInpageProvider;
}

declare module 'marked' {
  const marked: any;
  export = marked;
}

declare module 'form-data';
