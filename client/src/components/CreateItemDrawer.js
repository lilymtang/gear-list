import React, { useState } from "react";
import { Drawer, Button, Row, Col } from "antd";
import CreateItem from "./CreateItem"

const CreateItemDrawer = (props) => {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const { tableData, onFinish, getAndUpdateItems } = props;

    return (
        <>
            <Row>
                <Col span={3}>
                    <h3>My Items</h3>
                </Col>
                <Col>
                    <Button type="primary" onClick={showDrawer}>
                        Add Item
                    </Button>
                </Col>
            </Row>
            <Drawer
                title="Add Item"
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={400}
            >
                <CreateItem tableData={tableData} onFinish={onFinish} getAndUpdateItems={getAndUpdateItems} />
            </Drawer>

        </>
    );
};

export default CreateItemDrawer;