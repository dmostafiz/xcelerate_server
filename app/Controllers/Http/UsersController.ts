// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

export default class UsersController {

    public async getUsers(): Promise<Object> {
        const users = await User.query()
            .where('user_type', 'user')

        return { ok: true, users }
    }
}
