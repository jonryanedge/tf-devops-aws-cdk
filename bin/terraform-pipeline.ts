#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TerraformPipelineStack } from '../lib/terraform-pipeline-stack';

// specify the region if different from profile or if needed to update a specific stackId
const env = {
    region: 'us-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT
};

// add a stackId string to update or destroy a specific stack in the region listed above (21/1/21)
const stackId = '';
const branchId = 'main';  // define branch to trigger pipeline when updated

// only change needed in this file is the stackId above (21/1/21)
var stackName = '';

if (stackId) {
    stackName = stackId;
} else {
    stackName = Math.random().toString(33).substring(3,8);;
};

var branchName = '';

if (branchId) {
    branchName = branchId;
} else {
    branchName = stackId;
};

const params = {
    deploymentId: stackName,
    tfLockTableName: 'tfLock-' + stackName,
    tfBucketName: 'tf-artifacts-' + stackName,
    tfRepoName: 'tfRepo-' + stackName,
    tfPipelineBranch: branchName,
};

const app = new cdk.App();

new TerraformPipelineStack(app, 'tfBuild' + stackName, {
    env: env,
    deploymentId: params.deploymentId,
    tfLockTableName: params.tfLockTableName,
    tfBucketName: params.tfBucketName,
    tfRepoName: params.tfRepoName,
    tfPipelineBranch: params.tfPipelineBranch
});

