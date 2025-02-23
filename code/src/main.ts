import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import express from 'express';
import { functionFactory, FunctionFactoryType } from './function-factory';
import { testRunner } from './test-runner/test-runner';

(async () => {
  // Define CLI options
  const argv = await yargs(hideBin(process.argv)).options({
    fixturePath: {
      type: 'string',
      require: false,
      describe: 'Path to the test fixture file',
    },
    functionName: {
      type: 'string',
      require: false,
      describe: 'Name of the function to test',
    },
    serve: {
      type: 'boolean',
      default: false,
      describe: 'Run an Express server instead of the test runner',
    },
  }).argv;

  // 1. SERVER MODE
  if (argv.serve) {
    const app = express();
    app.use(express.json());

    // Example route: POST /execute
    // The body includes { functionName: string, ...context }
    app.post('/execute', async (req, res) => {
      const { functionName, ...context } = req.body;
      try {
        // Check if the functionName is valid
        if (
          !functionName ||
          !(functionName in functionFactory)
        ) {
          throw new Error(`Invalid or missing functionName: "${functionName}"`);
        }

        // Dynamically call the function from the factory
        const fn = functionFactory[functionName as FunctionFactoryType];
        const result = await fn(context);
        res.json(result);
      } catch (error: any) {
        console.error(error);
        res.status(500).json({
          status: 'error',
          message: error.message ?? 'Unknown error',
        });
      }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`AdaaS server is running on port ${PORT}`);
    });
  }

  // 2. TEST-RUNNER MODE
  else {
    if (!argv.fixturePath || !argv.functionName) {
      console.error(
        'Please provide both --fixturePath and --functionName, or use --serve mode.'
      );
      process.exit(1);
    }

    await testRunner({
      fixturePath: argv.fixturePath,
      functionName: argv.functionName as FunctionFactoryType,
    });
  }
})();
