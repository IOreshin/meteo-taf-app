import { useProject } from "../../context/ProjectContext"
import "./WeatherEventsFrame.css"
import { WeatherEventRow } from "./WeatherEventRow";
import { Button } from "antd";

export function WeatherEventsFrame({frameId}) {
    const {inputData, setInputData} = useProject();

    const group = inputData[frameId];
    const weatherEvents = group.weather_events || {};

    const updateRow = (key, newRow) => {
        setInputData({
            ...inputData,
            [frameId] : {
                ...group,
                weather_events: {
                    ...weatherEvents,
                    [key]: newRow
                }
            }
        });
    };

    const addRow = () => {
        const newKey = Object.keys(weatherEvents).length;

        setInputData({
            ...inputData,
            [frameId]: {
                ...group,
                weather_events: {
                    ...weatherEvents,
                    [newKey]: {intensity: "", descriptor: "", weather_events: ""}
                }
            }
        });
    };

    const deleteRow = (key) => {
        const newObj = {...weatherEvents};
        delete newObj[key];

        setInputData({
            ...inputData,
            [frameId]: {
                ...group,
                weather_events: newObj
            }
        });
    };

    return (
        <div className="weather-events-row-container">
            {Object.keys(weatherEvents).map((key) => (
                <div key={key} className="weather-event-row">
                    <WeatherEventRow
                        value={weatherEvents[key]}
                        onChange={(v) => updateRow(key, v)}
                    />
                    <Button onClick={() => deleteRow(key)}>✖</Button>
                </div>
            ))}

            <Button onClick={addRow}>Добавить явление</Button>
        </div>
    )
}