import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import stripe from 'App/Setup/stripe'

export default class StripeController {


    public async webhook({ request }: HttpContextContract) {
        const endpointSecret = "whsec_5cddf44bb4b6db2bf58eeeafb445d2b8ff4f50bd4fa0052cd9fb8536197c5a40";

        const sig = request.headers()['stripe-signature'];

        // logMe('Stripe signature, ', sig)
        // logMe('Stripe requet, ', request.raw())


        let event

        try {
            event = stripe.webhooks.constructEvent(request.raw()!.toString(), sig!.toString(), endpointSecret);
        } catch (err) {
            logMe('Stripe event error, ', err.message)
            return { ok: false, msg: `Webhook Error: ${err.message}` }
        }

        
        // invoice.payment_succeeded
        // customer.subscription.created
        
        logMe('Stripe event type, ', event.type)
        logMe('Stripe event, ', event.data.object)
    }

}
