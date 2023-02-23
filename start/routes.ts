import Route from '@ioc:Adonis/Core/Route'
import './routes/authRoutes'
import './dump'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/users', 'UsersController.getUsers')

Route.group(() => {
  Route.resource('product', 'ProductsController').apiOnly()
  Route.put('product/:id/status', 'ProductsController.updateProductStatus')

}).middleware('admin')


Route.group(() => {
  Route.get('/products', 'ShopsController.index')
}).prefix('/shop')

