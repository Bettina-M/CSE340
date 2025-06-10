const utilities = require("./index")
const accountModel = require("../models/account-model")

/*body tool allows the validator to access the body object
which has the data sent via HTTP request
validation result is an object with all errors detected by the validation
process*/
const {body, validationResult} = require("express-validator")

const validate = {}

/*Registration Data Validation Rules*/
validate.registrationRules = () =>{
    return[
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min:1})
        .withMessage("Please provide a first name."),// an error this message is sent.
        
        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min:2})
        .withMessage("Please provide a last name"),
        
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()// makes the email all lowercase
        .withMessage("A valid email is required")
        .custom(async (account_email) =>{
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements"),
    
    ]
}

/*Check data and return errors or continue to register*/

validate.checkRegData = async (req,res, next) =>{
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.loginRules =()=>{
    return[
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required"),
        
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("A password is required")

    ]
}

validate.checkLoginData = async (req, res, next) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: errors.array(),
            account_email:req.body.account_email
        })
        return
    }
    next()
}

validate.restrictAccess= async (req, res, next)=> {
    if(!res.locals.loggedIn){
        req.flash("notice", "Please log in to access this page")
        return res.redirect('account/login');
    }

    const accountType = res.locals.accountData.account_type;
    if (accountType !== 'Employee' && accountType !== 'Admin'){
        req.flash("notice", "You dont have permission to access this page")
            return res.redirect('account/login')

    }    
}


module.exports = validate