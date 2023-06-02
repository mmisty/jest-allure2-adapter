module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/src/tests/**/(*.)+(spec|test).[t]s?(x)',
    '!**/dist/**/*.*',
    '!**/examples/**/*.*',
  ],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/tests/**/*.*',
  ],
};
