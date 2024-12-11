/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DB_URL: string
  readonly VITE_DB_AUTH_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}