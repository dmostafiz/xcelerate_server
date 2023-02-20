import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
export default class AuthController {

    public async register({ }: HttpContextContract): Promise<void> {

    }

    public async login({ auth, request }: HttpContextContract): Promise<string | Object> {

        const email = request.input('username')
        const password = request.input('password')
        const user_type = request.input('user_type')
        console.log(email, password, user_type)

        try {

            // Lookup user manually
            const user = await User
                .query()
                .where('user_type', user_type)
                .where((query) => {
                    query
                        .where('email', email)
                        .orWhere('username', email)
                })
                .firstOrFail()

            // Verify password
            if (!user || !(await Hash.verify(user.password, password))) {
                return { ok: false, msg: 'Invalid credentials' }
            }

            // logMe('Logged in user', user)

            // Generate token
            const token = await auth.use('api').generate(user)

            return { ok: true, token: token.token }

        } catch {
            return { ok: false, msg: 'Invalid credentials' }
        }
    }

    public async authenticate({ auth }: HttpContextContract) {
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
