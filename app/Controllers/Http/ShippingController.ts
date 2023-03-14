import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import Order from 'App/Models/Order'

import shipment from 'App/Modules/shipment'


export default class ShippingController {
  public async rate({ request }: HttpContextContract) {
    try {

      const { country, city, state, street_one, streeet_two, zip_code, cartItems } = request.all()

      const address = { country, city, state, street_one, streeet_two, zip_code }

      // var totalWeight = 0

      var totalWeight = cartItems.reduce((total, current) => {
        return total + (current.weight * current.quantity)
      }, 0)

      console.log('Total weight: ', totalWeight)


      const parcel = {
        length: 6,
        width: 4,
        height: 4,
        distance_unit: "in",
        weight: totalWeight,
        mass_unit: 'oz',
      }
      // console.log('cartItems ',  cartItems)


      // const cart_items = cartItems

      var rate = await shipment.getRate(address, parcel)

      if (rate == undefined || rate == null || typeof rate === undefined) {
        rate = await shipment.getRate(address, parcel)
      }

      return { ok: true, rate: rate }

    } catch (error) {
      logMe('Shipping rate error', error)
      return { ok: false, msg: error.message }
    }
  }

  public async webhooks({ request }: HttpContextContract) {
    try {
      // event transaction_created
      logMe('Webhooks', request.body)

      const order = await Order.query()
        .where('shippo_order_id', 'request.order')
        .first()

      if (order) {
        order.tracking_url = 'request.tracking_url_provider'
        order.tracking_number = 'request.tracking_number'
        order.label_url = 'request.label_url'

        await order.save()
      }

      logMe('shippo order updated', order)

    } catch (error) {
      logMe('Webhook error', error)
    }
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
