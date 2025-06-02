const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont={}

/*Build inventory classification view */

invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId
    try{
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
        title:className+" "+ "Vehicles", nav, grid,})
    }catch (error){
        next(error)
    }
    
}

/*build vehicle detail card view*/

invCont.buildVehicleCard = async function (req, res, next){
    const inv_id = req.params.inv_id;
    try{
        const data = await invModel.getVehicleId(inv_id)
        const vehicleCard = utilities.buildVehicleCard(data.rows[0])
        let nav = await utilities.getNav()
        res.render("./inventory/detail",{
            title:`${data.rows[0].inv_year} ${data.rows[0].inv_make} ${data.rows[0].inv_model}`,
            nav, vehicleCard,
        })
    }catch (error){
        next(error)
    }
}

invCont.errorTrigger = async (req, res, next)=>{
    try{
        //the error
        throw new error("Error test")
    }catch (error){
        next(error)
    }
}

//building management view
invCont.buildManagement = async function(req, res, next){
  try{
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  }catch(error){
    next(error)
  }
}

//building a new classification
invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
};


//adding new classification
invCont.addClassification = async function(req, res){
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const result = await invModel.addClassification(classification_name);
  if (result) {
    req.flash("notice",  `Classification ${classification_name} added.`)
    res.status(501).render("inventory/management",{
      title: "Vehicle Management",
      nav,
    })
  } else{
    req.flash("notice", "Failed to add classification")
    return res.status(500).render("inventory/add-classification",{
    title: "Add Classification",
    nav,
    errors:null
  })
  }
}


//Inventory View
invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

/*adding new inventory*/

invCont.addInventory = async function(req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash("notice", "Vehicle added successfully!");
      return res.redirect("/inv/"); // Redirect to management view
    } else {
      throw new Error("Insertion failed (no result returned).");
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    let classificationList = await utilities.buildClassificationList();
    
    req.flash("error", "Failed to add vehicle. Please check inputs.");
    return res.render("inventory/addInventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: null,
      flashMessages: req.flash(),
      ...req.body,
    });
  }
};



module.exports = invCont