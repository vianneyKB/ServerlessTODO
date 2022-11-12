import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo} from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
  {
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    
    // TODO: Remove a TODO item by id
    
    const todoId = event.pathParameters.todoId

    // const validTodoId = await todoExists(todoId, jwtToken);
    // if (!validTodoId) 
    // {
    // return {
    //   statusCode: 404,
    //   body: JSON.stringify(
    //     {
    //     error: 'Todo does not exist'
    //     })
    //   }
    // }
    
    const todoItem = await deleteTodo(todoId, jwtToken);

    return {
      statusCode: 200,
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
        item: todoItem
      })
     };

  }

