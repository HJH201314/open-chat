/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CLOUD_VOICE_APPID: string;
  readonly VITE_CLOUD_VOICE_SECRET_ID: string;
  readonly VITE_CLOUD_VOICE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}