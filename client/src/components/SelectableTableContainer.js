import React, { useState, useEffect } from "react";
import SelectableTableDrawer from "./SelectableTableDrawer"
import PackSelectableTable from "./PackSelectableTable";


const SelectableTableContainer = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [packItems, setPackItems] = useState([]);
    const [prevPackItems, setPrevPackItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Update pack based on selected rows in inventory drawer
    const updatePack = (updatedTableData) => {
        setPackItems(updatedTableData);
    };

    // Update pack based on selected rows in inventory drawer
    const updatePreviousPack = (updatedTableData) => {
        setPrevPackItems(updatedTableData);
    };

    // Initialize pack items
    const getPackItems = async () => {
        const response = await fetch("http://localhost:5000/packs/6/items");
        const tableData = await response.json();
        tableData.map((item) => item["key"] = item.id);
        setPackItems(tableData);
    }

    // Initialize inventory drawer
    const getInventoryItems = async () => {
        const response = await fetch("http://localhost:5000/items");
        const tableData = await response.json();
        tableData.map((item) => item["key"] = item.id);
        setInventoryItems(tableData);
    }

    useEffect(() => {
        getInventoryItems();
        getPackItems().then(() => setLoading(false));
    }, []);

    return (
        <>
            <SelectableTableDrawer tableData={inventoryItems} packItems={packItems} onSelect={updatePack} updatePreviousPack={updatePreviousPack} prevPackItems={prevPackItems} />
            <PackSelectableTable tableData={packItems} loading={loading} emptyText={"Start packing by adding items"} />
        </>
    );
}

export default SelectableTableContainer;