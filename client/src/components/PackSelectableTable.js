import React from "react";
import { Table, Typography } from "antd";


const columns = [
    {
        title: "Item Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
        title: "Product Name",
        dataIndex: "product_name",
        sorter: (a, b) => a.product_name.localeCompare(b.product_name)
    },
    {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.localeCompare(b.category)
    },
    {
        title: "Type",
        dataIndex: "type"
    },
    {
        title: "Weight",
        dataIndex: "weight",
        sorter: (a, b) => a.weight - b.weight
    }
];

const PackSelectableTable = (props) => {
    const { Text } = Typography;

    return (
        <div>
            <Table
                rowSelection={{
                    type: "checkbox",
                    onChange: () => { }
                }}
                size="small"
                columns={columns}
                dataSource={props.tableData}
                pagination={props.pagination}
                loading={props.loading}
                locale={{ emptyText: props.emptyText }}
                summary={pageData => {
                    let totalWeight = 0;

                    pageData.forEach(({ weight }) => {
                        totalWeight += parseFloat(weight);
                    });

                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Text strong>
                                        Total Weight
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <Text strong>{totalWeight}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </div>
    );
}

export default PackSelectableTable;