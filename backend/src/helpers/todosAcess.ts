 import * as AWS from 'aws-sdk'
 const AWSXRay = require('aws-xray-sdk')
 import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
 import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

 const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
 const docClient: DocumentClient = createDynamoDBClient()
 const todosTable = process.env.TODOS_TABLE

// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

    return todo
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