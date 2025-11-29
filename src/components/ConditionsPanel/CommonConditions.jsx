import { useEffect } from "react";
import { useProject } from "../../context/ProjectContext"
import "./CommonConditions.css"
import React, {useState} from "react";
import { Card, message, Table } from "antd";
import { AddCommonCondition } from "./AddCommonCondition";


function formatSide(side) {
    if (!side) return "";

    if (side.type === "field") {
        return side.field;
    }

    if (side.type === "value") {
        return side.value;
    }

    if (side.type === "expr") {
        const expr = side.expr.replace("field", side.field);
        return `${expr}`;
    }

    return "";
}

function formatCondition(c) {
    const left = formatSide(c.left);
    const right = formatSide(c.right);
    const link = c.logic_link !== "None" ? `${c.logic_link} ` : "";

    return `${link}${left} ${c.operator} ${right}`;
}

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
    const [rules, setRules] = useState([]);

    useEffect(() => {
        if (!config || !config.common_conditions) return;

        const res = config.common_conditions.map((rule, index) => ({
            key: index,
            message: rule.message,
            conditions: rule.conditions.map(c => formatCondition(c))
        }));

        setRules(res);
    }, [config])

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            {rules.map(rule => (
                <Card key={rule.key} title={rule.message}>
                    {rule.conditions.map((c, idx) => (
                        <div key={idx} style={{paddingLeft: 10}}>
                            {c}
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    )

}