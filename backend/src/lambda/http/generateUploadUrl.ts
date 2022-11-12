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
    statusCode: 201,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Headers': 'Authorization'
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
      },
      body: JSON.stringify({
        item: presignedUrl
      })
     };
  }
