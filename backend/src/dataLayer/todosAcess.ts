 import * as AWS from 'aws-sdk'
//  const AWSXRay = require('aws-xray-sdk')
 import { DocumentClient } from 'aws-sdk/clients/dynamodb'
 import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
// import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const docClient: DocumentClient = createDynamoDBClient() // new XAWS.DynamoDB.DocumentClient()
const index = process.env.TODOS_CREATED_AT_INDEX
const todosTable = process.env.TODOS_TABLE

// // TODO: Implement the dataLayer logic

export async function  getAllTodosByUserId(userId: string): Promise<TodoItem[]> 
  {
    logger.info(`Getting all todo items for user: ${userId}`)

    const result = await docClient.query({
      TableName : todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeNames: {
          "userId": "userId"
        },
      ExpressionAttributeValues: {
          ':userId': userId
        },
      ScanIndexForward: false
    }).promise()
    return result.Items as TodoItem[]
  }

export async function  getTodoById(todoId: string): Promise<TodoItem>  
  {
    const result = await docClient.query({
      TableName: todosTable,
      IndexName: index,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
          ':todoId': todoId
      }
    }).promise()

    const items = result.Items
      if (items.length !== 0) 
      {
        return result.Items[0] as TodoItem
      }
      return null
  }

export async function createTodo(todo: TodoItem): Promise<TodoItem> 
  {
    logger.info(`Creating a new todo with id: ${todo.todoId} for user: ${todo.userId}`)
      await docClient.put({
        TableName: todosTable,
        Item: todo
      }).promise()
      return todo
  }

export async function  updateTodo(todo: TodoItem): Promise<TodoItem>  
  {
    const result = await docClient.update({
      TableName: todosTable,
      Key: { userId: todo.userId, todoId: todo.todoId},
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues:
        {
          ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()
      return result.Attributes as TodoItem
  }
  export async function deleteTodo(todoId: string): Promise<TodoItem>
  {
    logger.info(`Deleting todo with id: ${todoId}`);
    const result = await docClient.delete({
      TableName: todosTable,
      Key: { todoId: todoId},
      ConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues:
        {
          ':todoId': todoId
        }
    }).promise()
      return result.Attributes as TodoItem

  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }