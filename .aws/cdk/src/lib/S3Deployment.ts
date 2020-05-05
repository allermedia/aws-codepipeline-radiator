import { App, CfnOutput, Construct } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';


export type S3DeploymentProps = {
  /**
   * S3 deployment path
   */
  sourcePath: string;
}

/**
 * S3 deployment pattern that creates private bucket and CloudFront distribution
 */
export class S3Deployment extends Construct {
  constructor(scope: Construct, id: string, {
    sourcePath
  }: S3DeploymentProps) {
    super(scope, id);

    // Create bucket with no public read access
    const bucket = new Bucket(this, 'Bucket', {
      publicReadAccess: false,
    });

    // Create origin access identity for CloudFront access
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    // Create CloudFront distribution with S3 source and origin access identity
    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }],
    });

    // Create bucket deployment
    new BucketDeployment(this, 'Deployment', {
      sources: [Source.asset(sourcePath)],
      destinationBucket: bucket,
      distribution, // Invalidate distribution cache when deployed
    });


    new CfnOutput(this, 'S3 Bucket name', { value: bucket.bucketName });
    new CfnOutput(this, 'CloudFront Distribution domain name', { value: distribution.domainName });
  }
};
