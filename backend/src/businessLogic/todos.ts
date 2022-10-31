import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../dataLayer/todosAcess'

// import { getUploadUrl} from '../helpers/attachmentUtils';
// import { createLogger } from '../utils/logger'

// import * as createError from 'http-errors'
// import { APIGatewayProxyEvent } from 'aws-lambda'
// import { getUserId } from '../lambda/utils'

// // TODO: Implement businessLogic

const todoAccess = new TodosAccess();
// const logger = createLogger('todos')

export async function getAllTodosByUserId(jwtToken: string): Promise<TodoItem[]> 
{
  const userId = parseUserId(jwtToken);
  return todoAccess.getAllTodosByUserId(userId)
  // const result = await todoAccess.getAllTodosByUserId(todoId)
  // logger.info('getAllTodosByUserId ' + JSON.stringify({result}))
  // return result
}

export async function createTodo(todoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem>
{
  const userId = parseUserId(jwtToken)
  const todoId = uuid.v4()
  const bucketName = process.env.ATTACHMENT_S3_BUCKET
  const createdAt = new Date().getTime().toString()
  const done = false


    // const todoId = uuid.v4()
    // const result = await todoAccess.createTodo(
    //   {
    //     todoId: todoId,
    //     userId: userId,
    //     createdAt: new Date().toISOString(),
    //     name: todoRequest.name,
    //     dueDate: todoRequest.dueDate,
    //     done: false,
    //     attachmentUrl: '',
    //     ...todoRequest
    //   })
      // logger.info('createTodo ' + JSON.stringify({
      //   result
      // }))
     return todoAccess.createTodo(
      {
        userId: userId,
        todoId: todoId,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
        createdAt: createdAt,
        done: done,
        ...todoRequest,
     })
}

export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> 
{
  const userId = parseUserId(jwtToken);
  return todoAccess.deleteTodo(todoId, userId);
  // const result = await todoAccess.deleteTodo(todoId,userId)
  // logger.info('deleteTodo ' + JSON.stringify({
  //   result
  // }))
  // return "Deleted"
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, jwtToken: string, todoId: string): Promise<TodoUpdate> 
{
  const userId = parseUserId(jwtToken);
  return todoAccess.updateTodo(updateTodoRequest, todoId, userId);
  // const result =  await todoAccess.updateTodo(
  //   {
  //     name: updateTodoRequest.name,
  //     dueDate: updateTodoRequest.dueDate,
  //     done: updateTodoRequest.done
  //   }, userId, todoId)

  //   logger.info('updateTodo ' + JSON.stringify({result}))
  // return result
}

export function generateUploadUrl(todoId: string): Promise<string> 
{
  return todoAccess.generateUploadUrl(todoId);
}

// export async function updateAttachedImage(todo: TodoItem, imageId: string): Promise<TodoItem> 
// {
//   todo.attachmentUrl = generateImageUrl(imageId)
//   const result = await todoAccess.updateAttachedImage(todo)
//   logger.info('updateAttachedImage ' + JSON.stringify({result}))
//   return result
// }


// export async function todoExists(todoId: string, userId: string): Promise<boolean> 
// {
//   const result = await todoAccess.todoExists(todoId, userId)
//   logger.info('todoExists ' + JSON.stringify({
//     result
//   }))
//   return result
// }

// export async function getTodoById(todoId: string): Promise<TodoItem> 
// {
//   const result = await todoAccess.getTodoById(todoId)
//   logger.info('todoById ' + JSON.stringify({result}))
//   return result
// }

// export async function createAttachmentPresignedUrl(imageId: string) 
// {
//   const result =  getUploadUrl(imageId)
//   logger.info('createAttachmentPresignedUrl ' + JSON.stringify({result}))
//   return result
// }