import { Tabs } from "antd";
import { useProject } from "../../context/ProjectContext"
import "./ConditionsPanel.css"
import { CommonConditions } from "./CommonConditions";

export function ConditionsPanel() {
    const {config} = useProject();

    const tabItems = [
        {
            key: "1",
            label: "Общие условия",
            children: 
                <CommonConditions />
        },
        {
            key: '2',
            label: 'Условия по коду',
            children:
                <div>
                    Условия по коду
                </div>
        }
    ]


    return (
        <div>
            <Tabs 
                items={tabItems}
                type="card"
            />
        </div>
    )
}

