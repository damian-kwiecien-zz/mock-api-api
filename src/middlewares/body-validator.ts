import { validationResult } from 'express-validator/check'
import { Request, Response, NextFunction } from 'express'
import { Result } from 'express-validator/shared-typings'

const mapResultToErrors = (result) => {
    return result.array().reduce((err1, err2) => {
        const param = err2.param
        let errors = err1[param]

        if (errors)
            return { ...err1, [param]: [...errors, err2.msg] }
        else
            return { ...err1, [param]: [err2.msg] }
    }, {})

}

export const bodyValidator = () => (req: Request, res: Response, next: NextFunction): any => {
    const result = validationResult(req)

    if (!result.isEmpty()) {
        const errors = mapResultToErrors(result)
        return res.status(422).json(errors)
    }

    next()
}