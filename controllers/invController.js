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
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList: classificationSelect, 
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/*Build edit inventory view*/

invCont.editInventoryView = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
   res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
} 

/*Update Inventory Data*/

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

//Build Delete Confirmation view

invCont.deleteInventory = async function (req, res, next) {
  inv_id = parseInt(req.params.inv_id)
  try{
    let nav = await utilities.getNav()
    const  itemData = await invModel.getInventoryById(inv_id)
    const delete_inv = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
      title: `Delete ${delete_inv}`,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_price: itemData.inv_price,
      inv_year: itemData.inv_year,
    })
  }catch (error){
    console.error("deleteInventory error:", error);
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, an error occurred");
    res.status(500).render("inventory/delete-confirm", {
      title: "Delete Inventory Item",
      nav,
      errors: null,
    });
  }
}

//Delete an Inventory//

invCont.confirmDelete = async function (req, res, next) {
  inv_id = parseInt(req.body.inv_id)

  try{
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult){
      req.flash("notice", 'The inventory was successfully deleted')
      res.redirect("/inv/")
    }else{
      req.flash("notice", "Sorry, deletion failed")
      res.redirect(`/inv/delete/${inv_id}`);
    }} catch (error) {
   
    req.flash("notice", 'Sorry, there was an error deleting the inventory item.');
    res.redirect(`/inv/delete/${inv_id}`);
  }
  }

module.exports = invCont