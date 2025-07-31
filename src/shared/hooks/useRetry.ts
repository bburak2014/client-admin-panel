import { useState, useCallback } from "react";

interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  lastError?: Error;
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
};

export const useRetry = (config: Partial<RetryConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
  });

  const executeWithRetry = useCallback(
    async <T>(
      operation: () => Promise<T>,
      onSuccess?: (result: T) => void,
      onError?: (error: Error) => void,
    ): Promise<T | null> => {
      let lastError: Error;

      for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
        try {
          setRetryState({ isRetrying: false, attempt });
          const result = await operation();

          if (onSuccess) {
            onSuccess(result);
          }

          return result;
        } catch (error) {
          lastError = error as Error;
          setRetryState({
            isRetrying: true,
            attempt,
            lastError,
          });

          console.warn(`Attempt ${attempt} failed:`, error);

          if (attempt === finalConfig.maxAttempts) {
            console.error(`All ${finalConfig.maxAttempts} attempts failed`);
            if (onError) {
              onError(lastError);
            }
            return null;
          }

          const delay =
            finalConfig.delay *
            Math.pow(finalConfig.backoffMultiplier, attempt - 1);

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      return null;
    },
    [finalConfig],
  );

  const reset = useCallback(() => {
    setRetryState({ isRetrying: false, attempt: 0 });
  }, []);

  return {
    executeWithRetry,
    reset,
    isRetrying: retryState.isRetrying,
    attempt: retryState.attempt,
    lastError: retryState.lastError,
    maxAttempts: finalConfig.maxAttempts,
  };
};
