import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const DEV_JWT_SECRET = "change-me";

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_JWT_SECRET)) {
  throw new Error(
    "JWT_SECRET tiene que estar definido con un valor propio para correr en produccion."
  );
}

export const env = {
  isProduction,
  port: Number(process.env.PORT || 4000),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rolling-code-ecommerce",
  clientUrl: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  jwtSecret: process.env.JWT_SECRET || DEV_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "rolling_code_session",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "no-reply@example.com",
  contactEmail: process.env.CONTACT_EMAIL || "store@example.com"
};

