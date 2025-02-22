import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: 'interchange.proxy.rlwy.net',
    port: 21036,
    user: 'root',
    password: 'HkaGOxhYpNWuxJhBBtpMXYcelspHYvCP',
    database: 'railway',
  },
} as Config;
