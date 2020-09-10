import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Popconfirm, Form } from "antd";

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    var oldValue;

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
            // oldValue = record[dataIndex];
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const newValue = await form.validateFields();

            // Skip save actions if new value is unchanged
            if (oldValue !== newValue[dataIndex]) {
                toggleEdit();
                const newRecord = { ...record, ...newValue };
                console.log("Old value is:", oldValue);
                console.log("New value is:", newValue[dataIndex]);
                handleSave(newRecord);
                try {
                    await fetch(`http://localhost:5000/items/${newRecord.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newRecord)
                    });
                } catch (err) {
                    console.log(err.message);
                }
            }
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        let conditionalRule;
        if (title === "Item Name" || title === "Category") {
            conditionalRule = {
                required: true,
                message: `${title} is required.`,
            }
        }
        else {
            conditionalRule = {}
        }
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0
                }}
                name={dataIndex}
                rules={[
                    conditionalRule
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    // style={{
                    //     paddingRight: 24
                    // }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };

        this.columns = [
            {
                title: "Item Name",
                dataIndex: "name",
                sorter: (a, b) => a.name.localeCompare(b.name),
                editable: true
            },
            {
                title: "Product Name",
                dataIndex: "product_name",
                sorter: (a, b) => a.product_name.localeCompare(b.product_name),
                editable: true
            },
            {
                title: "Category",
                dataIndex: "category",
                sorter: (a, b) => a.category.localeCompare(b.category),
                editable: true
            },
            {
                title: "Type",
                dataIndex: "type"
            },
            {
                title: "Weight",
                dataIndex: "weight",
                sorter: (a, b) => a.weight - b.weight
            },
            {
                title: "",
                dataIndex: "delete",
                render: (text, record) =>
                    this.props.tableData.length >= 1 ? (
                        <Popconfirm title="Are you sure?" onConfirm={() => this.handleDelete(record.key)}>
                            <a href="/#">Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
    }

    // Sets initial state of EditableTable
    componentDidMount = async () => {
        try {
            this.props.getAndUpdateItems().then(() => this.setState({ loading: false }))
        } catch (err) {
            console.log(err.message);
        }
    }

    handleDelete = async key => {
        console.log("delete item:", key);
        try {
            await fetch(`http://localhost:5000/items/${key}`, {
                method: "DELETE"
            });
            this.props.setTableData(this.props.tableData.filter(item => item.key !== key));
        } catch (err) {
            console.log(err.message)
        }
    };

    handleSave = row => {
        const newData = [...this.props.tableData];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });

        this.props.setTableData(newData);
    };

    render() {
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <div>
                <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    dataSource={this.props.tableData}
                    columns={columns}
                    loading={this.state.loading}
                    locale={{ emptyText: "Fetching your items" }}
                />
            </div>
        );
    }
}

export default EditableTable;