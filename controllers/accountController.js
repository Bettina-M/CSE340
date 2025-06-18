const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/*Deliver login view*/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/*Deliver registration view*/
async function buildRegister(req, res, next){
 let nav = await utilities.getNav()
 res.render("account/registration",{
  title: "Register",
  nav,
  errors:null,
 })

}

/*Process Registration*/
async function registerAccount(req, res){
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  let hashedPassword
  try {
    
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult){
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )

    res.status(201).render("account/login",{
      title:"Login",
      nav,
    })
  }else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration",{
      title: "Registration",
      nav,
    })
  }
}


/*Process Login Request*/
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}



//account management view//
async function buildAccountManagement(req, res){
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/accountManagement",{
    title: "Account Management",
    nav,
    accountData,
    loggedIn: res.locals.loggedIn,
    message: req.flash("message", `You're Logged in ${accountData.account_firstname}`),
    
  }
  )
}
//build account update view

async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();

  const accountDetails = await accountModel.getAccountById(req.params.account_id);
  const {account_id, account_firstname, account_lastname, account_email} = accountDetails;
  res.render("account/update", {
    title: "Update Your Account Details",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  });
}

/*updating account process*/
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    // account_password,
  } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated ${account_firstname}.`
    );


    const accountData = await accountModel.getAccountById(account_id);
    delete accountData.account_password;
    res.locals.accountData.account_firstname = accountData.account_firstname; 
    utilities.updateCookie(accountData, res); 

    res.status(201).render("account/account-management", {
      title: "Management",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    });
  }
}

//account logout process//
async function accountLogout(req, res, next){
  res.clearCookie('jwt');
  req.flash("notice", "You have logged out")
  res.redirect('/')
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  
  let hashedPassword;
  try {
    
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/update", {
      title: "Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated the password.`
    );
    res.status(201).render("account/account-management", {
      title: "Manage",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      nav,
    });
  }
}

module.exports = { buildLogin,
   buildRegister, 
   registerAccount, 
   accountLogin,
   buildAccountManagement,
   accountLogout,
   buildUpdate,
   updateAccount,
   updatePassword
  }

  

