module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
  ],
  testMatch: [
    "<rootDir>/test/**/*-test.ts",
  ],
};