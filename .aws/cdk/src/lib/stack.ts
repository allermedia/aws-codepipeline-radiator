import { Stack, App } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { ServicePrincipal, PolicyStatement } from '@aws-cdk/aws-iam';

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

    // Create access policy to get codepipeline states
    const accessPolicy = new PolicyStatement();
    accessPolicy.addResources('*');
    accessPolicy.addActions('codepipeline:getPipelineState');

    lambdaFunction.addToRolePolicy(accessPolicy)

    new LambdaRestApi(this, 'RestApi', {
      handler: lambdaFunction,
    });
  }
};
