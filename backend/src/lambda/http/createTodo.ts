import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
 import { getUserId } from '../utils';
 import { createTodo } from '../../businessLogic/todos'
//  import { createTodo } from '../../businessLogic/todos'
// import { todoBuilder } from '../../businessLogic/todos'
// import * as uuid from 'uuid'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item

    const newItem = getUserId(event);
     await createTodo(newTodo, event)
    // const todo = todoBuilder(newTodo, event)
    // await createTodo(todo)


    return  {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
