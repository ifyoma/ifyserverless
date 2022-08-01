import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'



    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    const logger = createLogger('GenerateUploadUrl')

    export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info('Generating upload url: ', { event })
    
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const attachmentId = uuid.v4()
    
      const uploadUrl = await createAttachmentPresignedUrl(attachmentId)
    
      await updateAttachmentUrl(userId, todoId, attachmentId)
    
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          uploadUrl
        })
      }
    }
    