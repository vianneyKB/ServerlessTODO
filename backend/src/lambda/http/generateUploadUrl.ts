import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl} from '../../businessLogic/todos'
// import * as uuid from 'uuid' , getTodoById, updateAttachedImage

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
{
  // const imageId = uuid.v4()
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id 
    
  // const todo = await getTodoById(todoId)
  // todo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  // await updateAttachedImage(todo, imageId);
  const presignedUrl = await generateUploadUrl(todoId)

  return {
    statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: presignedUrl
      })
     };
  }
