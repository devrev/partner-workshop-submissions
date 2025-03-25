module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    "**/*": {
      branches: 60
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageReporters: ['text'],
  preset: 'ts-jest',
  testEnvironment: 'node'
};
