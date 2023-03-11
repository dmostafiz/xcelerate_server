import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
// import stripe from 'App/Setup/stripe'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import ShippingAddress from 'App/Models/ShippingAddress';
export default class AuthController {

    public async register({ request, auth }: HttpContextContract): Promise<Object> {

        try {

            // logMe('Request body', request.all())
            const user = new User();
            user.ref_by = request.input('sponsor').id
            user.first_name = request.input('first_name')
            user.last_name = request.input('last_name')
            user.email = request.input('email')
            user.username = request.input('username')
            user.password = request.input('password')
            user.street_one = request.input('street_one')
            user.street_two = request.input('street_two')
            user.country = request.input('country')
            user.state = request.input('state')
            user.city = request.input('city')
            user.zip_code = request.input('zip_code')
            user.phone_num = `+${request.input('dial')} ${request.input('phone_number')}`
            user.zip_code = request.input('zip_code')

            await user.save()

            const shipping = new ShippingAddress()
            shipping.user_id = user.id
            shipping.street_one = user.street_one
            shipping.street_two = user.street_two
            shipping.city = user.city
            shipping.state = user.state
            shipping.zip_code = user.zip_code
            shipping.country = user.country
            shipping.is_default = true
            await shipping.save()

            // const customer = await stripe.customers.create({
            //     name: user.full_name,
            //     email: user.email,
            //     phone: user.phone_num,
            //     description: user.country,
            // });

            // user.stripe_customer_id = customer.id
            // await user.save()

            const token = await auth.use('api').generate(user)

            logMe('User registered', token.token)

            return { ok: true, token: token.token }

        } catch (error) {
            logMe('User registration failed', error)
            return { ok: false }
        }
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

    public async checkUsernameExists({ request }: HttpContextContract): Promise<string | Object> {

        const username = request.input('username')

        try {

            // Lookup user manually
            const user = await User
                .query()
                .where('user_type', 'user')
                .where('username', username)
                .firstOrFail()

            return { ok: true, user }

        } catch {
            return { ok: false }
        }
    }

    public async checkEmailExists({ request }: HttpContextContract): Promise<string | Object> {

        const email = request.input('email')

        try {

            // Lookup user manually
            const user = await User
                .query()
                .where('user_type', 'user')
                .where('email', email)
                .firstOrFail()

            return { ok: true, user }

        } catch {
            return { ok: false }
        }
    }

    public async checkPhoneExists({ request }: HttpContextContract): Promise<string | Object> {

        const phone_number = request.input('phone_number')

        try {

            // Lookup user manually
            const user = await User
                .query()
                .where('user_type', 'user')
                .where('phone_num', phone_number)
                .firstOrFail()

            return { ok: true, user }

        } catch {
            return { ok: false }
        }
    }
}
