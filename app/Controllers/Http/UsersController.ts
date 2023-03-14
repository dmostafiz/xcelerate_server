// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {

    public async getUsers(): Promise<Object> {
        const users = await User.query()
            .where('user_type', 'user')
            .preload('orders')
            .orderBy('id', 'desc')

        return { ok: true, users }
    }

    public async getRetailUsers(): Promise<Object> {
        const users = await User.query()
            .where('user_type', 'user')
            .where('is_member', false)
            .preload('orders')
            .orderBy('id', 'desc')

        return { ok: true, users }
    }
}
