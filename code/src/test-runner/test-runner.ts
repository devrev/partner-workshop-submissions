import * as dotenv from 'dotenv';

import { functionFactory, FunctionFactoryType } from '../function-factory';

export interface TestRunnerProps {
  functionName: FunctionFactoryType;
  fixturePath: string;
}

export const testRunner = async ({ functionName, fixturePath }: TestRunnerProps) => {
  //Since we were not using the env anywhere its not require to load it
  dotenv.config();

  if (!functionFactory[functionName]) {
    console.error(`${functionName} is not found in the functionFactory`);
    console.error('Add your function to the function-factory.ts file');
    throw new Error('Function is not found in the functionFactory');
  }

const run = functionFactory[functionName];

const eventFixture = require(`../fixtures/${fixturePath}`);

  await run(eventFixture);
};
