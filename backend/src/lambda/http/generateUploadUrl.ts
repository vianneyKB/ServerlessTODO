import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl} from '../../businessLogic/todos'
// import * as middy from 'middy'

// import { cors, httpErrorHandler } from 'middy/middlewares'
// import { getUploadUrl } from '../../helpers/attachmentUtils'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

// const bucketName = process.env.ATTACHMENT_S3_BUCKET

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
{
    const todoId = event.pathParameters.todoBuilder
    const url = await generateUploadUrl(todoId)

    // const todo = await todoById(todoId)
    // todo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

    // await updateAttachedImage(todo, todoId);

    //  await getUploadUrl(todoId)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    return {
      statusCode: 202,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          uploadUrl: url,
      })
  }

    // return {
    //   statusCode: 201,
    //   body: JSON.stringify({
    //     uploadUrl: url
    //   })
    // }
  }

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
