import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

export default {
  tests: 'tests/**/*.e2e.ts',
  targets: [{
    name: 'mobile-web',
    engine: web({ viewport: { width: 390, height: 844 }, ...(process.env.E2E_CDP_ENDPOINT ? { connect: { cdpEndpoint: async () => process.env.E2E_CDP_ENDPOINT! } } : {}) }),
    app: { url: 'http://127.0.0.1:4173', command: { executable: 'python3', args: ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], log: '.e2e/logs/app.log' } }
  }],
  workers: 1,
  timeout: 30000,
  assertionTimeout: 8000,
  retries: 0,
  cache: 'off',
  reporters: ['list', 'junit', 'markdown']
} satisfies E2EConfig;
