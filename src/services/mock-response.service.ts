import { connection } from '../instances'
import { MockResponse, MockResponseAddModel } from '../entities'

export class MockResponseService {
    private readonly _mockResponseRepo = connection.then(c => c.getRepository(MockResponse))

    async getMockResponses() {
        const mockResponseRepoSync = await this._mockResponseRepo

        return await mockResponseRepoSync.find()
    }

    async getMockResponseById(responseId: number) {
        const mockResponseRepoSync = await this._mockResponseRepo

        return await mockResponseRepoSync.findOneById(responseId)
    }

    async createMockResponse(model: MockResponseAddModel) {
        const mockResponseRepoSync = await this._mockResponseRepo

        const mockResponse = mockResponseRepoSync.create(model)
        mockResponseRepoSync.save(mockResponse)

        return mockResponse
    }

    async updateMockResponse(responseId: number, model: MockResponseAddModel) {
        const mockResponseRepoSync = await this._mockResponseRepo

        await mockResponseRepoSync.updateById(responseId, model)

        return mockResponseRepoSync.findOneById(responseId)
    }

    async deleteMockResponse(responseId: number) {
        const mockResponseRepoSync = await this._mockResponseRepo

        const response = await mockResponseRepoSync.findOneById(responseId)
        await mockResponseRepoSync.removeById(responseId)

        return response
    }
}