module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  testMatch: [
    '<rootDir>/test/**/*-test.ts',
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100,
  //   },
  // },
};
