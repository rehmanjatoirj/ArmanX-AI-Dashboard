process.env.NODE_ENV = 'test';

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/jobs/agent.worker.ts'],
};

export default config;
