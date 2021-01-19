#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TerraformRepoStack } from '../lib/terraform-repo-stack';
import { TerraformPipelineStack } from '../lib/terraform-pipeline-stack';

const env = {
    region: 'us-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT
}

const stackId = Math.random().toString(33).substring(3,7);

const params = {
    deploymentId: stackId,
    dbLockTable: 'tf-Lock-' + stackId,
    repoName: 'tf-Repo-' + stackId,
}

const app = new cdk.App();
new TerraformRepoStack(app, 'repo', {
    env: env,
    deploymentId: params.deploymentId,
    repoName: params.repoName
});

new TerraformPipelineStack(app, 'pipeline', {
    env: env,
    deploymentId: params.deploymentId,
    dbLockTable: params.dbLockTable,
    repoName: params.repoName
});
