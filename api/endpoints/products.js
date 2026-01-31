const express = require("express");
const authcheck = require("../middleware/authcheck");
const router = express.Router();
const db = require("../config/db");
const { products } = require("../model/Product");
// const { eq } = require("drizzle-orm/pg-core"); 
const { sql } = require("drizzle-orm/sql");


// GET /products - Get all products
// issue 10: added Auth middleware for product list. 
router.get("/products", authcheck, async (req, res) => {
    const pool = req.app.get('db'); // Access the global pool
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error fetching products" });
    }
});

//issue : 11 added ORM for 
router.get("/v2/products", authcheck, async (req, res) => {
    try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching products" });
  }
});

// GET /products/mylistings - Get products for the logged-in user
//issue 8 - Fixed the incorrect Query, included owner email in search criteria. 
router.get("/products/mylistings", authcheck, async (req, res) => {
    const pool = req.app.get('db');
    try {
        const userEmail = req.user.email;
        console.log(userEmail);
        const result = await pool.query(
            "SELECT * FROM products where owner_email = $1 ORDER BY id DESC",
            [userEmail]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error fetching your listings" });
    }
});
//v2 api for implementing ORM. 
router.get("/v2/products/mylistings", authcheck, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const myProducts = await db
      .select()
      .from(products)
      .where(sql`${products.owner_email} = ${userEmail}`);
      

    res.json(myProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching your listings" });
  }
});



// POST /products - Create a new listing
router.post("/products", authcheck, async (req, res) => {
    const pool = req.app.get('db');
    const { title, price, image_url } = req.body;
    const owner_email = req.user.email;

    try {
        const result = await pool.query(
            "INSERT INTO products (title, price, image_url, owner_email) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, price, image_url, owner_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error creating product" });
    }
});


//Delete selected Product
router.delete("/products/delete/:id",async(req,res)=>{
    const pool = req.app.get('db');
    const { id } = req.params;
    console.log(req.params)
    try{
       
        const result = await pool.query(
            "DELETE from products Where id= $1 RETURNING *",
            [id]
        );
         if (result.rowCount === 0) {
            return res.status(404).json({
            success: false,
            message: "Product not found"
         });
         }

        res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: result.rows[0]
        });
    }catch(error){
      res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
     });
    }
});

//v2 delete api implemented using ORM.
router.delete("/v2/products/delete/:id", authcheck, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deleted = await db
      .delete(products)
      .where(sql`${products.id} = ${id}`)
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deleted[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete product", error: err.message });
  }
});

module.exports = router;