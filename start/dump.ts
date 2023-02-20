import Route from '@ioc:Adonis/Core/Route';
import { UserFactory } from 'Database/factories'

Route.group(() => {
    Route.get('/users', async () => {
      const users = await UserFactory.with('shippings', 1).createMany(10)
  
      return users
    })
  })
  .prefix('/dump')