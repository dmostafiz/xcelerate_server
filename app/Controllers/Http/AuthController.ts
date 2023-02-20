import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
// import User from 'App/Models/User'

export default class AuthController {

    public async register({ }: HttpContextContract): Promise<void> {

    }

    public async login({ auth, request }: HttpContextContract): Promise<string | Object> {

        const email = request.input('username')
        const password = request.input('password')

        console.log(email, password)

        try {

            const token = await auth.attempt(email, password)


            logMe('token', token, false)

            return { ok: true, token: token.token }

        } catch {
            return { ok: false, msg: 'Invalid credentials' }
        }
    }

    public async authenticate({ auth }: HttpContextContract){
        try {

            await auth.authenticate()
            logMe('auth user', auth.user, false)

            return { ok: true, user: auth.user }

        } catch (error) {
            logMe('authorisation error', error)
            return { ok: false }
        }
    }

    public async logout({ auth }: HttpContextContract): Promise<Object> {
        await auth.use('api').revoke()

        logMe('logout', 'true')

        return { ok: true }
    }
}
