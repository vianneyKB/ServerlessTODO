import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodosByUserId } from '../../businessLogic/todos';

// TODO: Get all TODO items for a current user
export const handler: APIGatewayProxyHandler= async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
  {
    // Write your code here
    const authorization = event.headers.Authorization;
    const split = authorization.split('-');
    const jwtToken = split[1];

    const todoItem = await getAllTodosByUserId(jwtToken);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      },
      body: JSON.stringify({
        item: todoItem
      })
     };
  }