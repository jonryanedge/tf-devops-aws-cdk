#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TerraformPipelineStack } from '../lib/terraform-pipeline-stack';

const app = new cdk.App();
new TerraformPipelineStack(app, 'TerraformPipelineStack', {
    env: { region: 'ca-central-1' }
});
