import { logMe } from "App/Helpers"
import shippo from "App/Setup/shippo";

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

            const rate = trns?.rates?.find((r) => {
                return r.attributes.includes('CHEAPEST') ? r : null
            });

            if(rate){
                console.log('USPS', rate?.servicelevel?.token)
                return rate
            }else{
                shipment.getRate(address, parcel)
            }
           

        } catch (error) {
            logMe('get shipment rates error', error)
        }
    }
}

export default shipment