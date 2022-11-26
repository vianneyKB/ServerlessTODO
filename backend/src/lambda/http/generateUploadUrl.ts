import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl} from '../../businessLogic/todos'
// import * as uuid from 'uuid' , getTodoById, updateAttachedImage

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
{
  // const imageId = uuid.v4()
  console.log("Processing Event ", event);
  const todoId = event.pathParameters.todoId

  const presignedUrl = await generateUploadUrl(todoId)

  return {
    statusCode: 202,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Headers': 'Authorization'
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'X-Requested-With': '*',
      },
      body: JSON.stringify({
        uploadUrl: presignedUrl,
      })
     };
  }
