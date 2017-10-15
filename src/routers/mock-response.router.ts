import { Router } from 'express'
import { matchedData } from 'express-validator/filter'
import { mockResponseRules } from '../rules'
import { MockResponseService } from '../services'
import { MockResponseAddModel } from '../entities'
import { bodyValidator } from '../middlewares'

const filterSlasheshFromBeginAndEnd = (url: string) => {
    return url.replace(/^\/+|\/+$/g, '')
}

const createMockResponseRouter = async () => {
    const mockResponseRulesSync = await mockResponseRules
    const mockResponseRouter = Router()
    const mockResponseService = new MockResponseService()

    mockResponseRouter.post('/', mockResponseRulesSync['forPost'], bodyValidator(), async (req, res) => {
        const payload = matchedData(req) as MockResponseAddModel
        const model = {
            ...payload,
            endpoint: filterSlasheshFromBeginAndEnd(payload.endpoint)
        }

        const mockResponse = await mockResponseService.createMockResponse(model)

        return res.json(mockResponse)
    })

    mockResponseRouter.get('/', async (req, res) => {
        const mockResponses = await mockResponseService.getMockResponses()

        return res.json(mockResponses)
    })

    return mockResponseRouter
}

export const mockResponseRouter = createMockResponseRouter()