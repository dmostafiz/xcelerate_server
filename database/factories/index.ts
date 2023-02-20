import Factory from '@ioc:Adonis/Lucid/Factory'
import ShippingAddress from 'App/Models/ShippingAddress'
import User from 'App/Models/User'

export const PostFactory = Factory
    .define(ShippingAddress, ({ faker }) => {
        return {
            street_one: faker.address.streetAddress(),
            street_two: faker.address.streetAddress(),
            country: faker.address.country(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip_code: faker.address.zipCode(),
        }
    })
    .build()

export const UserFactory = Factory
    .define(User, ({ faker }) => {
        return {
            username: faker.internet.userName(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: 'password',
            avatar: faker.image.avatar(),

            //Contact
            phone_num: faker.phone.phoneNumber(),

            //Address
            street_one: faker.address.streetAddress(),
            street_two: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            country: faker.address.country(),
            zip_code: faker.address.zipCode(),
        }
    })
    .relation('shippings', () => PostFactory) // 👈
    .build()