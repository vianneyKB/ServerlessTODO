import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
// import * as middy from 'middy'

// import { cors, httpErrorHandler } from 'middy/middlewares'
// import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
  {
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    const todoId = event.pathParameters.todoId
    const deleteData = await deleteTodo(todoId, jwtToken);
    // const userId = getUserId(event);
    // TODO: Remove a TODO item by id
    
    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: deleteData,
  }

    // const validTodoId = await todoExists(todoId, userId);
    // if (!validTodoId) 
    // {
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify(
    //       {
    //       error: 'Todo does not exist'
    //       })
    //   }
    // }
    // await deleteTodo(todoId, userId)
    // return {
    //   statusCode: 200,
    //   body: ''
    // }
  }

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
