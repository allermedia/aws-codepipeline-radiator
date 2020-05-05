import { Stack, App } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';

export default class ApplicationStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // domain: this.node.tryGetContext('domain'),

    const handler = new Function(this, 'ApiFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.asset('../../server'),
      handler: 'dist/bin/lambda.handler',
      environment: {
        // BUCKET: bucket.bucketName
      },
    });

    new LambdaRestApi(this, 'RestApi', {
      handler,
    });
  }
};
