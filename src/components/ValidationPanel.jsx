import React from "react";
import { List, Card } from "antd";

export function ValidationPanel({ errors }) {
    if (!errors || errors.length === 0) return null;

    return (
        <Card
            size="small"
            title={`Проблемы (${errors.length})`}
            style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}
        >
            <List
                size="small"
                dataSource={errors}
                renderItem={(err, index) => <List.Item key={index}>{err}</List.Item>}
            />
        </Card>
    );
}
