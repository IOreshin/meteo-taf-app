import "./InputFrame.css"
import { Input, Select, Button, Space } from "antd";
import { AirportSelect } from "./AirportSelect";
import { useState } from "react";
const { Option } = Select;
import { useProject } from "../context/ProjectContext";

export function InputFrame({isMainGroup, frameId}) {
    const {inputData, setInputData} = useProject();

    const onDataChange = (value, field) => {
        setInputData(prev => ({
            ...prev,
            [frameId]: {
                ...(prev?.[frameId] ?? {}),
                [field]: value
            }
        }));
        //console.log(inputData);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 , overflowY:"auto"}}>
            {isMainGroup ? <AirportSelect onDataChange={onDataChange}/> : <></>}

            {isMainGroup ? <></> : 
                <Select placeholder="Тип группы" onSelect={value => onDataChange(value, "group_type")}>
                    <Option value="TEMPO">TEMPO</Option>
                    <Option value="BECMG">BECMG</Option>
                </Select>
            }
            
            {isMainGroup ? <Input 
                                placeholder="Время выпуска (DDHHMM)" 
                                onChange={value => onDataChange(value.target.value, "issue_time")}
                            /> 
                        : <></>}
            
            <Input 
                placeholder="Время действия от (DDHH)" 
                onChange={value => onDataChange(value.target.value, "time_from")}    
            />
            <Input 
                placeholder="Время действия до (DDHH)" 
                onChange={value => onDataChange(value.target.value, "time_to")}
            />
            <Input 
                placeholder="Направление ветра (°)" 
                onChange={value => onDataChange(value.target.value, "wind_dir")}
            />
            <Input 
                placeholder="Скорость ветра (MPS)" 
                onChange={value => onDataChange(value.target.value, "wind_speed")}
            />
            <Input 
                placeholder="Порыв ветра"
                onChange={value => onDataChange(value.target.value, "wind_gust")}
            />
            <Input 
                placeholder="Видимость (м)" 
                onChange={value => onDataChange(value.target.value, "visibility")}
            />

            <Space>
                <Button type="primary">Добавить облачность</Button>
            </Space>

            <Space>
                <Button type="primary">Добавить явление</Button>
            </Space>
        </div>
    )
}