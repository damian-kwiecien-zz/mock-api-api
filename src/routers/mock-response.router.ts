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

    mockResponseRouter.get('/', async (req, res) => {
        const mockResponses = await mockResponseService.getMockResponses()

        return res.json(mockResponses)
    })

    mockResponseRouter.get('/:mockResponseId', async (req, res) => {
        const mockResponseId = req.params.mockResponseId
        const mockResponse = await mockResponseService.getMockResponseById(mockResponseId)

        return res.json(mockResponse)
    })

    mockResponseRouter.post('/', mockResponseRulesSync['forPost'], bodyValidator(), async (req, res) => {
        const payload = matchedData(req) as MockResponseAddModel
        const model = {
            ...payload,
            endpoint: filterSlasheshFromBeginAndEnd(payload.endpoint)
        }

        const mockResponse = await mockResponseService.createMockResponse(model)

        return res.json(mockResponse)
    })

    mockResponseRouter.put('/:mockResponseId', mockResponseRulesSync['forPut'], bodyValidator(), async (req, res) => {
        const mockResponseId = req.params.mockResponseId
        const payload = matchedData(req) as MockResponseAddModel
        const model = {
            ...payload,
            endpoint: filterSlasheshFromBeginAndEnd(payload.endpoint)
        }

        const mockResponse = await mockResponseService.updateMockResponse(mockResponseId, model)

        return res.json(mockResponse)
    })

    mockResponseRouter.delete('/:mockResponseId', async (req, res) => {
        const mockResponseId = req.params.mockResponseId
        const mockResponse = await mockResponseService.deleteMockResponse(mockResponseId)

        return res.json(mockResponse)
    })

    return mockResponseRouter
}

export const mockResponseRouter = createMockResponseRouter()