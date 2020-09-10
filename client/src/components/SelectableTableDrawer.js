import React, { useState } from "react";
import { Space, Drawer, Button, Row, Col } from "antd";
import SelectableTable from "./SelectableTable";

const SelectableTableDrawer = (props) => {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
        props.updatePreviousPack(props.packItems);
    };

    // Remove item from pack by id
    const removeFromPack = async (id) => {
        console.log("remove item: ", id);

        // TODO: don't hardcode pack_id
        try {
            await fetch(`http://localhost:5000/packs/6/items/${id}`, {
                method: "DELETE"
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    // Add item to pack by id
    const addToPack = async (id) => {
        console.log("add item: ", id);

        // TODO: don't hardcode pack_id
        const body = { "pack_id": 6, "item_id": id }

        try {
            await fetch(`http://localhost:5000/packs/${body.pack_id}/items/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    const onClose = async () => {
        let finalPack = new Set(props.packItems.map(item => item.id));
        let initialPack = new Set(props.prevPackItems.map(item => item.id));

        console.log("Initial pack: ", initialPack);
        console.log("Final pack: ", finalPack);
        setVisible(false);

        // Process server requests
        let initial_minus_final = new Set([...initialPack].filter(x => !finalPack.has(x))); // To DELETE
        let final_minus_initial = new Set([...finalPack].filter(x => !initialPack.has(x))); // To POST

        console.log("DELETE: ", initial_minus_final);
        console.log("POST: ", final_minus_initial);

        let deletePromises = [...initial_minus_final].map(x => removeFromPack(x));
        let postPromises = [...final_minus_initial].map(x => addToPack(x));

        await Promise.all(deletePromises);
        await Promise.all(postPromises);
    };

    return (
        <>
            {/* <Space direction="vertical" size="middle"> */}
            <Row>
                <Col span={3}>
                    <h3>My Pack</h3>
                </Col>
                <Col>
                    <Button type="primary" onClick={showDrawer}>
                        Pack Items
                    </Button>
                </Col>
            </Row>
            <Drawer
                title="My Items"
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={400}
            >
                <SelectableTable packItems={props.packItems} tableData={props.tableData} onSelect={props.onSelect} pagination={false} emptyText={props.emptyText} />
            </Drawer>
            {/* </Space> */}
        </>
    );
}

export default SelectableTableDrawer;