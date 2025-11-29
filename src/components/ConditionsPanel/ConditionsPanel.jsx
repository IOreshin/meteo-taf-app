import { Tabs } from "antd";
import { useProject } from "../../context/ProjectContext"
import "./ConditionsPanel.css"
import { RulesObserver } from "./RulesObserver";
import { AddRule } from "./AddRule";

export function ConditionsPanel() {

    const tabItems = [
        {
            key: "1",
            label: "Обзор условий",
            children: 
                <RulesObserver />
        },
        {
            key: '2',
            label: 'Добавить условие',
            children:
                <div>
                    <AddRule />
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

