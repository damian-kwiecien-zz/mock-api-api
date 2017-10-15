import * as bcrypt from 'bcrypt'
import { check } from 'express-validator/check'
import { User } from '../entities/user'
import { connection } from '../instances'

const userRulesCreator = async () => {
    const connectionSync = await connection
    const userRepo = connectionSync.getRepository(User)

    return {
        forRegister: [
            check('email')
                .isEmail().withMessage('Invalid email format')
                .custom(email => userRepo.findOne({ where: { email } }).then(u => !!!u)).withMessage('Email exists'),
            check('password')
                .isLength({ min: 8 }).withMessage('Invalid password'),
            check('confirmPassword')
                .custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
        ],
        forLogin: [
            check('email')
                .isEmail().withMessage('Invalid email format')
                .custom(email => userRepo.findOne({ where: { email } }).then(u => !!u)).withMessage('Invalid email or password'),
            check('password')
                .custom((password, { req }) => {
                    return userRepo.findOne({ where: { email: req.body.email } })
                        .then(u => bcrypt.compare(password, u!.password))
                }).withMessage('Invalid email or password')
        ],
        forCheck: [
            check('token').exists().withMessage('Token is required')
        ]
    }
}

export const userRules = userRulesCreator()