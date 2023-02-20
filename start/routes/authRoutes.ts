import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('/register', 'AuthController.register')

    Route.post('/login', 'AuthController.login')

    Route.post('/authenticate', 'AuthController.authenticate')
    
    Route.post('/logout', 'AuthController.logout')

}).prefix('/auth')