import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('/register', 'AuthController.register')

    Route.post('/login', 'AuthController.login')

    Route.post('/authenticate', 'AuthController.authenticate')
    
    Route.post('/logout', 'AuthController.logout')

    Route.post('/check_username_exists', 'AuthController.checkUsernameExists')
    Route.post('/check_email_exists', 'AuthController.checkEmailExists')
    Route.post('/check_phone_exists', 'AuthController.checkPhoneExists')


}).prefix('/auth')