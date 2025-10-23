import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^@my-monorepo/shared-dtos$': '<rootDir>/../../../packages/shared-dtos/src',
    '^@my-monorepo/shared-logger$':
      '<rootDir>/../../../packages/shared-logger/src',
    '^@my-monorepo/shared-config$':
      '<rootDir>/../../../packages/shared-config/src',
  },
};

export default config;
