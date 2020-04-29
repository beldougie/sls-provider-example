module.exports = () => ({
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
})
