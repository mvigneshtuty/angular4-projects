// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  region: 'us-east-1',

  identityPoolId: 'us-east-1:cee7f82c-aac5-4841-b430-1d695035a0be',
  userPoolId: '',
  clientId: '',

  rekognitionBucket: '',
  albumName: '',
  bucketRegion: 'us-east-1',

  ddbUserEnrollTable: 'user_enrolls',
  ddbUserEnrollStatusIndex: 'user-enroll-stat-index',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: 'dynamodb.us-east-1.amazonaws.com',
  s3_endpoint: '',
  voiceit_devId:'devId',
  bankassist_api:'https://e5mr5drvr7.execute-api.us-east-1.amazonaws.com/dev'
};
