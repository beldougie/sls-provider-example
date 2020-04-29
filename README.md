# SLS Provider Example

This repository contains a very simple example of how dynamic provision of the Provider block in serverless.yml is broken currently

[These instructions](https://www.serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-javascript-files) on how to use a javascript file to provide dynamic variable values were followed.

The steps taken to create this repository were:

```sh
mkdir sls-provider-example
cd sls-provider-example
npm init -y
git init
npm i serverless
serverless create -t aws-nodejs
```

I then added the file provider.config.js which simply exports a function that will return the following object:

```js
{
  name: 'aws',
  runtime: 'nodejs12.x',
  stage: "${opt:stage, 'dev'}",
  region: "${opt:region, 'us-east-1'}",
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['SNS:Publish'],
      Resource: {
        'Fn::Join': [
          ':',
          [
            'arn:aws:sns',
            { Ref: 'AWS::Region' },
            { Ref: 'AWS::AccountId' },
            '*'
          ]
        ]
      }
    }
  ],
  environment: {
    STAGE: '${self:provider.stage}'
  }
}
```

When running `sls npx print` I would expect the following yaml to be generated:

```yaml
service: sls-provider-example
provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region: us-east-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - 'SNS:Publish'
      Resource:
        'Fn::Join':
          - ':'
          - - 'arn:aws:sns'
            - Ref: 'AWS::Region'
            - Ref: 'AWS::AccountId'
            - '*'
  environment:
    STAGE: dev
functions:
  hello:
    handler: handler.hello
    events: []
    name: sls-provider-example-dev-hello
```

However, this yaml is what is generated:

```yaml
service: sls-provider-example
provider:
  name:       # <-- the problem lies here ... an extraneous 'name' property is added
    name: aws
    runtime: nodejs12.x
    stage: dev
    region: us-east-1
    iamRoleStatements:
      - Effect: Allow
        Action:
          - 'SNS:Publish'
        Resource:
          'Fn::Join':
            - ':'
            - - 'arn:aws:sns'
              - Ref: 'AWS::Region'
              - Ref: 'AWS::AccountId'
              - '*'
    environment:
      STAGE: dev
functions:
  hello:
    handler: handler.hello
    events: []
    name: sls-provider-example-dev-hello
```
