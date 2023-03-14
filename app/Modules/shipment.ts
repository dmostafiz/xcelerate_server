import { logMe } from "App/Helpers"
import Order from "App/Models/Order";
import OrderItem from "App/Models/OrderItem";
import Product from "App/Models/Product";
import ShippingAddress from "App/Models/ShippingAddress";
import User from "App/Models/User";
import shippo from "App/Setup/shippo";
import axios from "axios";
import order from "./order"

const shipment = {

    getRate: async function (address, parcel) {
        try {
            // logMe('Parcel', parcel)

            var addressFrom = {
                "name": "Ms Hippo",
                "company": "Shippo",
                "street1": "215 Clayton St.",
                "city": "San Francisco",
                "state": "CA",
                "zip": "94117",
                "country": "US", //iso2 country code
                "phone": "+1 555 341 9393",
                "email": "support@goshippo.com",
            };

            // example address_to object dict
            var addressTo = {
                "name": "Ms Hippo",
                "company": "Shippo",
                "street1": address?.street1,
                "city": address?.city,
                "state": address?.state,
                "zip": address?.zip_code,
                "country": address?.country, //iso2 country code
                "phone": "+1 555 341 9393",
                "email": "support@goshippo.com",
            };

            // console.log('addressTo, ', addressTo)

            // var shipment = {
            //     "address_from": addressFrom,
            //     "address_to": addressTo,
            //     "parcels": parcels,
            // };

            const trns = await shippo.shipment.create({
                // "shipment": shipment,
                "servicelevel_token": process.env.SHIPPO_API_SERVICELEVEL_TOKEN,
                // "carrier_account": process.env.SHIPPO_API_CARRIER_ACCOUNT,
                // "label_file_type": "png"
                "address_from": addressFrom,
                "address_to": addressTo,
                "parcels": [parcel],
                "async": true
            })

            // console.log('Shippo transaction created', trns?.rates);

            var rate = trns?.rates?.find((r) => {
                return r.attributes.includes('CHEAPEST') ? r : null
            });

            if (rate == undefined || rate == null || typeof rate === undefined) {
                console.log('Rate not found: ', rate)
                rate = await shipment.getRate(address, parcel)
            } else {
                console.log('USPS', rate?.servicelevel?.token)
                return rate
            }


        } catch (error) {
            logMe('get shipment rates error', error)
        }
    },

    parseShipment: async function (user: User, address: ShippingAddress, orderObj: Order) {

        try {

            const orderItems = await OrderItem.query()
                .where('order_id', orderObj.id)
                .where('user_id', user.id)

            console.log('orderItems for shipment ', orderItems?.length)

            var addressFrom = {
                "name": "Ms Hippo",
                "company": "Shippo",
                "street1": "215 Clayton St.",
                "city": "San Francisco",
                "state": "CA",
                "zip": "94117",
                "country": "US", //iso2 country code
                "phone": "+1 555 341 9393",
                "email": "support@goshippo.com",
            };

            // example address_to object dict
            var addressTo = {
                "name": user.full_name,
                "street1": address?.street_one,
                "city": address?.city,
                "state": address?.state,
                "zip": address?.zip_code,
                "country": address?.country, //iso2 country code
                "phone": user.phone_num,
                "email": user.email,
            };

            var totalWeight = 0

            const line_items = await Promise.all(orderItems.map(async (item) => {

                const product = await Product.findOrFail(item.product_id)

                totalWeight += item.quantity * product.weight

                return {
                    "currency": "USD",
                    "manufacture_country": "US",
                    "quantity": item.quantity,
                    "sku": product.id,
                    "title": product.name,
                    "total_price": order.getPrice(product, user),
                    "weight": product.weight,
                    "weight_unit": product.mass_unit,
                }

            }))

            // console.log('Shippo line items', line_items)

            const shipmentData = {
                "currency": "USD",
                "notes": "Order for " + user.full_name,
                "order_number": `#${orderObj.id}`,
                "order_status": "PAID",
                "placed_at": new Date(),
                "shipping_cost": orderObj.shipping_cost,
                "shipping_cost_currency": "USD",
                "shipping_method": "USPS First Class Package",
                "subtotal_price": orderObj.order_total,
                "total_price": orderObj.order_total,
                "total_tax": orderObj.tax,
                "weight": totalWeight,
                "weight_unit": "oz",
                "from_address": addressFrom,
                "to_address": addressTo,
                "line_items": line_items
            }


            // const transactions = await shippo.transaction.create({
            //     "shipment": shipmentData,
            //     "servicelevel_token": process.env.SHIPPO_API_SERVICELEVEL_TOKEN,
            //     "carrier_account": process.env.SHIPPO_API_CARRIER_ACCOUNT,
            //     "label_file_type": "pdf"
            // })

            // console.log("shipmentData, ", shipmentData)

            const res = await axios.post('https://api.goshippo.com/orders', shipmentData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "ShippoToken " + process.env.SHIPPO_API_KEY
                }
            })

            // const trans = await shippo.transaction.create({
            //     "rate": rate.object_id,
            //     "label_file_type": "PDF",
            //     "async": false
            // });

            // logMe('Shippo Order response', res?.data)

            if (res?.data) {
                orderObj.shippo_order_id = res?.data?.object_id
                orderObj.shippo_address_id = res?.data?.to_address?.object_id
                orderObj.shippo_order_number = res?.data?.order_number
                await orderObj.save()
            }

        } catch (error) {

            logMe('Module shipment.parseShipment error', error.message)

        }



        // console.log('Shippo transactions ', transactions)

        // return transactions
    }
}

export default shipment