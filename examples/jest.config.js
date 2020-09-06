module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  setupFilesAfterEnv: [
    './config/jest.setup.ts',
    './config/jest-custom-reporter.ts',
    // 'jest-allure2-adapter/dist/setup-default',
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  reporters: ['jest-allure2-adapter', { resultsDir: 'sdsddd' }],
};
