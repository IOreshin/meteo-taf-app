import { AutoComplete, Input } from "antd";
import React, {useState} from "react"
import { useProject } from "../context/ProjectContext";

export function AirportSelect({onDataChange}){
    const [options, setOptions] = useState([]);
    const {airports} = useProject();

    const handleSearch = (value) => {
        if (!value) {
            setOptions([]);
            return;
        }
        if (!airports) return;

        const filtered = airports
            .filter(a => 
                a.code.toLowerCase().includes(value.toLowerCase()) ||
                a.city.toLowerCase().includes(value.toLowerCase())
            )
            .map(a => ({
                value: a.code,
                label: `${a.code} - ${a.city}`
            }));
        setOptions(filtered);
    }

    return (
        <AutoComplete
            options={options}
            onSelect={(value) => onDataChange(value, "city")}
            onChange={(value) => onDataChange(value, "city")}
            onSearch={handleSearch}
            style={{width: "100%"}}
            placeholder="Введите код или город"
            filterOption={false}
        >
            <Input />
        </AutoComplete>
    )
}