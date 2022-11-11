 import * as AWS from 'aws-sdk';
//  const AWSXRay = require('aws-xray-sdk')
 import { DocumentClient } from 'aws-sdk/clients/dynamodb';
 import { TodoItem } from '../models/TodoItem';
 import { TodoUpdate } from '../models/TodoUpdate';
import { Types } from 'aws-sdk/clients/s3';
import { createLogger } from '../utils/logger';

const logger = createLogger('TodosAccess')
// const index = process.env.TODOS_CREATED_AT_INDEX
export class TodosAccess {
  constructor
  (
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4'}),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
  ) {}

// // TODO: Implement the dataLayer logic

  async getAllTodosByUserId(userId: string): Promise<TodoItem[]> 
  {
    const result = await this.docClient.query({
      TableName : this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeNames: 
      {
        "userId": "userId"
      },
      ExpressionAttributeValues: {
          ':userId': userId
        },
      ScanIndexForward: false
    }).promise()
    
    logger.info('getAllTodosByUserId' + JSON.stringify({result}))
    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> 
  {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()
    logger.info(`Creating a new todo with id: ${todo.todoId} for user: ${todo.userId}`)
    return todo as TodoItem
  }

  // async getTodoById(todoId: string): Promise<TodoItem>  
  // {
  //   const result = await this.docClient.query(
  //     {
  //       TableName: this.todosTable,
  //       IndexName: index,
  //       KeyConditionExpression: 'todoId = :todoId',
  //       ExpressionAttributeValues: 
  //       {
  //         ':todoId': todoId
  //       }
  //     }).promise()

  //   const items = result.Items
  //     if (items.length !== 0) 
  //     {
  //       return result.Items[0] as TodoItem
  //     }

  //   return null
  // }

  async deleteTodo(userId: string, todoId: string): Promise<string>
  {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { userId: userId, todoId: todoId}
      }).promise()
      
      logger.info('deleteTodo '  + JSON.stringify({result: 'Deleted' as string}))

    return "" as string
  }
  
  async updateTodo(todo: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> 
  {
    const result = await this.docClient.update({
        TableName: this.todosTable,
        Key: { todoId: todoId, userId:  userId},
        UpdateExpression: "SET #myname = :Myname,  #dueDate = :DueDate,  #done = :Done ",
        ExpressionAttributeNames:{
          "#myname": "name",
          "#dueDate": "dueDate",
          "#done": "done"
        },
        ExpressionAttributeValues: 
        {
          ":Myname": todo.name,
          ":DueDate": todo.dueDate,
          ":Done": todo.done,
        },
    }).promise()
    logger.info('updateTodo ' + JSON.stringify({result: todo}))
    
    const attrib = result.Attributes
    return attrib as TodoUpdate
  }

  async generateUploadUrl(todoId: string): Promise<string> 
  {
    logger.info(`Getting URL for todoId: ${todoId}`)

    const url = this.s3Client.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: 1000,
    });
    logger.info(url)

    return url as string;
  }

  // async createDynamoDBClient() {
  //   if (process.env.IS_OFFLINE) 
  //   {
  //     console.log('Creating a local DynamoDB instance')
  //     return new AWS.DynamoDB.DocumentClient(
  //       {
  //       region: 'localhost',
  //       endpoint: 'http://localhost:8000'
  //       })
  //   }
  //   return new AWS.DynamoDB.DocumentClient()
  // }
}