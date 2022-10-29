import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import { TodosAccess } from '../dataLayer/todosAcess'
import { getUploadUrl, generateImageUrl} from '../helpers/attachmentUtils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
// import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate'

// // TODO: Implement businessLogic

const todoAccess = new TodosAccess();
const logger = createLogger('todos')

export function createTodo(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem
{
    const todoId = uuid.v4()

    const todo = 
    {
      todoId: todoId,
      userId: getUserId(event),
      createdAt: new Date().toISOString(),
      name: todoRequest.name,
      dueDate: todoRequest.dueDate,
      done: false,
      attachmentUrl: '',
      ...todoRequest
    }
     return todo as TodoItem
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<TodoUpdate> 
{
  const result =  await todoAccess.updateTodo(
    {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    }, userId, todoId)

    logger.info('updateTodo ' + JSON.stringify({result}))
  return result
}

export async function updateAttachedImage(todo: TodoItem, imageId: string): Promise<TodoItem> 
{
  todo.attachmentUrl = generateImageUrl(imageId)
  const result = await todoAccess.updateAttachedImage(todo)
  logger.info('updateAttachedImage ' + JSON.stringify({result}))
  return result
}

export async function deleteTodo(todoId: string, userId: string): Promise<string> 
{
  const result = await todoAccess.deleteTodo(todoId,userId)
  logger.info('deleteTodo ' + JSON.stringify({
    result
  }))
  return "Deleted"
}

export async function todoExists(todoId: string, userId: string): Promise<boolean> 
{
  const result = await todoAccess.todoExists(todoId, userId)
  logger.info('todoExists ' + JSON.stringify({
    result
  }))
  return result
}

export async function todoById(todoId: string): Promise<TodoItem> 
{
  const result = await todoAccess.todoById(todoId)
  logger.info('todoById ' + JSON.stringify({result}))
  return result
}


export async function getAllTodosByUserId(todoId: string): Promise<TodoItem[]> 
{
  const result = await todoAccess.getAllTodosByUserId(todoId)
  logger.info('getAllTodosByUserId ' + JSON.stringify({result}))
  return result
}

export async function createAttachmentPresignedUrl(imageId: string) 
{
  const result =  getUploadUrl(imageId)
  logger.info('createAttachmentPresignedUrl ' + JSON.stringify({result}))
  return result
}