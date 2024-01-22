import { S3Client } from '@aws-sdk/client-s3'


const client = new S3Client({
  credentials: {
    accessKeyId: process.env.RECIPARSE_AWS_ACCESS_KEY,
    secretAccessKey: process.env.RECIPARSE_AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-east-2',
})

export default client