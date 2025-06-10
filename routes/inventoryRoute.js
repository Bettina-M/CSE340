//Needed Resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventoryValidation")
const accValidate = require("../utilities/account-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
 
//Route to build vehicle detail card//
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleCard))

//Route to the 500 error
router.get("/error", utilities.handleErrors(invController.errorTrigger))

//management view//
router.get("/", 
    utilities.checkJWTToken,
    accValidate.restrictAccess,
    utilities.handleErrors(invController.buildManagement))

//Adding classification form//
router.get("/add-classification",
    utilities.handleErrors(invController.buildAddClassification))

//Checking logic
router.post("/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)

)

router.get('/addInventory', invController.buildAddInventory);

router.post('/addInventory',validate.inventoryRules(), validate.checkInventoryData, invController.addInventory)

router.get('/getInventory/:classification_id',utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView))

router.post('/update',utilities.handleErrors(invController.updateInventory))

router.get('/delete/:inv_id',utilities.handleErrors(invController.deleteInventory))

router.post('/delete',utilities.handleErrors(invController.confirmDelete))



module.exports = router;