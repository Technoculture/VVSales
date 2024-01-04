import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: "libsql://vvsales-technoculture.turso.io",
    authToken:
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTAzVDEzOjE5OjE1LjIyNzg3NzQxM1oiLCJpZCI6IjliMWQ2Nzc2LWFhM2EtMTFlZS05ZmNiLWFlNGU2YWZmOTIzNiJ9.TqcS8k6EZaylw7FTA0Dt6FFyhsci-jbBwqPQrsK_3Qk3MqMO2KGofDHTFglXfIewQPnXH_K42gAkng7LeRAHAg",
  },
} satisfies Config;
