import { useProject } from "../../context/ProjectContext"
import "./WeatherEventsFrame.css"
import { AutoComplete, Input } from "antd";

export function WeatherEventRow({value, onChange}){
    const {config} = useProject();

    const intensityOptions = config?.intensity?.map(c => ({
        value: c.intensity,
        label: `${c.intensity} - ${c.description}`
    })) || [];

    const descriptorOptions = config?.descriptor?.map(c => ({
        value: c.descriptor,
        label: `${c.descriptor} - ${c.description}`
    })) || [];

    const weatherEventsOptions = config?.weather_events?.map(c => ({
        value: c.event,
        label: `${c.event} - ${c.description}`
    })) || [];

    const intensityValue = value?.intensity ?? "";
    const descriptorValue = value?.descriptor ?? "";
    const weatherEventValue = value?.weather_event ?? "";

    const emit = (patch) => {
        if (typeof onChange === "function") {
            onChange({...value, ...patch})
        }
    };

    return (
        <div className="weather-event-row">
            <div className="weather-event-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={intensityOptions}
                    value={intensityValue}
                    placeholder="- / + / VC"
                    filterOption={false}
                    onSelect={(v) => emit({ intensity: v })}
                    onChange={(v) => emit({ intensity: v })}
                >
                    <Input />
                </AutoComplete>
            </div>

            <div className="weather-event-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={descriptorOptions}
                    value={descriptorValue}
                    placeholder="SH / BR / BL..."
                    filterOption={false}
                    onSelect={(v) => emit({ descriptor: v })}
                    onChange={(v) => emit({ descriptor: v })}
                >
                    <Input />
                </AutoComplete>
            </div>

            <div className="weather-event-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={weatherEventsOptions}
                    value={weatherEventValue}
                    placeholder="RA / DZ / SN..."
                    filterOption={false}
                    onSelect={(v) => emit({ weather_event: v })}
                    onChange={(v) => emit({ weather_event: v })}
                >
                    <Input />
                </AutoComplete>
            </div>
        </div>
    )
}