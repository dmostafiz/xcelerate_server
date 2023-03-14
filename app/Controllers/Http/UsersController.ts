import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";
import matrix from 'App/Modules/matrix';
import sponsor from 'App/Modules/sponsor';

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

    public async getMatrixTree({auth}: HttpContextContract ): Promise<Object> {

        const userId = auth.user!.id

        const user = await User.findOrFail(userId)

        const userMatrix = await matrix.getUserMatrix(user)

        return userMatrix!
    }

    public async getSponsorTree({auth}: HttpContextContract ): Promise<Object> {

        const userId = auth.user!.id

        const user = await User.findOrFail(userId)

        const sponsorTree = await sponsor.getSponsorTree(user)

        return sponsorTree!
    }
}
