const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/index')
const accountCtrl = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountCtrl.buildLogin))

router.get('/registration', utilities.handleErrors(accountCtrl.buildRegister))

router.post('/registration', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountCtrl.registerAccount)
)

//Process the login request
router.post( "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountCtrl.accountLogin)
) 
router.get('/', 
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountCtrl.buildAccountManagement))


module.exports = router;