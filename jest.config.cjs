module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/__tests__/**/*.tsx",
    "**/?(*.)+(spec|test).ts",
    "**/?(*.)+(spec|test).tsx",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests/config/fileTransformer.cjs",
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(multiformats|uint8arrays|@dcl/single-sign-on-client|decentraland-connect|uuid|decentraland-dapps|decentraland-ui2|@mui|@babel|@emotion|flat)/)",
  ],
  setupFiles: ["<rootDir>/src/tests/beforeSetupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/afterSetupTest.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.spec.tsx",
    "!src/**/*.test.ts",
    "!src/**/*.test.tsx",
  ],
}
