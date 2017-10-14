import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { connection } from './instances'
import { userRouter } from './routers/user.router'
import { tokenGuard } from './middlewares'

const init = async () => {
    const userRouterSync = await userRouter

    const app = express()
    const port = 4400


    process.on('unhandledRejection', err => {
       console.log('unhandledRejection', err)
    })

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())

    app.use('/', userRouterSync)
    app.use(tokenGuard())

    app.get('/', (req, res, next) => {
        res.json('awawd')
    })

    app.listen(port, () => {
        console.log(`App is listening on port ${port}`)
    })

}

init()