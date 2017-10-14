import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { connection } from '../instances'
import { User, UserRegisterModel, UserLoginModel } from '../entities/user'

export class UserService {
    private readonly _saltRounds = 12
    private readonly _jwtSecret = '0.rfyj3n9nzh'
    private readonly _userRepo = connection.then(c => c.getRepository(User))

    static get userAttributes() {
        return ['id', 'email']
    }

    private static _user
    static get user() {
        return UserService._user
    }

    async register({ email, password }: UserRegisterModel) {
        const hash = await bcrypt.hash(password, this._saltRounds)
        const userRepoSync = await this._userRepo

        return userRepoSync.create({ email, password: hash })
    }

    async login({ email }: UserLoginModel) {
        const userRepoSync = await this._userRepo
        const user = await userRepoSync.findOne({ where: { email } })

        const { id } = user

        return { token: jwt.sign({ id, email }, this._jwtSecret) }
    }

    verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._jwtSecret, (err, decoded) => {
                if (err) {
                    resolve(false)
                    return
                }

                UserService._user = this._userRepo.then(r => r.findOneById(decoded['id']))
                resolve(true)
                return
            })
        }) as Promise<boolean>
    }
}