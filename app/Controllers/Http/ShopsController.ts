import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import Product from 'App/Models/Product'

export default class ShopsController {
  public async index({}: HttpContextContract) {
    try {

      const products = await Product.query()

      return { ok: true, products: products }

    } catch (error) {

      logMe('error', error)

      return { ok: false, msg: error.message }

    }


  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
