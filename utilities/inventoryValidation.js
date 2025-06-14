const {body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")



const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlpha()
      .withMessage("Classification name must only contain letters."),
  ];
};

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  
  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      alerts: errors.array().map(error => ({
        type: 'error',
        message: error.msg
      })),
      classification_name: req.body.classification_name,
    });
  }
  next();
};

const inventoryRules = ()=>{
    return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Provide the vehicle make."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Provide the vehicle model."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Provide a valid year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Provide a description."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Provide the image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Provide the thumbnail path."),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Enter a valid price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Enter the mileage."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Enter the vehicle color."),
  ];
}

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();

    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error', errorMessages);
    
    return res.render("inventory/addInventory", {  
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errorMessages,
      ...req.body
    });
  }
  next(); 
};

/*errors will be directed back to the edit view*/

const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);

    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error', errorMessages);
    
    return res.render("inventory/edit", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationList,
      errors: errorMessages,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id
    });
  }
  next(); 
};

module.exports = {classificationRules,checkClassificationData, inventoryRules, checkInventoryData,checkUpdateData}

