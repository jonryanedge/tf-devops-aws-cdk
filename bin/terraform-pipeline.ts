#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TerraformRepoStack } from '../lib/terraform-repo-stack';
import { TerraformPipelineStack } from '../lib/terraform-pipeline-stack';

const env = {
    region: 'ca-central-1',
    account: process.env.CDK_DEFAULT_ACCOUNT
}

const params = {
    deploymentId: Math.random().toString(36).substring(2, 15),
    dbLockTable: 'tf-State-Lock',
    repoName: 'tfCoreNetwork-Test',
}

const app = new cdk.App();
new TerraformRepoStack(app, 'repo', {
    env: env,
    deploymentId: params.deploymentId,
    repoName: params.repoName + '-' + params.deploymentId
});

new TerraformPipelineStack(app, 'pipeline', {
    env: env,
    deploymentId: params.deploymentId,
    dbLockTable: params.dbLockTable+ '-' + params.deploymentId,
    repoName: params.repoName
});
