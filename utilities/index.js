/*will hold functions that can be reused*/
const invModel = require("../models/inventory-model")
const Util = {} //an object thats empty
/*Constructs the nav HTML unordered list*/

const jwt = require("jsonwebtoken")
require("dotenv").config()

Util.getNav = async function (req, res, next) {  //get nav is variable of util object
  let data = await invModel.getClassifications()
  
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}





/*Build the classification view HTML*/

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '<hr/>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/*Build the single view for detailed
information about each vehicle*/

Util.buildVehicleCard = function (card) {
  return `
    <div class="vehicleCard">
      <img src="${card.inv_image}" alt="Image of ${card.inv_make}, ${card.inv_model}, ${card.inv_year}" class="vehicle-image">
      <p><strong>Price:</strong>$${new Intl.NumberFormat('en-US').format(card.inv_price)}</p>
      <p><strong>Mileage:</strong> ${card.inv_miles.toLocaleString()} miles</p>
    </div>
  `
}
//building classification list*/

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  });
  classificationList += "</select>"
  return classificationList
}

/* Middleware to check token validity*/
Util.checkJWTToken = (req, res, next) => {
  
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}
  
/*Check Login*/
Util.checkLogin = (req, res, next) =>{
  if (res.locals.loggedin){
    next()
  } else{
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)

module.exports = Util
