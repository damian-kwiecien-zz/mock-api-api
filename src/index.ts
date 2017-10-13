import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { createConnection } from "typeorm"

const app = express()
const port = 4400
const connection = createConnection()

process.on('unhandledRejection', err => {
    console.log('unhandledRejection', err)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res, next) => {
    connection.then(c => res.json(c.name))
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})