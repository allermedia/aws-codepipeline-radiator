import { CfnOutput, Construct } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity, ViewerCertificate } from '@aws-cdk/aws-cloudfront';
import { Certificate, ValidationMethod, DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';


export type S3DeploymentProps = {
  /**
   * S3 deployment path
   */
  sourcePath: string;

  /**
   * List of domain names used for CloudFront CNAME and certificate
   */
  domainNames: string[];

  /**
   * Route53 hosted zone domain name for DNS certificate validation
   */
  hostedZoneDomainName: string;
}

/**
 * S3 deployment pattern that creates private bucket and CloudFront distribution
 */
export class S3Deployment extends Construct {
  constructor(scope: Construct, id: string, {
    sourcePath,
    domainNames = [],
    hostedZoneDomainName,
  }: S3DeploymentProps) {
    super(scope, id);

    // Create bucket with no public read access
    const bucket = new Bucket(this, 'Bucket', {
      publicReadAccess: false,
    });

    // Create origin access identity for CloudFront access
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    // Create certificate
    let certificate: Certificate;
    const [mainDomainName, ...alternativeDomainNames] = domainNames;
    if (hostedZoneDomainName) {
      // If we have route53 domain name, create DnsValidatedCertificate
      const hostedzone = HostedZone.fromLookup(this, 'HostedZone', {
        domainName: hostedZoneDomainName,
      });
      certificate = new DnsValidatedCertificate(this, 'Certificate', {
        domainName: mainDomainName,
        hostedZone: hostedzone,
        subjectAlternativeNames: alternativeDomainNames,
        validationMethod: ValidationMethod.DNS,
      });

    } else {
      // Create default certificate that does email validation
      certificate = new Certificate(this, 'Certificate', {
        domainName: mainDomainName,
        subjectAlternativeNames: alternativeDomainNames,
        validationMethod: ValidationMethod.DNS,
      });
    }

    // Create CloudFront distribution with S3 source, origin access identity and certificate
    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity,
        },
        behaviors: [{ isDefaultBehavior: true }],
      }],
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: domainNames, // Need to redefine the aliases (https://github.com/aws/aws-cdk/issues/7240)
      }),
    });

    // Create bucket deployment
    new BucketDeployment(this, 'Deployment', {
      sources: [Source.asset(sourcePath)],
      destinationBucket: bucket,
      distribution, // Invalidate distribution cache when deployed
    });


    new CfnOutput(this, 'S3 Bucket name', { value: bucket.bucketName });
    new CfnOutput(this, 'CloudFront Distribution ID', { value: distribution.distributionId });
  }
};
