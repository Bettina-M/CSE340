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



module.exports = router;