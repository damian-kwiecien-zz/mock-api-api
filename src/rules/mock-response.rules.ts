import { check } from 'express-validator/check'
import { MockResponse } from '../entities'
import { connection } from '../instances'
import { HttpMethod, Util } from '../constants'

const createMockResponseRules = async () => {
    const connectionSync = await connection
    const mockResponseRepo = connectionSync.getRepository(MockResponse)

    return {
        forPost: [
            check('name')
                .custom(name => typeof name === 'string').withMessage('Name must be string')
                .custom(name => name.length).withMessage('Name can not be empty'),
            check('method')
                .custom(method => !!Object.values(HttpMethod).find(m => method.toLowerCase() == m))
                .withMessage(`Invalid value, allowed are: ${Object.values(HttpMethod).join(', ')}`),
            check('endpoint')
                .exists().withMessage('Endpoint is required')
                .custom(async (endpoint, { req }) => {
                    return !await mockResponseRepo.findOne({
                        where: {
                            endpoint: Util.filterSlasheshFromBeginAndEnd(endpoint),
                            method: req.body.method
                        }
                    })
                }).withMessage('Endpoint already exists'),
            check('body')
                .exists().withMessage('Body is required')
                .isJSON().withMessage('Body is not valid json')
        ],
        forPut: [
            check('name')
                .custom(name => typeof name === 'string').withMessage('Name must be string')
                .custom(name => name.length).withMessage('Name can not be empty'),
            check('method')
                .custom(method => !!Object.values(HttpMethod).find(m => method.toLowerCase() == m))
                .withMessage(`Invalid value, allowed are: ${Object.values(HttpMethod).join(', ')}`),
            check('endpoint')
                .exists().withMessage('Endpoint is required')
                .custom(async (endpoint, { req }) => {
                    return !await mockResponseRepo.createQueryBuilder("r")
                        .where("r.id != :id", { id: req.params.mockResponseId })
                        .andWhere('r.method = :method', { method: req.body.method })
                        .andWhere('r.endpoint = :endpoint', { endpoint: Util.filterSlasheshFromBeginAndEnd(endpoint) })
                        .getOne()
                }).withMessage('Endpoint already exists'),
            check('body')
                .exists().withMessage('Body is required')
                .isJSON().withMessage('Body is not valid json')
        ]
    }
}

export const mockResponseRules = createMockResponseRules()