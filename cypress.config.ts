import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Point at your Vite dev server:
    baseUrl: 'http://localhost:5173',

    supportFile: 'cypress/support/index.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',

    // Expose your API base so tests can do cy.request(Cypress.env('API_BASE') + '/clients')
    env: {
      API_BASE: 'http://localhost:4000/api',
    },

    setupNodeEvents(on, config) {
      // you could hook into tasks or other events here if you need to
      return config;
    },
  },
});
