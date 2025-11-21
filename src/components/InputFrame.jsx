import "./InputFrame.css"
import { Input, Select, Button, Space } from "antd";

const { Option } = Select;

export function InputFrame() {

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 , overflowY:"auto"}}>
            <Input placeholder="ICAO" />

            <Select placeholder="Тип группы">
                <Option value="TEMPO">TEMPO</Option>
                <Option value="BECMG">BECMG</Option>
            </Select>

            <Input placeholder="Время выпуска (DDHHMM)" />
            <Input placeholder="Время действия от (DDHH)" />
            <Input placeholder="Время действия до (DDHH)" />

            <Input placeholder="Направление ветра (°)" />
            <Input placeholder="Скорость ветра (MPS)" />
            <Input placeholder="Порыв ветра" />
            <Input placeholder="Видимость (м)" />

            <Space>
                <Button type="primary">Добавить облачность</Button>
                <Button>Удалить облачность</Button>
            </Space>

            <Space>
                <Button type="primary">Добавить явление</Button>
                <Button>Удалить явление</Button>
            </Space>
        </div>
    )
}