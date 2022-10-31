import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'

// import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
//  import { getUserId } from '../utils';
//  import { createTodo } from '../../businessLogic/todos'
// import { todoBuilder } from '../../businessLogic/todos'
// import * as uuid from 'uuid'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => 
  {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item


    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    const newItem = await createTodo(newTodo, jwtToken);
    // const todo = todoBuilder(newTodo, event)
    // await createTodo(todo)
    return  {
      statusCode: 201,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }


  handler
  .caller(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
