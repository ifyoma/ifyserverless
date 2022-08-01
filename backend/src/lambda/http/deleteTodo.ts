import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


    // TODO: Remove a TODO item by id

    const logger = createLogger('DeleteTodo')

    export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info('Deleting todo item: ', { event })
    
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
    
      await deleteTodo(userId, todoId)
    
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: `Todo item ${todoId} was deleted successfully!`
        })
      }
    }
       