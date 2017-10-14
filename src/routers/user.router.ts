import { Router } from 'express'
import { matchedData } from 'express-validator/filter'
import { validationResult } from 'express-validator/check'
import { userRules } from '../rules/user.rules'
import { UserService } from '../services/user.service'
import { UserRegisterModel, UserLoginModel } from '../entities/user'

const createUserRouter = async () => {
    const userRulesSync = await userRules
    const userRouter = Router()
    const userService = new UserService()

    userRouter.post('/register', userRulesSync['forRegister'], (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(422).json(errors.array())

        const payload = matchedData(req) as UserRegisterModel
        const user = userService.register(payload)

        return user.then(u => res.json(u))
    })

    userRouter.post('/login', userRulesSync['forLogin'], (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(422).json(errors.array())

        const payload = matchedData(req) as UserLoginModel
        const token = userService.login(payload)

        return token.then(t => res.json(t))
    })

    return userRouter
}

export const userRouter = createUserRouter()