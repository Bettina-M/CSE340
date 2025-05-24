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






module.exports = invCont