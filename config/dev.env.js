"use strict";
const fs = require("fs");
const path = require("path");
const { merge } = require("webpack-merge");
const prodEnv = require("./prod.env");

// Load .env file if it exists
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.+)$/);
      if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// Create a new object without NODE_ENV from prodEnv to avoid conflicts
const { NODE_ENV, ...prodEnvWithoutNodeEnv } = prodEnv;
module.exports = merge(prodEnvWithoutNodeEnv, {
  NODE_ENV: '"development"',
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY || ""),
  FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN || ""),
  FIREBASE_DATABASE_URL: JSON.stringify(
    process.env.FIREBASE_DATABASE_URL || ""
  ),
  FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID || ""),
  FIREBASE_STORAGE_BUCKET: JSON.stringify(
    process.env.FIREBASE_STORAGE_BUCKET || ""
  ),
  FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(
    process.env.FIREBASE_MESSAGING_SENDER_ID || ""
  ),
});
