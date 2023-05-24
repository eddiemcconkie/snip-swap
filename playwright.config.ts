import type { PlaywrightTestConfig } from '@playwright/test';
// import dotenv from 'dotenv'
// import path from 'path'

// dotenv.config({path:path.resolve(__dirname,'..','.env.test')})

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
  },

  testDir: 'tests',
};

export default config;
