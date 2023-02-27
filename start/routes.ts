import Route from '@ioc:Adonis/Core/Route'
import './routes/authRoutes'
import './dump'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.get('/users', 'UsersController.getUsers')

Route.group(() => {
  Route.resource('product', 'ProductsController').apiOnly()
  Route.put('product/:id/status', 'ProductsController.updateProductStatus')

}).middleware('admin')


Route.group(() => {
  Route.get('/products', 'ShopsController.index')
}).prefix('/shop')

Route.group(() => {
  Route.get('/validate/:username', 'SponsorsController.validate')
}).prefix('/sponsor')

Route.group(() => {
  Route.get('/', 'UsersController.getUsers')
}).prefix('/users')

Route.group(() => {
  Route.post('/calculate', 'CommissionsController.calculate')
}).prefix('/commission')
