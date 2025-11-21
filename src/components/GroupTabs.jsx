import { Children } from "react"
import "./GroupTabs.css"
import { Tabs } from "antd"
import { InputFrame } from "./InputFrame"
import { useRef, useState } from "react"
import { useProject } from "../context/ProjectContext"

const defaultTabs = [
    {
        key: '1',
        label: 'Основная группа',
        children: <InputFrame isMainGroup={true} frameId={0}/>,
        closable : false,
    }
]

export function GroupTabs() {
    const newTabIndex = useRef(2);
    const [items, setItems] = useState(defaultTabs);
    const [activeKey, setActiveKey] = useState(defaultTabs[0].key);
    const {inputData, setInputData} = useProject();

    const onChange = (key) => {
        setActiveKey(key);
    }

    const add = () => {
        const newActiveKey = newTabIndex.current++;
        const newPanes = [...items];
        newPanes.push({
            label: `Группа ${items.length}`,
            children: <InputFrame isMainGroup={false} frameId={newActiveKey}/>,
            key: newActiveKey
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    }

    const remove = targetKey => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i-1;
            }
        });

        const newPanes = items.filter(item => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0){
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }

        newPanes.forEach((item, i) => {
            if (i > 0) {
                item.label = `Группа ${i}`;
            }
        });

        setInputData(prev => {
            const updated = { ...prev };
            delete updated[targetKey];
            return updated;
        });

        setItems(newPanes);
        setActiveKey(newActiveKey);
    }

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <div className="group-tabs">
            <Tabs 
                items={items}
                onChange={onChange}
                type="editable-card"
                activeKey={activeKey}
                onEdit={onEdit}
            />
        </div>
    )
}