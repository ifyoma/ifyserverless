import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import 'source-map-support/register'


// TODO: Implement businessLogic

const logger = createLogger('todos')
const todosAccess = new TodosAccess()
const todoAttachment = new AttachmentUtils()

/**
 * Get all todo items for a user
 * @param userId: (string) User's id
 * @returns list of user's todo items
 */
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info(`Retrieving all todos for user ${userId}`, { userId })

    return await todosAccess.getTodoItems(userId)
}

/**
 * Creates a new todo item
 * @param userId: (string) User's id
 * @param createTodoRequest: (object) todo item create request
 * @returns object of a new todo item
 */
export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()

    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...createTodoRequest
    }

    logger.info(`Creating todo ${todoId} for user ${userId}`, { userId, todoId, todoItem: newItem })

    await todosAccess.createTodoItem(newItem)

    return newItem
}

/**
 * Updates a todo item
 * @param userId: (string) User's id
 * @param todoId: (string) Todo item id
 * @param updateTodoRequest: (object) todo item update request
 */
export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Updating todo ${todoId} for user ${userId}`, { userId, todoId, todoUpdate: updateTodoRequest })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw createError(403, "User is not authorized to update item")
    }

    todosAccess.updateTodoItem(userId, todoId, updateTodoRequest as TodoUpdate)
}

/**
 * Deletes a todo item
 * @param userId: (string) User's id
 * @param todoId: (string) Todo item id 
 */
export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`Deleting todo ${todoId} for user ${userId}`, { userId, todoId })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
        throw createError(403, "User is not authorized to delete item!")
    }

    todosAccess.deleteTodoItem(userId, todoId)
}

/**
 * Updates the todo item's attachment url
 * @param userId: (string) User's id
 * @param todoId: (string) Todo item id 
 * @param attachmentId: (string) Todo item's attachment id
 */
export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`Generating attachment URL for attachment ${attachmentId}`)

    const attachmentUrl = await todoAttachment.getAttachmentUrl(attachmentId)

    logger.info(`Updating todo ${todoId} with attachment URL ${attachmentUrl}`, { userId, todoId })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw createError(403, "User is not authorized to update item!")
    }

    await todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)
}

/**
 * 
 * @param attachmentId: (string) Todo item's attachment id
 * @returns string of the upload URL to an S3 bucket
 */
export async function createAttachmentPresignedUrl(attachmentId: string): Promise<string> {
    logger.info(`Generating upload URL for attachment ${attachmentId}`)

    const uploadUrl = await todoAttachment.getUploadUrl(attachmentId)

    return uploadUrl
}

