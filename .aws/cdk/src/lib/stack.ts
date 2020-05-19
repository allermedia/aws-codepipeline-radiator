import { Stack, App, CfnOutput } from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { S3Deployment } from './S3Deployment';


export default class ApplicationStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // domain: this.node.tryGetContext('domain'),

    const lambdaFunction = new Function(this, 'ServerFunction', {
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

    new LambdaRestApi(this, 'ServerApi', {
      handler: lambdaFunction,
    });

    // Create S3 deployment
    new S3Deployment(this, 'S3Deployment', {
      sourcePath: '../../client/build',
      domainNames: ['aws-codepipeline-radiator-test.aws.aller.com'],
      hostedZoneDomainName: 'aws.aller.com.',
    });
  }
};
