import Route from '@ioc:Adonis/Core/Route'
import './routes/authRoutes'
import './dump'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.get('/users', 'UsersController.getUsers')

Route.group(() => {

  Route.resource('product', 'ProductsController')
  .apiOnly()
  .middleware({
    store: ['auth', 'admin'],
    update: ['auth', 'admin'],
  })

  Route.put('/product/:id/status', 'ProductsController.updateProductStatus')
  
}).middleware('admin')

Route.group(() => {

  Route.get('/orders', 'OrderController.getAllOrders')

}).middleware('admin').prefix('admin')




Route.group(() => {
  Route.get('/products', 'ShopsController.index')
}).prefix('/shop')

Route.group(() => {
  Route.get('/validate/:username', 'SponsorsController.validate')
}).prefix('/sponsor')

Route.group(() => {
  Route.get('/', 'UsersController.getUsers')
  Route.get('/retail', 'UsersController.getRetailUsers')
}).prefix('/users')

Route.group(() => {
  Route.get('/retail', 'SponsorsController.retailSponsors')
  Route.get('/member', 'SponsorsController.memberSponsors')

}).prefix('/sponsors').middleware('auth')

Route.group(() => {
  Route.post('/calculate', 'CommissionsController.calculate')
}).prefix('/commission')


Route.group(() => {
  Route.post('/create', 'SubscriptionsController.createSubscription')
  Route.post('/cancel', 'SubscriptionsController.cancelSubscription')

}).prefix('/subscription').middleware('auth')

Route.group(() => {
  Route.post('/webhook', 'StripeController.webhook')
}).prefix('/stripe')

Route.group(() => {
  Route.post('/subscribeAffiliateMembership', 'SubscriptionsController.subscribeAffiliateMembership')
  Route.post('/subscribeOnlyMembership', 'SubscriptionsController.subscribeOnlyMembership')
  Route.post('/cancelAffiliateMember', 'SubscriptionsController.cancelAffiliateMember')
  Route.post('/cancelOnlyMember', 'SubscriptionsController.cancelOnlyMember')

  Route.get('/customer', 'SubscriptionsController.customer')

}).prefix('/subscription').middleware('auth')

Route.group(() => {
  Route.get('/default', 'AddressesController.defaultAddress')
  Route.get('/all', 'AddressesController.myAddresses')
  Route.post('/create', 'AddressesController.createAddress')
  Route.post('/verify', 'AddressesController.verifyAddress')
  Route.post('/default', 'AddressesController.updateDefault')
  Route.post('/remove', 'AddressesController.removeAddress')

}).prefix('/address').middleware('auth')


Route.group(() => {
  Route.post('/rate', 'ShippingController.rate')
  Route.post('/webhooks', 'ShippingController.webhooks')
  
}).prefix('/shipping').middleware('auth')


Route.group(() => {
  Route.post('/place', 'OrderController.placeOrder')
  Route.get('/all', 'OrderController.getUserOrders')
  Route.get('/details/:id', 'OrderController.getOrderDetails')
  
}).prefix('/order').middleware('auth')

Route.group(() => {
  Route.get('/matrix/:uid?', 'UsersController.getMatrixTree')
  Route.get('/sponsor/:uid?', 'UsersController.getSponsorTree')

}).prefix('/tree').middleware('auth')

Route.get('/order/success', 'OrderController.success')






