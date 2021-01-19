import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as s3 from '@aws-cdk/aws-s3';
import * as pipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as build from '@aws-cdk/aws-codebuild';
import * as db from '@aws-cdk/aws-dynamodb';

export class TerraformPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const infraRepo = new codecommit.Repository(this, 'networkRepo', {
      repositoryName: 'tfCoreNetwork',
      description: 'Repo of Terraform constructs for deployment'
    });

    const pipelineBucket = new s3.Bucket(this, 'pipelineBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const tfDatabase = new db.Table(this, 'tf-state-lock', {
      tableName: 'db-tfState',
      partitionKey: { name: 'LockID', type: db.AttributeType.STRING },
    })

    const srcOutput = new pipeline.Artifact();
    const tfBuildOutput = new pipeline.Artifact('tfBuildOutput');
    const terraformPipeline = new pipeline.Pipeline(this, 'terraformPipeline', {
      artifactBucket: pipelineBucket,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: infraRepo,
              output: srcOutput
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new actions.CodeBuildAction({
              actionName: 'Terraform_Build',
              project: new build.PipelineProject(this, 'TerraformBuild', {
                environment: {
                  buildImage: build.LinuxBuildImage.STANDARD_4_0,
                  privileged: true,
                  environmentVariables: {
                    TF_COMMAND: {value: 'apply', type: build.BuildEnvironmentVariableType.PLAINTEXT}
                  }
                },
                buildSpec: build.BuildSpec.fromSourceFilename(''),
              }),
              input: srcOutput,
              outputs: [tfBuildOutput]
            })
          ],
        }
      ]
    })
  }
}
