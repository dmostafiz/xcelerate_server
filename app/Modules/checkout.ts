import { logMe } from "App/Helpers"
import User from "App/Models/User"
import stripe from "App/Setup/stripe"

const checkout = {

  stripePay: async (paymentMethod, subTotal: number, user: User) => {

    try {
      // console.log('Payment method: ', paymentMethod)
      // console.log('subTotal: ', total)
      var customer_id = user.stripe_customer_id

      if (!user.stripe_customer_id) {

        const customer = await stripe.customers.create({
          name: user?.full_name,
          email: user?.email,
          payment_method: paymentMethod,
          invoice_settings: {
            default_payment_method: paymentMethod
          }
        })

        customer_id = customer.id

        user.stripe_customer_id = customer.id

        await user.save()

      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(subTotal * 100),
        currency: 'usd',
        customer: customer_id,
        // automatic_payment_methods: {enabled: true},
        receipt_email: user.email,
        payment_method: paymentMethod,
        confirm: true
      });

      // logMe('paymentIntent', paymentIntent)

      if (paymentIntent.status === 'succeeded') {

        return { ok: true, paymentIntent: paymentIntent }

      } else {

        return { ok: false }
      }

    } catch (error) {

      logMe('Order place error', error)
      return { ok: false, msg: error.message }
    }

  }

}

export default checkout;