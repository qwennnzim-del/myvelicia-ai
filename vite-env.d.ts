
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      POLLINATIONS_API_KEY?: string; // Optional Pollinations Secret
      [key: string]: string | undefined;
    }
  }
}
