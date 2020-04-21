import { App } from '@aws-cdk/core';
import ApplicationStack from '../lib/stack';
import { readFileSync } from 'fs';
import { resolve } from 'path';


const app = new App();
const env = app.node.tryGetContext('env');
if (!env) {
  throw new Error('No "envtype" context defined.');
}

// Load package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../../../../package.json'), { encoding: 'utf8' }));

new ApplicationStack(app, `${packageJson.name}-${env}`);
