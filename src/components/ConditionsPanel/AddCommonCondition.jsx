import React, { useState } from "react";
import { Form, Select, Input, Checkbox, Button, Card, Space, Divider } from "antd";

const fields = [
  "wind_speed", "wind_gust", "visibility",
  "issue_time", "time_from", "time_to"
];

const funcs = [
  { label: "Нет", value: "" },
  { label: "exists(x)", value: "exists" },
  { label: "to_int(x)", value: "to_int" },
  { label: "to_float(x)", value: "to_float" },
  { label: "len(x)", value: "len" }
];

const operators = ["==", "!=", "<", ">", "<=", ">="];

export function AddCommonCondition({ onSave }) {
  const [blocks, setBlocks] = useState([
    { field: "", func: "", operator: "", value: "", valueIsField: false }
  ]);

  const [logicLinks, setLogicLinks] = useState([]);
  const [message, setMessage] = useState("");

  const updateBlock = (idx, key, val) => {
    const newBlocks = [...blocks];
    newBlocks[idx][key] = val;
    setBlocks(newBlocks);
  };

  const addBlock = (logic) => {
    setLogicLinks([...logicLinks, logic]);
    setBlocks([
      ...blocks,
      { field: "", func: "", operator: "", value: "", valueIsField: false }
    ]);
  };

  const buildConditionString = () => {
    return blocks
      .map((b, i) => {
        // exists(field)
        if (b.func === "exists") {
          return `exists(${b.field})`;
        }

        // обычное выражение
        let left = b.func ? `${b.func}(${b.field})` : b.field;
        let right = b.valueIsField ? b.value : JSON.stringify(b.value);

        return `${left} ${b.operator} ${right}`;
      })
      .map((txt, i) => (i === 0 ? txt : `${logicLinks[i - 1]} ${txt}`))
      .join(" ");
  };

  const handleSave = () => {
    const condition = buildConditionString();
    onSave({ condition, message });
  };

  return (
    <Card title="Добавить условие" bordered style={{ width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        
        {blocks.map((b, i) => (
          <Card
            key={i}
            type="inner"
            title={`Блок условия ${i + 1}`}
            style={{ background: "#fafafa" }}
          >
            <Space wrap style={{ width: "100%" }}>

              {/* Поле */}
              <Select
                placeholder="Поле"
                style={{ width: 150 }}
                value={b.field}
                onChange={(v) => updateBlock(i, "field", v)}
                options={fields.map(f => ({ label: f, value: f }))}
              />

              {/* Функция */}
              <Select
                placeholder="Функция"
                style={{ width: 150 }}
                value={b.func}
                onChange={(v) => updateBlock(i, "func", v)}
                options={funcs}
              />

              {/* Оператор */}
              {b.func !== "exists" && (
                <Select
                  placeholder="Оператор"
                  style={{ width: 120 }}
                  value={b.operator}
                  onChange={(v) => updateBlock(i, "operator", v)}
                  options={operators.map(o => ({ label: o, value: o }))}
                />
              )}

                {/* Значение */}
                {b.func !== "exists" && (
                b.valueIsField ? (
                    <Select
                    placeholder="Поле-значение"
                    style={{ width: 150 }}
                    value={b.value}
                    onChange={(v) => updateBlock(i, "value", v)}
                    options={fields.map(f => ({ label: f, value: f }))}
                    />
                ) : (
                    <Input
                    placeholder="Значение"
                    style={{ width: 150 }}
                    value={b.value}
                    onChange={(e) => updateBlock(i, "value", e.target.value)}
                    />
                )
                )}

                {/* Переключатель "значение = поле" */}
                {b.func !== "exists" && (
                <Checkbox
                    checked={b.valueIsField}
                    onChange={(e) => {
                    updateBlock(i, "valueIsField", e.target.checked);

                    // Если включили "значение = поле", сразу подставим первое поле
                    if (e.target.checked) {
                        updateBlock(i, "value", fields[0]);
                    }
                    }}
                >
                    Значение — поле
                </Checkbox>
                )}
            </Space>

            {/* AND / OR для следующего блока */}
            {i === blocks.length - 1 && (
              <Space style={{ marginTop: 15 }}>
                <Button onClick={() => addBlock("and")}>+ AND</Button>
                <Button onClick={() => addBlock("or")}>+ OR</Button>
              </Space>
            )}
          </Card>
        ))}

        <Divider />

        {/* Сообщение */}
        <Form.Item label="Сообщение">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение"
          />
        </Form.Item>

        <Button type="primary" onClick={handleSave}>
          Сохранить
        </Button>

        {/* Предпросмотр */}
        <Card size="small" title="Предпросмотр" style={{ background: "#f0f0f0" }}>
          <pre style={{ margin: 0 }}>{buildConditionString()}</pre>
        </Card>
      </Space>
    </Card>
  );
}
