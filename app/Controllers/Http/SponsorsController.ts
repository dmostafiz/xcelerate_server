import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import User from 'App/Models/User'

export default class SponsorsController {
  public async validate({ request, auth }: HttpContextContract) {

    try {

      const user = await User.query()
        .where('username', request.params().username)
        .first()

        if(!user) return {ok:false, msg: 'Invalid sponsor username'}
        if(user.username == auth?.user?.username) return {ok:false, msg: 'You can\'t sponsor yourself'}

        return {ok:true, user}

    } catch (error) {
      logMe('try catch', error)
      return { ok: false }
    }

  }

  public async create({ }: HttpContextContract) { }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
