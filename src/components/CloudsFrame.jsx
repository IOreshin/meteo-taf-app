import { useState } from "react";
import { useProject } from "../context/ProjectContext"
import "./CloudsFrame.css"
import { Button, Popover, Radio } from "antd";
import { CloudRow } from "./CloudRow";

export function CloudsFrame({frameId}) {
    const {inputData, setInputData} = useProject();

    if (!inputData || !inputData[frameId])
        return <div>Нет данных для группы</div>;

    const group = inputData[frameId];
    const clouds = group.clouds_entries || {};

    const updateRow = (key, newRow) => {
        setInputData({
            ...inputData,
            [frameId] : {
                ...group,
                clouds_entries: {
                    ...clouds,
                    [key]: newRow
                }
            }
        });
    };

    const addRow = () => {
        const newKey = Object.keys(clouds).length;
        
        setInputData({
            ...inputData,
            [frameId]: {
                ...group,
                clouds_entries: {
                    ...clouds,
                    [newKey]: {amount: "", height: "", cloud_type: ""}
                }
            }
        });
    };

    const deleteRow = (key) => {
        const newObj = {...clouds};
        delete newObj[key];

        setInputData({
            ...inputData,
            [frameId]: {
                ...group,
                clouds_entries: newObj
            }
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.keys(clouds).map((key) => (
                <div key={key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <CloudRow
                        value={clouds[key]}
                        onChange={(v) => updateRow(key, v)}
                    />
                    <Button onClick={() => deleteRow(key)}>✖</Button>
                </div>
            ))}

            <Button onClick={addRow}>Добавить облачность</Button>
        </div>
    )
}