import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.ATTACHMENT_S3_BUCKET

// // TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: 420
    })
  }
  
export function generateImageUrl(imageId: string) {
  return `https://${bucketName}.s3.amazonaws.com/${imageId}`
}