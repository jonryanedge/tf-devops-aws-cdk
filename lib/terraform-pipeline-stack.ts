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
  dbLockTable: string;
  repoName: string;
}

export class TerraformPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TfStackProps) {
    super(scope, id, props);

    // deploy pipeline repo
    const pRepo = new codecommit.Repository(this, 'networkRepo', {
      repositoryName: props.repoName,
      description: 'Repo of Terraform constructs for deployment'
    });

    // define bucket for pipeline artifacts
    const pBucket = new s3.Bucket(this, 'artifacts', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: props.deploymentId + '-artifacts',
    });

    const tfDb = new db.Table(this, 'tfDb', {
      tableName: props.dbLockTable,
      partitionKey: { name: 'LockID', type: db.AttributeType.STRING },
    });

    const tfPipelineRole = new iam.Role(this, 'tfPipelineRole', {
      roleName: 'tfPipelineRole-' + props.deploymentId,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('codebuild.amazonaws.com'),
        new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        new iam.AccountPrincipal(props.env?.account)
      ),
    });

    tfPipelineRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['*'],
    }));

    const srcOutput = new pipeline.Artifact();
    const tfBuildOutput = new pipeline.Artifact('tfBuildOutput');
    const terraformPipeline = new pipeline.Pipeline(this, 'terraformPipeline', {
      pipelineName: 'tfPipeline-' + props.deploymentId,
      role: tfPipelineRole,
      artifactBucket: pBucket,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new actions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
              repository: pRepo,
              output: srcOutput
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new actions.CodeBuildAction({
              role: tfPipelineRole,
              actionName: 'Terraform_Build',
              project: new build.PipelineProject(this, 'tfBuild', {
                projectName: 'tfBuildProj-' + props.deploymentId,
                role: tfPipelineRole,
                environment: {
                  buildImage: build.LinuxBuildImage.STANDARD_4_0,
                  privileged: true,
                  environmentVariables: {
                    TF_COMMAND: { value: 'apply', type: build.BuildEnvironmentVariableType.PLAINTEXT }
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
    });

    new cdk.CfnOutput(this, 'stackId', {
      value: props.deploymentId,
    });

    new cdk.CfnOutput(this, 'dbTableName', {
      value: props.dbLockTable,
    });

    new cdk.CfnOutput(this, 'bucketName', {
      value: pBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'repoName', {
        value: props.repoName,
    });
    
    new cdk.CfnOutput(this, 'repoUrl', {
        value: pRepo.repositoryCloneUrlHttp,
    });
  }
}
