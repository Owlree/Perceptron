#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';
import { BlogPipelineStack } from '../lib/blogpipelinestack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack');
new BlogPipelineStack(app, 'BlogPipelineStack');
