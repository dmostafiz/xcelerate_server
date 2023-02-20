import Route from '@ioc:Adonis/Core/Route'
import './routes/authRoutes'
import './dump'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/users', 'UsersController.getUsers')



