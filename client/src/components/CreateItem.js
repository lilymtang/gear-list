import React from "react";
import { Form, Input, InputNumber, Button, Radio } from "antd";
import "antd/dist/antd.less";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

const CreateItem = (props) => {
    const [form] = Form.useForm();

    const AddFields = formValue => {
        // TODO: don't hardcode these
        formValue["account_id"] = 1000;
        formValue["is_inventory"] = true;
    }

    const onFinish = async formValue => {
        AddFields(formValue);

        try {
            formValue["key"] = props.tableData.length;

            // Update data in EditableTableContainer with form value
            // props.onFinish([...props.tableData, formValue]);

            await fetch("http://localhost:5000/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValue)
            })

            props.getAndUpdateItems();
        } catch (err) {
            console.log(err.message);
        }

        form.resetFields();
    };

    return (
        <>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} layout="vertical"
                initialValues={{
                    "type": null,
                    "weight": 0.00
                }}>
                <Form.Item label="Item Name" name="name" rules={[{ required: true }]} required>
                    <Input placeholder="backpack, tent, sleeping bag" allowClear />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[{ required: true }]} required>
                    <Input placeholder="pack, shelter, sleep system" allowClear />
                </Form.Item>
                <Form.Item label="Weight" name="weight">
                    <InputNumber min={0.00} step={0.01} />
                </Form.Item>
                <Form.Item label="Product Name" name="product_name">
                    <Input placeholder="Granite Gear Crown2 60" allowClear />
                </Form.Item>
                <Form.Item label="Type" name="type">
                    <Radio.Group>
                        <Radio.Button value={null}>None</Radio.Button>
                        <Radio.Button value="Consumable">Consumable</Radio.Button>
                        <Radio.Button value="Worn">Worn</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Add Item</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateItem;