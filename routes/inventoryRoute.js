//Needed Resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventoryValidation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
 
//Route to build vehicle detail card//
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleCard))

//Route to the 500 error
router.get("/error", utilities.handleErrors(invController.errorTrigger))

//management view//
router.get("/", utilities.handleErrors(invController.buildManagement)) //done no errors

//Adding classification form//
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Checking logic
router.post("/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)

)




router.get('/addInventory', invController.buildAddInventory);
router.post('/addInventory', validate.inventoryRules(), validate.checkInventoryData, invController.addInventory)





module.exports = router;