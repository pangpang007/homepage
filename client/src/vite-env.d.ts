/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PASSWORD_TRANSFER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
