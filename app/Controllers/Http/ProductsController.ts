import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'
import { logMe } from 'App/Helpers'
import Product from 'App/Models/Product';
export default class ProductsController {

  public async index({ }: HttpContextContract) {
    try {

      const products = await Product.query()
        .orderBy('id', 'desc')

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

      // if(auth.use('api').isAuthenticated()) {
      //   return {ok: false, msg: 'Unauthorized'}
      // }

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
      product.member_price = request.input('member_price')
      product.cv = request.input('cv')
      product.image = {
        asset_id: uploaded.asset_id,
        public_id: uploaded.public_id,
        secure_url: uploaded.secure_url,
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

  public async update({ request }: HttpContextContract) {
    try {

      // if(auth.use('api').isAuthenticated()) {
      //   return {ok: false, msg: 'Unauthorized'}
      // }

      const file = request.input('image')

      // if (!file) return { ok: false, msg: 'Please select an image file for the product.' }


      console.log('Edit Product id, ', request.param('id'))

      // const product = await Product.query()
      // .where('id', request.param('id'))
      // .first()

      const product = await Product.findOrFail(request.param('id'))

      // console.log('Editing product', product)

      var uploaded: any = null

      if (file) {

        if (uploaded?.public_id) {
          await cloudinary.destroy(uploaded.public_id)
        }

        uploaded = await cloudinary.upload(file, file.clientName)

        console.log('New file uploaded, ', uploaded)
        // if (!uploaded) return { ok: false, msg: 'Could not upload file' }
      }

      product.name = request.input('name')
      product.description = request.input('description')
      product.length = request.input('length')
      product.width = request.input('width')
      product.height = request.input('height')
      product.distance_unit = request.input('distance_unit')
      product.weight = request.input('weight')
      product.mass_unit = request.input('mass_unit')
      product.price = request.input('price')
      product.member_price = request.input('member_price')
      product.cv = request.input('cv')

      await product.save()

      if (uploaded) {
        
        product.image = JSON.stringify({
          asset_id: uploaded.asset_id,
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
          url: uploaded.url,
          width: uploaded.width,
          height: uploaded.height,
          folder: uploaded.folder
        })

        await product.save()
      }

      // logMe('uploaded', uploaded)
      // logMe('product', product)

      return { ok: true, product: product }

    } catch (error) {
      logMe('error', error)
      return { ok: false, msg: error.message }
    }

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
