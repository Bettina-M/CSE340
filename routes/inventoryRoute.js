//Needed Resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
 
//Route to build vehicle detail card//
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleCard))

//Route to the 500 error
router.get("/error", utilities.handleErrors(invController.errorTrigger))


module.exports = router;