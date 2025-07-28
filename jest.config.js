/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  /* map any TS path-aliases you use */
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  /* auto-setup */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

   globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/jest.tsconfig.json',
    },
  },

   transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/jest.tsconfig.json',
      },
    ],
  },

  /* nice coverage output */
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
};
