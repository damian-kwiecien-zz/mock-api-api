import { connection } from '../instances'
import { MockResponse, MockResponseAddModel } from '../entities'

export class MockResponseService {
    private readonly _mockResponseRepo = connection.then(c => c.getRepository(MockResponse))

    async createMockResponse(model: MockResponseAddModel) {
        const mockResponseRepoSync = await this._mockResponseRepo

        const mockResponse = mockResponseRepoSync.create(model)
        mockResponseRepoSync.save(mockResponse)

        return mockResponse
    }

    async getMockResponses() {
        const mockResponseRepoSync = await this._mockResponseRepo

        return await mockResponseRepoSync.find()
    }
}