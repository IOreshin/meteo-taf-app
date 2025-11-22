import { AutoComplete, Input } from "antd";
import { useProject } from "../../context/ProjectContext";
import "./CloudsFrame.css"

export function CloudRow({value, onChange}){
    const {config} = useProject();

    const amountOptions = config?.clouds_amount?.map(c => ({
        value: c.amount,
        label: `${c.amount} - ${c.description}`
    })) || [];

    const typeOptions = config?.clouds_type?.map(c => ({
        value: c.type,
        label: c.type ? `${c.type} - ${c.description}` : "Нет характеристики"
    })) || [];

    const heightOptions = Array.from({ length: 49 }, (_, i) => {
        const v = String(i + 1).padStart(3, "0");
        return { value: v, label: v };
    });

    const amountValue = value?.amount ?? "";
    const heightValue = value?.height ?? "";
    const typeValue = value?.cloud_type ?? "";

    const emit = (patch) => {
    if (typeof onChange === "function") {
            onChange({ ...value, ...patch });
        }
    };

    return (
        <div className="cloud-row">
            {/* Количество */}
            <div className="cloud-row-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={amountOptions}
                    value={amountValue}
                    placeholder="FEW / SCT / BKN ..."
                    filterOption={false}
                    onSelect={(v) => emit({ amount: v })}
                    onChange={(v) => emit({ amount: v })}
                >
                    <Input />
                </AutoComplete>
            </div>
            
            {/* Высота */}
            <div className="cloud-row-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={heightOptions}
                    value={heightValue}
                    placeholder="Высота (030)"
                    filterOption={false}
                    onSelect={(v) => emit({ height: v })}
                    onChange={(v) => emit({ height: v })}
                >
                    <Input />
                </AutoComplete>
            </div>

            {/* Тип облаков */}
            <div className="cloud-row-item">
                <AutoComplete
                    style={{ width: 120 }}
                    options={typeOptions}
                    value={typeValue}
                    placeholder="CB / TCU / ..."
                    filterOption={false}
                    onSelect={(v) => emit({ cloud_type: v })}
                    onChange={(v) => emit({ cloud_type: v })}
                >
                    <Input />
                </AutoComplete>
            </div>
        </div>
    )
}