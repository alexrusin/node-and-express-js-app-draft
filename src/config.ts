const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000"),
  debug: process.env.APP_DEBUG === "true",
  logLevel: process.env.LOG_LEVEL || "info",
  appSecret: process.env.APP_SECRET || "",
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || "5"),
  issuerBaseUrl: process.env.ISSUER_BASE_URL || "",
  audience: process.env.AUDIENCE || "",
};

export default config;
