module.exports = {
  preset: "ts-jest",
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
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
          types: ["@types/jest", "@types/node", "@testing-library/jest-dom"],
        },
        isolatedModules: false,
      },
    ],
    "^.+/node_modules/flat/.+\\.js$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
          },
          target: "es2020",
        },
        module: {
          type: "commonjs",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(decentraland-ui2|@emotion|@mui|flat)/)",
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
