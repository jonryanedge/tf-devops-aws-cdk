# AWS CodePipeline for Infrastructure as Code (IaC) with Terraform

Deploying this CDK stack will create an AWS CodePipeline using a CodeBuild project and a CodeCommit repo 
for hosting Terraform code that builds AWS infrastructure. Terraform state is managed separately using an 
S3 bucket and DynamoDb table. The CDK app produces outputs after completion that make transitioning to 
the Terraform build seamless.

## Prerequisites

[AWS CDK Toolkit Guide](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)

* Run `export CDK_NEW_BOOTSTRAP=1` to enable `modern` bootstrap templates (Recommended)
* Run `aws configure` to authenticate the CDK app to your AWS environment
* Clone or download the repo, then access it at the command line
* Bootstrap your environment by running `cdk bootsrap` with the default or a specific aws cli profile

## Story

#### Use a CDK app to deploy an automated build pipeline to deploy AWS resources using Terraform

## Starter commands

 * `npm install`     install required modules prior to deployment
 * `cdk ls`          list available stacks to deploy
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk deploy --all --request-approval never`    uninterrupted deployment of all stacks
 
## Deployed Resources

1. CodeCommit Repo - to maintain the Terraform codebase
2. S3 Bucket - for Terraform state files
3. DynamoDb table - for Terraform state lock sequencing
4. CodePipeline Resources
  * Artifacts S3 Bucket
  * Event Watcher