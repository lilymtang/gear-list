import React from "react";
import { Table } from "antd";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Product Name",
        dataIndex: "product_name"
    }
];

const SelectableTable = (props) => {
    const onChange = (selectedRowKeys, selectedRows) => {
        props.onSelect(selectedRows)
    }

    console.log(props.packItems.map(item => item.key));

    return (
        <div>
            <Table
                rowSelection={{
                    type: "checkbox",
                    onChange: onChange,
                    selectedRowKeys: props.packItems.map(item => item.key)
                }}
                size="small"
                columns={columns}
                dataSource={props.tableData}
                pagination={props.pagination}
                locale={{ emptyText: props.emptyText }}
            />
        </div>
    );
}

export default SelectableTable;