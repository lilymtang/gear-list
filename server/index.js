const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes

// create an item
app.post("/items/", async (req, res) => {
    try {
        const { name, product_name, type, category, weight, account_id, is_inventory } = req.body;
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
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [name, product_name, type, category, weight, account_id, is_inventory]
        );
        return res.json(newItem.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// get all items
app.get("/items/", async (req, res) => {
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
app.get("/items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const item = await pool.query("SELECT * FROM item WHERE id = $1", [id]);
        res.json(item.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// update an item
app.put("/items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, product_name, type, category, weight } = req.body;
        console.log(req);
        const updateItem = await pool.query(
            `UPDATE item 
                SET name = $1,
                    product_name = $2,
                    type = $3,
                    category = $4,
                    weight = $5 
                WHERE id = $6`, [name, product_name, type, category, weight, id]);
        res.json("Item updated");
    } catch (err) {
        console.log(err.message);
    }
})

// delete an item
app.delete("/items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteItem = await pool.query("DELETE FROM item WHERE id = $1", [id]);
        res.json("Item deleted");
    } catch (err) {
        console.log(err.message);
    }
})

// create a pack
app.post("/packs/", async (req, res) => {
    try {
        const { name, account_id } = req.body;
        const newPack = await pool.query(
            `INSERT INTO pack (
                name,
                account_id
            )
            VALUES ($1, $2) RETURNING *`, [name, account_id]
        );
        return res.json(newPack.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// add item to a pack
app.post("/packs/:pack_id/items/:item_id", async (req, res) => {
    try {
        const { pack_id, item_id } = req.body;
        const newPack = await pool.query(
            `INSERT INTO pack_has_item (
                pack_id,
                item_id
            )
            VALUES ($1, $2) RETURNING *`, [pack_id, item_id]
        );
        res.json(newPack.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
})

// delete item from a pack
app.delete("/packs/:pack_id/items/:item_id", async (req, res) => {
    try {
        const { pack_id, item_id } = req.params;
        const deleteItem = await pool.query("DELETE FROM pack_has_item WHERE pack_id = $1 and item_id = $2", [pack_id, item_id]);
        res.json("Item deleted");
    } catch (err) {
        console.log(err.message);
    }
})

// get items in a pack
app.get("/packs/:id/items", async (req, res) => {
    try {
        const { id } = req.params;
        const packItems = await pool.query(
            `SELECT *
            FROM item 
            LEFT JOIN pack_has_item
            ON pack_has_item.item_id = item.id
            WHERE pack_id = $1`, [id]
        );
        res.json(packItems.rows);
    } catch (err) {
        console.log(err.message);
    }
})


app.listen(5000, () => {
    console.log("Server has started on port 5000");
});