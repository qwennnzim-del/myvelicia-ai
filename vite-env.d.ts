// Manual declaration for process.env to satisfy TypeScript when vite/client is missing or process is not globally defined
declare const process: {
  env: {
    readonly API_KEY: string;
    [key: string]: string | undefined;
  }
};
