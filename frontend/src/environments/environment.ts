interface WindowEnv {
  API_BASE_URL?: string;
  SOCKET_URL?: string;
  GOOGLE_MAPS_API_KEY?: string;
  YOCO_PUBLIC_KEY?: string;
  PRODUCTION?: string;
}

declare global {
  interface Window {
    __env?: WindowEnv;
  }
}

const runtimeEnv = window.__env || {};
const productionFlag = (runtimeEnv.PRODUCTION || '').toLowerCase() === 'true';

export const environment = {
  production: productionFlag,
  apiBaseUrl: runtimeEnv.API_BASE_URL || 'http://localhost:5000/api',
  socketUrl: runtimeEnv.SOCKET_URL || 'http://localhost:5000',
  googleMapsApiKey: runtimeEnv.GOOGLE_MAPS_API_KEY || '',
  yocoPublicKey: runtimeEnv.YOCO_PUBLIC_KEY || ''
};
