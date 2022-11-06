// import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from '../helpers/attachmentUtils'

// // TODO: Implement businessLogic

const uuidV4 = require('uuid/v4')
const todoAccess = new TodosAccess();
// const logger = createLogger('todos')

export async function getAllTodosByUserId(jwtToken: string): Promise<TodoItem[]> 
{
  const userId = parseUserId(jwtToken);
  return todoAccess.getAllTodosByUserId(userId)
}

export async function createTodo(todoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem>
{
  const userId = parseUserId(jwtToken)
  const todoId = uuidV4();
  const bucketName = process.env.ATTACHMENT_S3_BUCKET

  const result = await todoAccess.createTodo(
    {
      userId: userId,
      todoId: todoId,
      name: todoRequest.name,
      dueDate: todoRequest.dueDate,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
      createdAt: new Date().toString(),
      done: false,
      ...todoRequest,
    })
    return result
}

export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  return todoAccess.deleteTodo(todoId, userId);
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, jwtToken: string, todoId: string): Promise<TodoUpdate> 
{
  const userId = parseUserId(jwtToken);
  return todoAccess.updateTodo(updateTodoRequest, todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> 
{
  return todoAccess.generateUploadUrl(todoId);
}

// export async function todoExists(todoId: string, userId: string): Promise<boolean> 
// {
//   const result = await todoAccess.todoExists(todoId, userId)
//   return result
// }

// export async function createAttachmentPresignedUrl(imageId: string) 
// {
//   const result =  AttachmentUtils(imageId)
//   return result
// }