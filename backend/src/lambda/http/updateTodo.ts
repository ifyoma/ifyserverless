import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    
    const logger = createLogger('UpdateTodo')

    export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info('Updating todo item: ', { event })
    
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
      await updateTodo(userId, todoId, updatedTodo)
    
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: `Todo item ${todoId} was updated successfully!`
        })
      }
    }