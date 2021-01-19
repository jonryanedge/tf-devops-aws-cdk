import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';
import * as pipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as build from '@aws-cdk/aws-codebuild';
import * as db from '@aws-cdk/aws-dynamodb';

interface TfStackProps extends cdk.StackProps {
  deploymentId: string;
  repoName: string;
}

export class TerraformRepoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TfStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const infraRepo = new codecommit.Repository(this, 'networkRepo', {
      repositoryName: props.repoName,
      description: 'Repo of Terraform constructs for deployment'
    });
  }
}