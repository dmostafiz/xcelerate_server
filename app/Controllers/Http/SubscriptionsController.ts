import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import Subscription from 'App/Models/Subscription'
import User from 'App/Models/User'
import matrix from 'App/Modules/matrix'
import stripe from 'App/Setup/stripe'
import Stripe from 'stripe'


export default class SubscriptionsController {

    public async subscribeAffiliateMembership({ request, auth }: HttpContextContract) {

        try {

            const { paymentMethod } = request.all()

            const user = await User.findOrFail(auth.user?.id)

            console.log('Payment method', paymentMethod)

            var customer_id = user.stripe_customer_id

            if (!user.stripe_customer_id) {

                const customer = await stripe.customers.create({
                    name: auth.user?.full_name,
                    email: auth.user?.email,
                    payment_method: paymentMethod,
                    invoice_settings: {
                        default_payment_method: paymentMethod
                    }
                })
                customer_id = customer.id
                user.stripe_customer_id = customer.id
                await user.save()
            }


            const subscription20 = await stripe.subscriptions.create({
                customer: customer_id,
                items: [
                    { price: 'price_1MiOCgJIHTD5Xjxgl1iNZYcs' },
                ],

                payment_settings: {
                    // payment_method_options: ["card"],
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription'
                },

                expand: ["latest_invoice.payment_intent"]
            });

            const subs20 = await Subscription.query()
                .where('user_id', user.id)
                .where('type', 'month')
                .where('member_type', 'affiliate_member')
                .first();

            if (!subs20) {
                await Subscription.create({
                    user_id: user.id,
                    stripe_sub_id: subscription20.id,
                    amount: 20,
                    type: 'month',
                    member_type: 'affiliate_member'
                })
            } else {
                subs20.stripe_sub_id = subscription20.id
                await subs20.save();
            }

            const subscription40 = await stripe.subscriptions.create({
                customer: customer_id,
                items: [
                    { price: 'price_1MiOCgJIHTD5XjxgiqYEqOkL' },
                ],

                payment_settings: {
                    // payment_method_options: ["card"],
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription'
                },

                expand: ["latest_invoice.payment_intent"]
            });

            const subs40 = await Subscription.query()
                .where('user_id', user.id)
                .where('type', 'year')
                .where('member_type', 'affiliate_member')
                .first();

            if (!subs40) {
                await Subscription.create({
                    user_id: user.id,
                    stripe_sub_id: subscription40.id,
                    amount: 40,
                    type: 'year',
                    member_type: 'affiliate_member'
                })
            } else {
                subs40.stripe_sub_id = subscription40.id
                await subs40.save();
            }

            await this.cancelOnlyMemberExtendedFunction(auth)

            user.is_affiliate = true
            user.is_member = true
            await user.save()

            const invoice1 = subscription20.latest_invoice as Stripe.Invoice;
            const intent1 = invoice1.payment_intent as Stripe.PaymentIntent

            const invoice2 = subscription40.latest_invoice as Stripe.Invoice;
            const intent2 = invoice2.payment_intent as Stripe.PaymentIntent

            // Place subscriber to matrix
            await matrix.placeIntoMatrix(user)

            return {
                ok: true,
                clientSecret20: intent1.client_secret,
                clientSecret40: intent2.client_secret
            }

        } catch (error) {
            logMe('Stripe error', error)
            return { ok: false, msg: error.message }
        }
    }

    public async subscribeOnlyMembership({ request, auth }: HttpContextContract) {

        try {

            const { paymentMethod } = request.all()

            const user = await User.findOrFail(auth.user?.id)

            console.log('Payment method', paymentMethod)

            var customer_id = user.stripe_customer_id

            if (!user.stripe_customer_id) {

                const customer = await stripe.customers.create({
                    name: auth.user?.full_name,
                    email: auth.user?.email,
                    payment_method: paymentMethod,
                    invoice_settings: {
                        default_payment_method: paymentMethod
                    }
                })
                customer_id = customer.id
                user.stripe_customer_id = customer.id
                await user.save()
            }


            const subscription = await stripe.subscriptions.create({
                customer: customer_id,
                items: [
                    { price: 'price_1MjSjyJIHTD5XjxgAMyGEZXy' },
                ],

                payment_settings: {
                    // payment_method_options: ["card"],
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription'
                },

                expand: ["latest_invoice.payment_intent"]
            });

            const subs = await Subscription.query()
                .where('user_id', user.id)
                .where('type', 'month')
                .where('member_type', 'only_member')
                .first();

            if (!subs) {
                await Subscription.create({
                    user_id: user.id,
                    stripe_sub_id: subscription.id,
                    amount: 10,
                    type: 'month',
                    member_type: 'only_member'
                })
            } else {
                subs.stripe_sub_id = subscription.id
                await subs.save();
            }


            user.is_member = true
            user.is_affiliate = false

            await user.save()

            const invoice = subscription.latest_invoice as Stripe.Invoice;
            const intent = invoice.payment_intent as Stripe.PaymentIntent

            return {
                ok: true,
                clientSecret: intent.client_secret,
            }

        } catch (error) {
            logMe('Stripe error', error)
            return { ok: false, msg: error.message }
        }
    }

    public async cancelAffiliateMember({ auth }: HttpContextContract) {
        try {

            const subscriptions = await Subscription.query()
                .where('user_id', auth.user!.id)
                .where('member_type', 'affiliate_member')

            await Promise.all(
                subscriptions.map(async subscription => {
                    await stripe.subscriptions.del(
                        subscription.stripe_sub_id,
                    );
                })
            )

            // logMe('Subscription canceled', subscriptions)

            const user = await User.findOrFail(auth.user!.id)
            user.is_member = false
            user.is_affiliate = false
            await user.save()

            return { ok: true, user }

        } catch (error) {
            return { ok: false }
        }
    }

    public async cancelOnlyMember({ auth }: HttpContextContract) {
        return await this.cancelOnlyMemberExtendedFunction(auth)
    }

    public async customer({ auth }: HttpContextContract) {

        const user = await User.findOrFail(auth.user?.id)
        const customer = await stripe.customers.retrieve(
            user.stripe_customer_id,
            {
                expand: ['subscriptions']
            }
        );

        // var subscriptions = []

        const subs = await Subscription.query()
            .where('user_id', user.id)

        const subscriptions = await Promise.all(subs.map(async (sub) => {

            const subscription = await stripe.subscriptions.retrieve(
                sub.stripe_sub_id,
            );

            return { stripe_data: subscription, subscription: sub }

        }))

        // subscriptions.then((data) => {

        // })

        // logMe('subscriptions', subscriptions)

        return { ok: true, customer, subscriptions }
    }

    private async cancelOnlyMemberExtendedFunction(auth: AuthContract) {
        try {

            const subscriptions = await Subscription.query()
                .where('user_id', auth.user!.id)
                .where('member_type', 'only_member')

            await Promise.all(
                subscriptions.map(async subscription => {
                    await stripe.subscriptions.del(
                        subscription.stripe_sub_id,
                    );
                })
            )

            // logMe('Subscription canceled', subscriptions)

            const user = await User.findOrFail(auth.user!.id)
            user.is_member = false
            await user.save()

            return { ok: true, user }

        } catch (error) {
            logMe('Subscription cancel error', error.message)
            return { ok: false }
        }
    }
}
