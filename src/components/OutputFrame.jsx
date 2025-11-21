import React, { useMemo } from 'react';
import { Input } from "antd"

import "./OutputFrame.css"
import { useProject } from '../context/ProjectContext';
import { generateTaf, generateTafAllGroups } from '../utils/generateTaf';


export function OutputFrame() {
    const {inputData} = useProject();

    const taf = useMemo(() => {
        try {
            return generateTafAllGroups(inputData);
        } catch (err) {
            console.log(err);
            return "Ошибка генерации TAF";
        }
    }, [inputData]);

    return (
        <div className='output-frame'>
            <Input.TextArea
                placeholder="Здесь появится TAF-прогноз"
                autoSize={false}
                value={taf}
            />
        </div>
    )
}