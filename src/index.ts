import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { connection } from './instances'
import { userRouter, mockResponseRouter } from './routers'
import { tokenGuard, mockResponse } from './middlewares'

const init = async () => {
    const userRouterSync = await userRouter
    const mockResponseRouterSync = await mockResponseRouter
    const app = express()
    const port = 4400

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use('/', userRouterSync)

    app.use(tokenGuard())
    app.use('/mock-responses', mockResponseRouterSync)
    app.use(mockResponse())

    app.listen(port, () => console.log(`App is listening on port ${port}`))
}

init()