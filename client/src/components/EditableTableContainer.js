import React, { useState } from "react";
import "antd/dist/antd.less";
import EditableTable from "./EditableTable";
import CreateItemDrawer from "./CreateItemDrawer";

function EditableTableContainer() {
    const [tableData, setData] = useState([]);

    // Table data change handler
    const setTableData = (updatedTableData) => {
        setData(updatedTableData);
        console.log("Setting table data:");
        console.log(updatedTableData);
    };

    const getAndUpdateItems = async () => {
        const response = await fetch("http://localhost:5000/items");
        const tableData = await response.json();
        tableData.map((item) => item["key"] = item.id);
        setTableData(tableData);
    }

    return (
        <>
            <CreateItemDrawer tableData={tableData} onFinish={setTableData} getAndUpdateItems={getAndUpdateItems} />
            <EditableTable tableData={tableData} setTableData={setTableData} getAndUpdateItems={getAndUpdateItems} />
        </>
    );
}

export default EditableTableContainer;