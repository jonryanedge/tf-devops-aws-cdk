import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';

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

    new cdk.CfnOutput(this, 'stackId', {
        value: props.deploymentId,
    });

    new cdk.CfnOutput(this, 'repoName', {
        value: props.repoName,
    });
    
    new cdk.CfnOutput(this, 'repoUrl', {
        value: infraRepo.repositoryCloneUrlHttp,
    });

  }
}