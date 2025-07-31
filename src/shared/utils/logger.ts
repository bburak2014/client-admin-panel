import { env } from "@/config/environment";

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (env.development.debugLogging) {
      console.log(message, ...args);
    }
  },

  api: (message: string, ...args: unknown[]) => {
    if (env.development.apiLogging) {
      console.log(message, ...args);
    }
  },

  error: (message: string, error?: unknown) => {
    console.error(message, error);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(message, ...args);
  },
};
