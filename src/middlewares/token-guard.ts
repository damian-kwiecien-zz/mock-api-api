import * as jwt from 'jsonwebtoken'
import { IncomingHttpHeaders } from 'http'
import { RequestHandler } from 'express'
import { UserService } from '../services'

const userService = new UserService()

const getTokenFromHeaders = (headers: IncomingHttpHeaders) => {
    const header = headers.authorization as string

    if (!header)
        return header

    return header.split(' ')[1]
}

export const tokenGuard = () => async (req, res, next) => {
    const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || ''
    const hasAccess = await userService.verifyToken(token)

    if (!hasAccess)
        return res.status(403).send({ message: 'No access' })

    next()
}