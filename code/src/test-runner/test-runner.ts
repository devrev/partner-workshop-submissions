// src/test-runner/test-runner.ts
import * as jest from 'jest';

// This function runs the Jest tests
async function runTestSuite() {
  const result = await jest.runCLI({
    _: ['.'], $0: 'jest'
  }, ['.']);
  if (result.results.numFailedTests > 0) {
    console.error('Tests failed.');
    process.exit(1);
  } else {
    console.log('Tests passed.');
    process.exit(0);
  }
}

// Export runTestSuite as testRunner
export const testRunner = runTestSuite;


