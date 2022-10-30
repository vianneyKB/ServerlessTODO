 import * as AWS from 'aws-sdk'
//  const AWSXRay = require('aws-xray-sdk')
 import { DocumentClient } from 'aws-sdk/clients/dynamodb'
 import { TodoItem } from '../models/TodoItem'
 import { createLogger } from '../utils/logger'
 import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// const docClient: DocumentClient = createDynamoDBClient() // new XAWS.DynamoDB.DocumentClient()
const index = process.env.TODOS_CREATED_AT_INDEX
// const todosTable = process.env.TODOS_TABLE
export class TodosAccess 
{
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {}

// // TODO: Implement the dataLayer logic

  async getAllTodosByUserId(userId: string): Promise<TodoItem[]> 
  {
    logger.info(`Getting all todo items for user: ${userId}`)

    const result = await this.docClient.query({
      TableName : this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeNames: {
          "userId": "userId"
        },
      ExpressionAttributeValues: {
          ':userId': userId
        },
      ScanIndexForward: false
    }).promise()
    
    const items = result.Items
    logger.info('getAllTodosByUserId' + JSON.stringify({
      result: items
    }))

    return result.Items as TodoItem[]
  }

  async getTodoById(todoId: string): Promise<TodoItem>  
  {
    const result = await this.docClient.query({
      TableName: this.todosTable,
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

  async createTodo(todo: TodoItem): Promise<TodoItem> 
  {
    // logger.info(`Creating a new todo with id: ${todo.todoId} for user: ${todo.userId}`)
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
      return todo
  }

  async  todoById(todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      
      .query({
        TableName : this.todosTable,
        IndexName : index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()

    console.log('Get todo: ', result)
    const item = result.Items[0]

    logger.info('todoById ' + JSON.stringify({
      result: item as TodoItem || null,
      oldresult: item || null
    }))
    if (item.length !== 0) return item as TodoItem

    return item as TodoItem || null
  }
  // async  updateTodo(todo: TodoItem): Promise<TodoUpdate>  
  // {
  //   const result = await this.docClient.update(
  //     {
  //       TableName: this.todosTable,
  //       Key: { userId: todo.userId, todoId: todo.todoId},
  //       UpdateExpression: 'set attachmentUrl = :attachmentUrl',
  //       ExpressionAttributeValues:
  //         {
  //           ':attachmentUrl': todo.attachmentUrl
  //         }
  //     }).promise()
  //     return result.Attributes as TodoItem
  // }
  
  async updateTodo(todo: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
    console.log('Updating todos')
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId:  userId,
      },
      UpdateExpression: "SET #myname = :Myname,  dueDate = :dueDate,  done = :done ",
      ExpressionAttributeValues: {
        ":Myname": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done,
      },
      ExpressionAttributeNames:{
        "#myname": "name"
      }
    }).promise()

    logger.info('updateTodo ' + JSON.stringify({
      result: todo
    }))
    return todo
  }

  async deleteTodo(userId: string, todoId: string): Promise<boolean>
  {
    await this.docClient.delete(
      {
        TableName: this.todosTable,
        Key: { userId: userId, todoId: todoId},

      }).promise()
      logger.info('deleteTodo '  + JSON.stringify(
        {
          result: 'Deleted'
        }))
      return false
  }
  
  async  todoExists(todoId: string, userId: string) {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
      .promise()


    console.log('Get todo: ', result)

    logger.info('todoExists ' + JSON.stringify({
      fullResult: result,
      result: !!result.Item
    }))
    return !!result.Item
  }    

  async updateAttachedImage(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId:  todo.userId,
        todoId: todo.todoId,
        
      },
      UpdateExpression: "SET attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": todo.attachmentUrl,
      },
    }).promise()

    logger.info('updateAttachedImage ' + JSON.stringify({
      result: todo
    }))
    return todo
  }
}

function createDynamoDBClient()
  {
    if (process.env.IS_OFFLINE) 
    {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient(
        {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
        })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }