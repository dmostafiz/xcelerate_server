import CommissionAmount from "App/Models/CommissionAmount"
import Order from "App/Models/Order"
import OrderItem from "App/Models/OrderItem"
import User from "App/Models/User"

const commission = {

    initOrderCommission: async function (order: Order, user: User) {
        const orderItems = await OrderItem.query()
            .preload('product')
            .where("order_id", order.id)

        const commissionValue = orderItems.reduce((total, item) => {
            return total + (item.product.cv * item.quantity)
        }, 0)

        console.log('Total commission value: ', commissionValue)
        // ca == commission amount
        const ca = new CommissionAmount()
        ca.amount = commissionValue
        ca.user_id = user.id
        ca.order_id = order.id
        ca.is_completed = false

        if(user!.is_affiliate){
            ca.is_matrix = true
        }else{
            ca.is_matrix = false
        }

        if (user!.orders?.length) {
            ca.is_first = false
        } else {
            ca.is_first = true
        }

        await ca.save()

        console.log('commission: ', ca)

        return ca
    }

}

export default commission