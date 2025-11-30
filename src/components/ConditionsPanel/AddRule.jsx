import React, { useState, useEffect } from "react";
import { Form, Select, Input, Checkbox, Button, Card, Space, Divider, AutoComplete } from "antd";
import { useProject } from "../../context/ProjectContext";
import { DeleteOutlined } from "@ant-design/icons";
import { invoke } from "@tauri-apps/api/core";

const funcs = [
  { label: "Нет", value: "" },
  { label: "exists(x)", value: "exists" },
  { label: "to_int(x)", value: "to_int" },
];

const operators = ["==", "!=", "<", ">", "<=", ">="];

export function AddRule() {
  const { validationRules, appData, setAppDataNeedReload } = useProject();

  const [blocks, setBlocks] = useState([
    {
      field: "",
      func: "",
      expr: "",
      operator: "",
      value: "",
      rightExpr: "",
      valueIsField: false,
      logicLink: "None",
    }
  ]);

  const [message, setMessage] = useState("");
  const [ruleType, setRuleType] = useState("common");
  const [selectedCode, setSelectedCode] = useState("");
  const [codeOptions, setCodeOptions] = useState([]);

  useEffect(() => {
    if (validationRules?.rules_by_code?.length > 0) {
      setSelectedCode(validationRules.rules_by_code[0].code);
    }
  }, [validationRules]);

  const updateBlock = (idx, key, val) => {
    const newBlocks = [...blocks];
    newBlocks[idx][key] = val;
    setBlocks(newBlocks);
  };

  const addBlock = (logic) => {
    setBlocks([
      ...blocks,
      {
        field: "",
        func: "",
        expr: "",
        operator: "",
        value: "",
        rightExpr: "",
        valueIsField: false,
        logicLink: logic
      }
    ]);
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter((_, idx) => idx !== id));
  };

  const saveNewRule = async () => {
    const rule = {
      message,
      conditions: blocks.map((block) => {
        const leftSide = block.expr
          ? { type: "expr", expr: block.expr, field: block.field, func: block.func }
          : block.func
            ? { type: "expr", expr: "field", field: block.field, func: block.func }
            : { type: "field", field: block.field, func: null, expr: null };

        let rightSide;

        if (block.rightExpr) {
          rightSide = {
            type: "expr",
            expr: block.rightExpr,
            field: block.valueIsField ? block.value : null,
            func: null
          };
        } else if (block.valueIsField) {
          rightSide = { type: "field", field: block.value };
        } else {
          rightSide = { type: "value", value: block.value };
        }

        return {
          logic_link: block.logicLink,
          left: leftSide,
          operator: block.operator,
          right: rightSide,
        };
      }),
    };

    if (ruleType === "common") {
      await invoke("save_common_rule", { rule });
    } else {
      await invoke("save_code_rule", { code: selectedCode, rule });
    }

    setAppDataNeedReload(true);
    setBlocks([{
        field: "",
        func: "",
        expr: "",
        operator: "",
        value: "",
        rightExpr: "",
        valueIsField: false,
        logicLink: "None",
      }
    ]);
    setMessage("");

  };

  const getWeatherOptions = () => {
    const options = [];
    for (const intensity of appData.intensity) {
      for (const descriptor of appData.descriptor) {
        for (const weatherEvent of appData.weather_events) {
          if (weatherEvent.event !== "") {
            options.push({
              label: `${intensity.intensity}${descriptor.descriptor}${weatherEvent.event}`,
              value: `${intensity.intensity}${descriptor.descriptor}${weatherEvent.event}`,
            });
          }
        }
      }
    }
    return options;
  };

  useEffect(() => {
    setCodeOptions(getWeatherOptions());
  }, []);

  return (
    <div>
      <Space>
        <Card title="Тип правила" size="small" type="inner">
          <Select
            value={ruleType}
            style={{ width: 200 }}
            options={[
              { value: "common", label: "Общее правило" },
              { value: "byCode", label: "Правило по коду" },
            ]}
            onChange={(v) => setRuleType(v)}
          />
        </Card>

        {ruleType === "byCode" && (
          <Card title="Код явления" size="small" type="inner">
            <AutoComplete
              options={codeOptions}
              onSelect={setSelectedCode}
              onChange={setSelectedCode}
              placeholder="Введите код"
            >
              <Input />
            </AutoComplete>
          </Card>
        )}
      </Space>

      <Card title="Добавить условие" style={{ width: "100%" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Сообщение об ошибке"
            onChange={(v) => setMessage(v.target.value)}
            value={message}
          />

          {blocks.map((block, i) => (
            <Card
              key={i}
              type="inner"
              title={
                i === 0
                  ? `Блок условия ${i + 1}`
                  : `Блок условия ${i + 1}. Связь: ${blocks[i].logicLink}`
              }
              extra={
                i !== 0 && (
                  <Button onClick={() => deleteBlock(i)}>
                    <DeleteOutlined />
                  </Button>
                )
              }
            >
              <Space wrap style={{ width: "100%" }}>
                {/* Поле */}
                <Card type="inner" title="Поле" size="small">
                  <Select
                    placeholder="Поле"
                    style={{ width: 150 }}
                    value={block.field}
                    onChange={(v) => updateBlock(i, "field", v)}
                    options={appData.conditions.map((c) => ({
                      label: c.description,
                      value: c.condition,
                    }))}
                  />
                </Card>

                {/* Функция */}
                <Card type="inner" title="Функция" size="small">
                  <Select
                    placeholder="Функция"
                    style={{ width: 140 }}
                    value={block.func}
                    onChange={(v) => updateBlock(i, "func", v)}
                    options={funcs}
                  />
                </Card>

                {/* Левое EXPR */}
                <Card type="inner" title="Expr слева" size="small">
                  <Input
                    placeholder="Например: field+5"
                    style={{ width: 150 }}
                    value={block.expr}
                    onChange={(e) => updateBlock(i, "expr", e.target.value)}
                  />
                </Card>

                {/* Оператор */}
                {block.func !== "exists" && (
                  <Card type="inner" title="Оператор" size="small">
                    <Select
                      placeholder="Оператор"
                      style={{ width: 120 }}
                      value={block.operator}
                      onChange={(v) => updateBlock(i, "operator", v)}
                      options={operators.map((o) => ({ label: o, value: o }))}
                    />
                  </Card>
                )}

                {/* Значение/поле */}
                {!block.rightExpr && block.func !== "exists" && (
                  block.valueIsField ? (
                    <Card type="inner" title="Поле справа" size="small">
                      <Select
                        style={{ width: 150 }}
                        value={block.value}
                        onChange={(v) => updateBlock(i, "value", v)}
                        options={appData.conditions.map((c) => ({
                          label: c.description,
                          value: c.condition,
                        }))}
                      />
                    </Card>
                  ) : (
                    <Card type="inner" title="Значение" size="small">
                      <Input
                        style={{ width: 150 }}
                        value={block.value}
                        onChange={(e) => updateBlock(i, "value", e.target.value)}
                      />
                    </Card>
                  )
                )}

                {/* Правое EXPR */}
                {block.func !== "exists" && block.valueIsField && (
                  <Card type="inner" title="Expr справа" size="small">
                    <Input
                      placeholder="Например: field/100"
                      style={{ width: 150 }}
                      value={block.rightExpr}
                      onChange={(e) => updateBlock(i, "rightExpr", e.target.value)}
                    />
                  </Card>
                )}

                {/* Переключатель "значение — поле" */}
                {!block.rightExpr && block.func !== "exists" && (
                  <Checkbox
                    checked={block.valueIsField}
                    onChange={(e) => {
                      updateBlock(i, "valueIsField", e.target.checked);
                      if (e.target.checked) {
                        updateBlock(i, "value", appData.conditions[0].condition);
                      }
                      if (!e.target.checked) {
                        updateBlock(i, "value", "");
                      }
                    }}
                  >
                    Значение — поле
                  </Checkbox>
                )}
              </Space>

              {i === blocks.length - 1 && (
                <Space style={{ marginTop: 15 }}>
                  <Button onClick={() => addBlock("AND")}>+ AND</Button>
                  <Button onClick={() => addBlock("OR")}>+ OR</Button>
                </Space>
              )}
            </Card>
          ))}

          <Button type="primary" onClick={saveNewRule}>
            Сохранить правило
          </Button>
        </Space>
      </Card>
    </div>
  );
}
