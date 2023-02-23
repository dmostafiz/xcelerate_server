import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'
import { logMe } from 'App/Helpers'
import Product from 'App/Models/Product';
export default class ProductsController {
  public async index({ }: HttpContextContract) {
    try {

      const products = await Product.query()

      return { ok: true, products: products }

    } catch (error) {

      logMe('error', error)

      return { ok: false, msg: error.message }

    }

  }

  // public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {

    // logMe('product body', request.file('image'))

    try {

      const file = request.input('image')

      if (!file) return { ok: false, msg: 'Please select an image file for the product.' }

      const uploaded = await cloudinary.upload(file, file.clientName)

      if (!uploaded) return { ok: false, msg: 'Could not upload file' }

      const product = new Product()
      product.name = request.input('name')
      product.description = request.input('description')
      product.length = request.input('length')
      product.width = request.input('width')
      product.height = request.input('height')
      product.distance_unit = request.input('distance_unit')
      product.weight = request.input('weight')
      product.mass_unit = request.input('mass_unit')
      product.price = request.input('price')
      product.cv = request.input('cv')
      product.image = {
        asset_id: uploaded.asset_id,
        public_id: uploaded.public_id,
        secure_url: uploaded.url,
        url: uploaded.url,
        width: uploaded.width,
        height: uploaded.height,
        folder: uploaded.folder
      }

      await product.save()

      logMe('uploaded', uploaded)
      logMe('product', product)

      return { ok: true, product: product }

    } catch (error) {

      logMe('error', error)

      return { ok: false, msg: error.message }

    }


  }

  public async show({ }: HttpContextContract) { }

  // public async edit({}: HttpContextContract) {}

  public async update({ }: HttpContextContract) {
  }

  public async updateProductStatus({ request }: HttpContextContract) {

    try {

      // console.log(request.params().id);
      const product = await Product.findOrFail(request.params().id)
      product.status = !product.status
      await product.save()

      return { ok: true, product }

    } catch (error) {

      logMe('error', error)

      return { ok: false, msg: error.message }
    }
  }

  public async destroy({ }: HttpContextContract) { }
}
