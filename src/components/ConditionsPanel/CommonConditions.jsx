import { useEffect } from "react";
import { useProject } from "../../context/ProjectContext"
import "./CommonConditions.css"
import React, {useState} from "react";
import { message, Table } from "antd";
import { AddCommonCondition } from "./AddCommonCondition";

const columns = [
    {
        title: '№',
        dataIndex: 'index',
        key: 'index'
    },
    {
        title: 'Условие',
        dataIndex: 'condition',
        key: 'condition'
    },
    {
        title: 'Сообщение',
        dataIndex: 'message',
        key: 'message'
    }
]

export function CommonConditions() {
    const {config} = useProject();
    const [tableInfo, setTableInfo] = useState(null);

    useEffect(() => {
        if (!config) return;

        if (!config.checks) return;

        let i = 0;
        let conditions = [];
        for (const item of config.checks) {
            i += 1;
            conditions.push({
                key: i,
                index: i,
                condition: item.condition,
                message: item.message
            });
        }
        setTableInfo(conditions);

    }, [config]);


    return(
        <div>
            <Table
                columns={columns}
                dataSource={tableInfo}
                size="small"
                title={() => 'Список условий'}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 50 * 5 }}
            />
            <AddCommonCondition />
        </div>
    )
}