import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'
import ShippingAddress from 'App/Models/ShippingAddress'
import shippo from 'App/Setup/shippo'

export default class AddressesController {

  public async defaultAddress({ auth }: HttpContextContract) {

    const address = await ShippingAddress.query()
      .where('user_id', auth.user!.id)
      .where('is_default', true)
      .first()

    // console.log('address', address)

    return { ok: true, address }
  }

  public async myAddresses({ auth }: HttpContextContract) {

    const addresses = await ShippingAddress.query()
      .where('user_id', auth.user!.id)
      .where('is_default', false)

    // console.log('addresses', addresses)


    return { ok: true, addresses }
  }

  public async createAddress({ auth, request }: HttpContextContract) {

    try {

      const { city, country, country_name, state, street_one, street_two, zip_code } = request.all()

      const newAddress = await ShippingAddress.create({
        city: city,
        country: country,
        country_name: country_name,
        state: state,
        street_one: street_one,
        street_two: street_two,
        zip_code: zip_code,
        user_id: auth.user!.id,
        is_default: false,
      })

      return { ok: true, address: newAddress }

    } catch (error) {
      logMe('Create Address Error', error)
      return { ok: false, msg: error.message }
    }

  }

  public async updateDefault({ auth, request }: HttpContextContract) {

    try {

      const { addressId } = request.all()

      console.log('Update Default Address', addressId)

      const updateAddress = await ShippingAddress.query()
        .where('user_id', auth.user!.id)
        .where('is_default', true)
        .first()

      if (updateAddress) {
        updateAddress.is_default = false
        await updateAddress.save()
      }


      const address = await ShippingAddress.query()
        .where('user_id', auth.user!.id)
        .where('id', addressId)
        .first()

      if (address) {
        address.is_default = true
        await address.save()
      }

      return { ok: true, address }

    } catch (error) {
      logMe('Create Address Error', error)
      return { ok: false, msg: error.message }
    }

  }

  public async verifyAddress({ request }: HttpContextContract) {

    try {

      const { } = request.all()

      const address = await shippo.address.create({
        "name": "Shawn Ippotle",
        "company": "Shippo",
        "street1": "3294 9th Ave",
        "city": "Lethbridge",
        "state": "Alberta",
        "zip": "T1J2J7",
        "country": "CA",
        "email": "shippotle@goshippo.com",
        "validate": true
      })


      logMe('Verify Address', address)

      return { ok: true, address }

    } catch (error) {
      logMe('Verify Address Error', error)
      return { ok: false, msg: error.message }
    }

  }

  public async removeAddress({ auth, request }: HttpContextContract) {

    try {

      const { addressId } = request.all()

      const address = await ShippingAddress.query()
      .where('user_id', auth.user!.id)
      .where('id', addressId)
      .first()

      address?.delete()

      console.log('Address Removed', address)

      return { ok: true, address }

    } catch (error) {
      logMe('Remove Address Error', error)
      return { ok: false, msg: error.message }
    }

  }

  public async destroy({ }: HttpContextContract) { }
}
