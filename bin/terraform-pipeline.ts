#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TerraformPipelineStack } from '../lib/terraform-pipeline-stack';

const env = {
    region: 'ca-central-1',
    account: process.env.CDK_DEFAULT_ACCOUNT
}

const app = new cdk.App();
new TerraformPipelineStack(app, 'TerraformPipelineStack', {
    env: env,
    deploymentId: 'Test',
    repoName: 'tfCoreNetwork-Test',
    dbLockTable: 'tfDbLock-Test'
});
