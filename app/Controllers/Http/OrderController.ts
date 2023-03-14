import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
// import Order from 'App/Models/Order'
// import Product from 'App/Models/Product'
import ShippingAddress from 'App/Models/ShippingAddress'
import User from 'App/Models/User'
import checkout from 'App/Modules/checkout'
import order from 'App/Modules/order'
import shipment from 'App/Modules/shipment'
import commission from 'App/Modules/commission'
import Order from 'App/Models/Order'

// import stripe from 'App/Setup/stripe'

export default class OrderController {

  public async placeOrder({ auth, request }: HttpContextContract) {

    try {

      const {
        paymentMethod,
        cartItems,
        tax,
        shippingCost,
        addressId
      } = request.all()

      console.log('Tax: ' + tax)
      console.log('ShippingCost: ' + shippingCost)

      const user = await User.query()
        .preload('orders')
        .where('id', auth.user!.id)
        .first()

      const orderTotal = await order.orderTotal(cartItems, user!)

      if (orderTotal === 0) {
        return { ok: false }
      }

      var subTotal = orderTotal + parseFloat(tax) + parseFloat(shippingCost)

      // console.log('Final Total', subTotal)

      // Complete the order payment
      const checkoutData = await checkout.stripePay(paymentMethod, subTotal, user!)

      if (checkoutData?.ok) {

        // logMe('Checkout successful', checkoutData)
        const shippingAddress = await ShippingAddress.query()
          .where('user_id', user!.id)
          .where('id', addressId)
          .first()

        // Create the order
        const newOrder = await order.storeOrder(cartItems, shippingAddress!, user!, parseFloat(tax), parseFloat(shippingCost))

        // logMe('New order created, ', newOrder)

        await shipment.parseShipment(user!, shippingAddress!, newOrder!)

        await commission.initOrderCommission(newOrder!, user!)

        return { ok: true, paymentIntent: checkoutData.paymentIntent }

      } else {
        return { ok: false }
      }

    } catch (error) {
      logMe('Controller OrderController.placeOrder', error)
      return { ok: false, msg: error.message }
    }

  }

  public async success({ request }: HttpContextContract) {

    return { request: request.all() }

  }

  public async getUserOrders({ auth }: HttpContextContract) {
    try {

      const orders = await Order.query()
        .preload('order_items')
        .preload('address')
        .where('user_id', auth.user!.id)
        .orderBy('id', 'desc')

      return { ok: true, orders: orders }


    } catch (error) {
      logMe('Controller OrderController.getUserOrders', error)
      return { ok: false, msg: error.message }
    }
  }

  public async getAllOrders({ }: HttpContextContract) {
    try {

      const orders = await Order.query()
        .preload('order_items')
        .preload('address')
        .preload('user')
        .orderBy('id', 'desc')

        logMe('Admin Orders', orders.length)

      return { ok: true, orders: orders }

    } catch (error) {
      logMe('Controller OrderController.getUserOrders', error)
      return { ok: false, msg: error.message }
    }
  }

  public async getOrderDetails({ request }: HttpContextContract) {
    try {

      const order = await Order.query()
        .where('id', request.param('id'))
        .preload('order_items', (orderItems) => {
          orderItems.preload('product')
        })
        .preload('address')
        .first()

      // logMe('Order Details', request.param('id'))

      return { ok: true, order: order }

    } catch (error) {
      logMe('Controller OrderController.getOrderDetails', error)
      return { ok: false, msg: error.message }
    }
  }


  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
