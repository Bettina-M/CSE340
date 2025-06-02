const pool = require("../database/")
/*imports the database connection file named index.js
from db folder
/*get all classification data */

async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/*Get all inventory items and classification_name by classification_id*/

async function getInventoryByClassificationId(classification_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    }catch (error){
        console.error("getclassificationbyid error" + error)
    }
}

async function getVehicleId(inv_id){
    return await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inv_id])
}

async function addClassification(classification_name){
  try{
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING* "
    const data = await pool.query(sql, [classification_name])
    return data;
  } catch (error){
    return null;
  }
}

async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `INSERT INTO inventory (classification_id,inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING*`;
    const data = await pool.query(sql, [ classification_id,inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]);
    return data;
  } catch (error) {
    return null;
  }
}
module.exports = {getClassifications, getInventoryByClassificationId,getVehicleId, addClassification,addInventory};
