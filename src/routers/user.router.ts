import { Router } from 'express'
import { matchedData } from 'express-validator/filter'
import { userRules } from '../rules'
import { UserService } from '../services'
import { UserRegisterModel, UserLoginModel } from '../entities'
import { bodyValidator, tokenGuard } from '../middlewares'

const createUserRouter = async () => {
    const userRulesSync = await userRules
    const userRouter = Router()
    const userService = new UserService()

    userRouter.post('/register', userRulesSync['forRegister'], bodyValidator(), async (req, res) => {
        const payload = matchedData(req) as UserRegisterModel
        await userService.register(payload)

        return res.json({ message: 'Ok' })
    })

    userRouter.post('/login', userRulesSync['forLogin'], bodyValidator(), async (req, res) => {
        const payload = matchedData(req) as UserLoginModel
        const token = await userService.login(payload)

        return res.json(token)
    })

    userRouter.use(tokenGuard())

    userRouter.post('/check', userRulesSync['forCheck'], bodyValidator(), async (req, res) => {
        return res.json({ message: 'Ok' })
    })

    return userRouter
}

export const userRouter = createUserRouter()