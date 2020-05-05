import { Stack, App } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { ServicePrincipal } from '@aws-cdk/aws-iam';

export default class ApplicationStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // domain: this.node.tryGetContext('domain'),

    const lambdaFunction = new Function(this, 'ApiFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.asset('../../server'),
      handler: 'dist/bin/lambda.handler',
      environment: {
        // BUCKET: bucket.bucketName
      },
      logRetention: 30,
    });
    lambdaFunction.addPermission('allowCodePipelineRead', {
      principal: new ServicePrincipal('codepipeline.amazonaws.com'),
    });

    new LambdaRestApi(this, 'RestApi', {
      handler: lambdaFunction,
    });
  }
};
