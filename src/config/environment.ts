interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };

  app: {
    name: string;
    version: string;
  };

  features: {
    infiniteScroll: boolean;
    lazyLoading: boolean;
    errorBoundary: boolean;
  };

  development: {
    debugLogging: boolean;
    apiLogging: boolean;
  };

  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };

  pagination: {
    postsPerPage: number;
    commentsPerPage: number;
  };

  ui: {
    defaultTheme: string;
    enableDarkMode: boolean;
  };
}

const getEnvVar = (key: string, fallback: string = ""): string => {
  return import.meta.env[key] || fallback;
};

const getBoolEnvVar = (key: string, fallback: boolean = false): boolean => {
  const value = getEnvVar(key);
  return value === "true" || value === "1" || fallback;
};

const getNumberEnvVar = (key: string, fallback: number = 0): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const env: EnvironmentConfig = {
  api: {
    baseUrl: getEnvVar("VITE_API_BASE_URL"),
    timeout: getNumberEnvVar("VITE_API_TIMEOUT", 10000),
  },

  app: {
    name: getEnvVar("VITE_APP_NAME", "React App"),
    version: getEnvVar("VITE_APP_VERSION", "1.0.0"),
  },

  features: {
    infiniteScroll: getBoolEnvVar("VITE_ENABLE_INFINITE_SCROLL", false),
    lazyLoading: getBoolEnvVar("VITE_ENABLE_LAZY_LOADING", false),
    errorBoundary: getBoolEnvVar("VITE_ENABLE_ERROR_BOUNDARY", false),
  },

  development: {
    debugLogging: getBoolEnvVar("VITE_ENABLE_DEBUG_LOGGING", false),
    apiLogging: getBoolEnvVar("VITE_ENABLE_API_LOGGING", false),
  },

  auth: {
    tokenKey: getEnvVar("VITE_AUTH_TOKEN_KEY", "authToken"),
    refreshTokenKey: getEnvVar("VITE_AUTH_REFRESH_TOKEN_KEY", "refreshToken"),
  },

  pagination: {
    postsPerPage: getNumberEnvVar("VITE_POSTS_PER_PAGE", 10),
    commentsPerPage: getNumberEnvVar("VITE_COMMENTS_PER_PAGE", 5),
  },

  ui: {
    defaultTheme: getEnvVar("VITE_DEFAULT_THEME", "light"),
    enableDarkMode: getBoolEnvVar("VITE_ENABLE_DARK_MODE", false),
  },
};

export const validateEnvironment = (): void => {
  const requiredVars = ["VITE_API_BASE_URL"];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
  }
};

export const logEnvironmentConfig = (): void => {
  if (env.development.debugLogging) {
    console.log("🌍 Environment Configuration:", {
      api: env.api,
      app: env.app,
      features: env.features,
      development: env.development,
      pagination: env.pagination,
      ui: env.ui,
    });
  }
};

validateEnvironment();

if (import.meta.env.DEV) {
  logEnvironmentConfig();
}

export default env;
