import "./InputFrame.css"
import { Input, Select, Button, Space } from "antd";
import { AirportSelect } from "./AirportSelect";
import { useState } from "react";
const { Option } = Select;
import { useProject } from "../context/ProjectContext";
import { CloudsFrame } from "./CloudsInput/CloudsFrame";
import { WeatherEventsFrame } from "./WeatherEventsInput/WeatherEventsFrame";

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
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 , overflowY:"auto"}}>
            {isMainGroup ? 
            <div className="input-frame-box">
                <p>ICAO</p>
                <AirportSelect onDataChange={onDataChange}/> 
            </div> : 
            <></>}

            {isMainGroup ? <></> : 
                <div className="input-frame-box">
                    <p>Тип группы</p>
                    <Select 
                        placeholder="Тип группы" 
                        onSelect={value => onDataChange(value, "group_type")}
                        defaultValue={"TEMPO"}
                    >
                        <Option value="TEMPO">TEMPO</Option>
                        <Option value="BECMG">BECMG</Option>
                    </Select>
                </div>
            }
            
            {isMainGroup ? 
            <div className="input-frame-box">
                <p>Время выпуска (DDHHMM)</p>
                <Input 
                    placeholder="Время выпуска (DDHHMM)" 
                    onChange={value => onDataChange(value.target.value, "issue_time")}
                />
            </div>
                : <></>}
            
            <div className="input-frame-box">
                <p>Время действия от (DDHH)</p>
                <Input 
                    placeholder="Время действия от (DDHH)" 
                    onChange={value => onDataChange(value.target.value, "time_from")}    
                />
            </div>

            <div className="input-frame-box">
                <p>Время действия до (DDHH)</p>
                <Input 
                    placeholder="Время действия до (DDHH)" 
                    onChange={value => onDataChange(value.target.value, "time_to")}
                />
            </div>

            <div className="input-frame-box">
                <p>Направление ветра (°)</p>
                <Input 
                    placeholder="Направление ветра (°)" 
                    onChange={value => onDataChange(value.target.value, "wind_dir")}
                />
            </div>

            <div className="input-frame-box">
                <p>Скорость ветра (MPS)</p>
                <Input 
                    placeholder="Скорость ветра (MPS)" 
                    onChange={value => onDataChange(value.target.value, "wind_speed")}
                />
            </div>

            <div className="input-frame-box">
                <p>Порыв ветра (MPS)</p>
                <Input 
                    placeholder="Порыв ветра (MPS)"
                    onChange={value => onDataChange(value.target.value, "wind_gust")}
                />
            </div>

            <div className="input-frame-box">
                <p>Видимость (м)</p>
                <Input 
                    placeholder="Видимость (м)" 
                    onChange={value => onDataChange(value.target.value, "visibility")}
                />
            </div>

            <CloudsFrame frameId={frameId}/>
            <WeatherEventsFrame frameId={frameId}/>
        </div>
    )
}