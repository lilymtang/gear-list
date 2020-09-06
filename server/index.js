const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

// create an item
app.post("/items/", async(req, res) => {
    try {
        const { name, productName, type, category, weight, accountId, isInventory} = req.body;
        const newItem = await pool.query(
            `INSERT INTO item (
                name, 
                product_name, 
                type, 
                category, 
                weight, 
                account_id, 
                is_inventory
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [name, productName, type, category, weight, accountId, isInventory]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// get all items
app.get("/items/", async(req, res) => {
    try {
        const allItems = await pool.query(
            `SELECT *
            FROM item`
        );
        res.json(allItems.rows);
    } catch (err) {
        console.log(err.message);
    }
})

// get an item
app.get("/items/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const item = await pool.query("SELECT * FROM item WHERE id = $1", [id]);
        res.json(item.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// update an item
app.put("/items/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name, productName, type, category, weight } = req.body;
        console.log(req);
        const updateItem = await pool.query(
            `UPDATE item 
                SET name = $1,
                    product_name = $2,
                    type = $3,
                    category = $4,
                    weight = $5 
                WHERE id = $6`, [name, productName, type, category, weight, id]);
        res.json("Item updated");
    } catch (err) {
        console.log(err.message);
    }
})

// delete an item
app.delete("/items/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteItem = await pool.query("DELETE FROM item WHERE id = $1", [id]);
        res.json("Item deleted");
    } catch (err) {
        console.log(err.message);
    }
})

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});