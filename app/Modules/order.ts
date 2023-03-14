import { logMe } from "App/Helpers"
import Order from "App/Models/Order"
import OrderItem from "App/Models/OrderItem"
import Product from "App/Models/Product"
import ShippingAddress from "App/Models/ShippingAddress"
import User from "App/Models/User"

const order = {
    getPrice: function (product: Product, user: User): number {

        try {
            var price = 0

            if (user.is_member) {
                price = product.member_price
            } else {
                price = product.price
            }

            return price

        } catch (error) {
            logMe('Module order.getPrice error: ', error.message)
            return 0
        }

    },

    orderTotal: async function (cartItems, user: User): Promise<number> {

        try {
            return await cartItems.reduce(async (total: number, item: any) => {
                const product = await Product.findOrFail(item.id)
                return await total + (order.getPrice(product, user) * item.quantity)
            }, 0)

        } catch (error) {
            logMe('Module order.orderTotal error: ', error.message)
            return 0
        }
    },

    storeOrder: async function (cartItems, address: ShippingAddress, user: User, tax: number, shippingCost: number) {
        try {

            const orderTotal = await order.orderTotal(cartItems, user)

            // if (orderTotal === 0) {
            //     return { ok: false }
            // }

            const newOrder = new Order()
            newOrder.user_id = user.id
            newOrder.address_id = address.id
            newOrder.order_total = orderTotal + tax + shippingCost
            newOrder.cart_total = orderTotal
            newOrder.tax = tax
            newOrder.shipping_cost = shippingCost

            if(user!.orders?.length){
               newOrder.is_first = false
            }else{
               newOrder.is_first = true
            }

            await newOrder.save()
            // var subTotal = orderTotal + parseFloat(tax) + parseFloat(shippingCost)

            const orderItems = await Promise.all(cartItems.map(async (item) => {
                const product = await Product.findOrFail(item.id)
                const orderItem = new OrderItem()
                orderItem.user_id = user.id
                orderItem.order_id = newOrder.id
                orderItem.product_id = product.id
                orderItem.quantity = item.quantity
                orderItem.unit_price = order.getPrice(product, user)
                await orderItem.save()
                return orderItem
            }))

            logMe('Module order.storeOrder orderItems: ', orderItems.length)

            return newOrder

        } catch (error) {
            logMe('Module order.storeOrder error: ', error.message)
        }
    }
}

export default order;