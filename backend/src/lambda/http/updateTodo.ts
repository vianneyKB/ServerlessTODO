import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler= async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
  {
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    const todoId = event.pathParameters.todoId
    const todoItem = updateTodo(updatedTodo, jwtToken, todoId)

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
