import { Request, Response, NextFunction } from 'express'
import { MockResponseService } from '../services'
import { MockResponse } from '../entities'

const mockResponseService = new MockResponseService()

const filterSlasheshFromBeginAndEnd = (url: string) => {
    return url.replace(/^\/+|\/+$/g, '')
}

const mapReqToMockResponse = async (req: Request) => {
    const mockResponses = await mockResponseService.getMockResponses()

    const endpoint = filterSlasheshFromBeginAndEnd(req.path)
    const method = req.method.toLowerCase()

    return mockResponses.find(r => r.endpoint == endpoint && r.method == method)
}

export const mockResponse = () => async (req: Request, res: Response, next: NextFunction) => {
    const response = await mapReqToMockResponse(req)

    if (response)
        res.json(JSON.parse(response.body))

    next()
}