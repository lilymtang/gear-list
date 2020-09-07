import React, { useState } from "react";
import "antd/dist/antd.less";
import EditableTable from "./EditableTable";
import CreateItem from "./CreateItem";

function EditableTableContainer() {
    const [tableData, setData] = useState([]);

    // Table data change handler
    const setTableData = (updatedTableData) => {
        setData(updatedTableData);
        console.log("Setting table data:");
        console.log(updatedTableData);
    };

    return (
        <>
            <CreateItem tableData={tableData} onFinish={setTableData} />
            <EditableTable tableData={tableData} setTableData={setTableData} />
        </>
    );
}

export default EditableTableContainer;