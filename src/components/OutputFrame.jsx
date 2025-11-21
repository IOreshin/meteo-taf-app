import React from 'react';
import { Input } from "antd"

import "./OutputFrame.css"

export function OutputFrame() {

    return (
        <div className='output-frame'>
            <Input.TextArea
                placeholder="Здесь появится TAF-прогноз"
                autoSize={false}
            />
        </div>
    )
}