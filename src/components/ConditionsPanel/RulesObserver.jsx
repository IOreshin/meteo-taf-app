import { useEffect } from "react";
import { useProject } from "../../context/ProjectContext"
import "./RulesObserver.css"
import React, {useState} from "react";
import { Card, Select } from "antd";

function formatSide(side) {
    if (!side) return "";

    if (side.type === "field") {
        return side.field;
    }

    if (side.type === "value") {
        return side.value;
    }

    if (side.type === "expr") {
        const expr = side.expr.replace("field", side.field);
        return `${expr}`;
    }

    return "";
}

function formatCondition(c) {
    const left = formatSide(c.left);
    const right = formatSide(c.right);
    const link = c.logic_link !== "None" ? `${c.logic_link} ` : "";

    return `${link}${left} ${c.operator} ${right}`;
}

const observerTypeItems = [
    {
        value: "common",
        label: "Общие условия",
    },
    {
        value: "byCode",
        label: "Условия по коду"
    }
]

export function RulesObserver() {
    const {validationRules} = useProject();
    const [commonRules, setCommonRules] = useState([]);
    const [rulesByCode, setRulesByCode] = useState([]);
    const [codeList, setCodeList] = useState([]);
    const [selectedCode, setSelectedCode] = useState("");
    const [observerType, setObserverType] = useState("common");

    useEffect(() => {
        if (!validationRules) return;

        const commonRulesRes = validationRules.common_rules.map((rule, index) => ({
            key: index,
            message: rule.message,
            conditions: rule.conditions.map(c => formatCondition(c))
        }));
        setCommonRules(commonRulesRes);

        const codeListRes = validationRules.rules_by_code.map((code) => ({
            value: code.code,
            label: code.code
        }));
        setCodeList(codeListRes);
        setSelectedCode(codeListRes[0].label);

        setRulesByCode(validationRules.rules_by_code);

    }, [validationRules])

    return (
        <div>
            <div className="select-options">
                <p>Тип условий</p>
                <Select
                    defaultValue={observerTypeItems[0].label}
                    options={observerTypeItems}
                    onChange={(v) => setObserverType(v)}
                />
                {observerType == "byCode"
                ?   <div className="select-options">
                        <p>Код явления</p>
                        <Select 
                            defaultValue={codeList[0].label}
                            options={codeList}
                            onChange={(v) => setSelectedCode(v)}
                        />
                    </div>
                : <></>}
            </div>
            

            <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                {
                    observerType == "common" 
                    ?   <div>
                            {commonRules.map(rule => (
                                <Card key={rule.key} title={rule.message}>
                                    {rule.conditions.map((c, idx) => (
                                        <div key={idx} style={{paddingLeft: 10}}>
                                            {c}
                                        </div>
                                    ))}
                                </Card>
                            ))}
                        </div>
                    : observerType == "byCode"
                    ?   <div> 
                            {rulesByCode
                                .filter(item => item.code === selectedCode)
                                .map((codeRule, index) => (
                                    <div key = {index}>
                                        {codeRule.rules.map((rule, rIndex) => (
                                            <Card key={rIndex} title={rule.message}>
                                                {rule.conditions.map((c, idx) => (
                                                    <div key={idx}>
                                                        {formatCondition(c)}
                                                    </div>
                                                ))}
                                            </Card>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    : <></>
                }
            </div>
        </div>
    )
}

