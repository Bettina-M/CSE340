//Needed Resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
 
//Route to build vehicle detail card//
router.get("/detail/:inv_id", invController.buildVehicleCard)

//Route to the 500 error
router.get("/error", invController.errorTrigger)


module.exports = router;