const utilities = require("../utilities/")
const baseController = {}

/*"index" refers to a file like views/index.ejs.,
title might be shown in the <title> tag or as a header.*/
baseController.buildHome = async function(req, res){
    try{
        const nav = await utilities.getNav()
        req.flash("notice", "This is a flash message.")
        res.render("index", {title: "Home", nav}) 
    }catch (error){
        next(error)
    }
    
}

module.exports = baseController
