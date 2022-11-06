import * as AWS from 'aws-sdk'
//const AWSXRay = require('aws-xray-sdk')
import * as AWSXRay from "aws-xray-sdk";
const XAWS = AWSXRay.captureAWS(AWS)
​
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const bucketname = process.env.ATTACHMENT_S3_BUCKET
​
// // TODO: Implement the fileStogare logic
export function AttachmentUtils(imageId: string) {
    return s3.getSignedUrl('putObject',{
        Bucket: bucketname,
        Key: imageId,
        Expires: 300
    })
}
// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)
// const bucketName = process.env.ATTACHMENT_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// const s3 = new XAWS.S3({signatureVersion: 'v4'})

// // // TODO: Implement the fileStogare logic

// export async function AttachmentUtils(imageId: string) {
//   console.log('AttachmentUtils Expiration', Number(urlExpiration))
//   return s3.getSignedUrl('putObject', {
//       Bucket: bucketName,
//       Key: imageId,
//       Expires: Number(urlExpiration)
//   })
// }
// export function getUploadUrl(todoId: string) {
//     return s3.getSignedUrl('putObject', {
//       Bucket: bucketName,
//       Key: todoId,
//       Expires: 420
//     })
//   }
  
// export function generateImageUrl(imageId: string) {
//   return `https://${bucketName}.s3.amazonaws.com/${imageId}`
// }