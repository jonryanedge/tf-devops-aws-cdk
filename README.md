# AWS CodePipeline for Infrastructure as Code (IaC) with Terraform

Deploying this CDK stack will create an AWS CodePipeline linked to a CodeCommit repo and 
CodeBuild project to use for deploying AWS resources using Terraform

## Prerequisites

[AWS CDK Toolkit Guide](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)


## Starter commands

 * `npm install`     install required modules prior to deployment
 * `cdk ls`          list available stacks to deploy
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk deploy --all --auto-approve`    uninterrupted deploymen of all stacks
 
