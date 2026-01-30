/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY: string;
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
