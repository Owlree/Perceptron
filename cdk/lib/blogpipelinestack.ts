import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';


export class BlogPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const oauth = cdk.SecretValue.secretsManager('github-perceptron-token', {
      jsonField: 'github-perceptron-token'
    });

    const blogBuildPipelineProject = new codebuild.PipelineProject(this, 'BlogBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            commands: [
              'npm install'
            ]
          },
          build: {
            commands: ['npm run build']
          }
        },
        artifacts: {
          files: [
            '**/*'
          ],
          'base-directory': 'dist'
        }
      })
    });

    const githubSourceArtifact = new codepipeline.Artifact();
    const blogBuildOutputArtifact = new codepipeline.Artifact();

    new codepipeline.Pipeline(this, 'Perceptron Pipeline', {
      stages: [
        {
          stageName: 'GitHubSource',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'github',
              oauthToken: oauth,
              output: githubSourceArtifact,
              owner: 'Owlree',
              repo: 'blog',
              branch: 'master'
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'build-all',
              project: blogBuildPipelineProject,
              input: githubSourceArtifact,
              outputs: [blogBuildOutputArtifact]
            })
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.S3DeployAction({
              bucket: s3.Bucket.fromBucketArn(this, 'deploy-bucket', 'arn:aws:s3:::owlree-blog'),
              input: blogBuildOutputArtifact,
              extract: true,
              actionName: 's3-deploy',
              accessControl: s3.BucketAccessControl.PUBLIC_READ
            })
          ]
        }
      ]
    });
  }
}
