import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form } from "antd";
import "antd/dist/antd.less"; 
 
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
	useEffect(() => {
		if (editing) {
			inputRef.current.focus();
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
            const values = await form.validateFields();
            toggleEdit();
            const newRecord = { ...record, ...values };
            handleSave(newRecord);

            try {
                await fetch(`http://localhost:5000/items/${newRecord.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(newRecord)
                });
            } catch(err) {
                console.log(err.message);
            }    
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if (editable) {
        let conditionalRule;
        if (title == "Item Name" || title == "Category") {
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
					margin: 0,
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
				style={{
                    paddingRight: 24
				}}
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
        this.columns = [
            {
                title: "Item Name",
                dataIndex: "name",
                width: "30%",
                editable: true
            },
            {
                title: "Category",
                dataIndex: "category",
                editable: true
            },
            {
                title: "Weight",
                dataIndex: "weight"
            },
            {
                title: "Product Name",
                dataIndex: "product_name"
            },
            {
                title: "Type",
                dataIndex: "type"
            },
            {
                title: "",
                dataIndex: "operation",
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            dataSource: []
        };
    }

    componentDidMount = async () => {
        try {
            const response = await fetch("http://localhost:5000/items");
            const jsonData = await response.json();

            jsonData.map( (item) => 
                item["key"] = item.id
            );

            this.setState({ 
                dataSource: jsonData
            });
        } catch(err) {
            console.log(err.message);
        }
    }

    handleDelete = async key => {
        const dataSource = [...this.state.dataSource];

        try {
            await fetch(`http://localhost:5000/items/${key}`, {
                method: "DELETE"
            });
            this.setState({
                dataSource: dataSource.filter(item => item.key !== key),
            });
        } catch(err) {
            console.log(err.message)
        }
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });

        this.setState({
          dataSource: newData,
        });
      };

    render() {
        const { dataSource } = this.state;
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
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add Item
                </Button>
                <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}


export default EditableTable;