const globalConfig = {
  firebaseAuth: {
    firebaseJwtSecretKey: process.env.FIREBASE_JWT_SECRET_KEY,
  },
  port: +process.env.PORT || 5000,
  s3: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
    awsS3Region: process.env.AWS_S3_REGION,
    awsS3LimitSizeMb: +process.env.AWS_S3_LIMIT_SIZE_MB,
    awsS3PresignTimeOut: +process.env.AWS_S3_PRESIGN_TIME_OUT,
  },
  // firebaseServiceAccount: {
  //   type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
  //   projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
  //   privateKeyId: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  //   privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
  //   clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  //   clientId: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
  //   authUri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
  //   tokenUri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
  //   authProviderX509CertUrl:
  //     process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  //   clientC509CertUrl:
  //     process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  // },
};

export default () => globalConfig;
export type IGlobalConfig = typeof globalConfig;
