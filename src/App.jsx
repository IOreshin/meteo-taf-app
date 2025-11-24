import { Children, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { OutputFrame } from "./components/OutputFrame";
import {  Layout, Tabs } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { GroupTabs } from "./components/GroupTabs";
import { useProject } from "./context/ProjectContext";
import { ValidationPanel } from "./components/ValidationPanel";
import { callFunction } from "tauri-plugin-python-api";
import { ConditionsPanel } from "./components/ConditionsPanel/ConditionsPanel";


async function validateAllData(data, rules) {
  try {
    const result = await callFunction("validate_all_data", [data, rules]);
    return result;
  } catch (err) {
    console.log(err);
    return ["Python error"];
  }
}

function App() {
  const {config, setConfig, inputData} = useProject();
  const [errors, setErrors] = useState([]);

  const appTabs = [
    {
      key: '1',
      label: 'Составление прогноза',
      children: 
        <div>
          <GroupTabs />
          <OutputFrame />
          <ValidationPanel errors={errors} />
        </div>
    },
    {
      key: '2',
      label: 'Управление условиями',
      children:
        <div>
          <ConditionsPanel />
        </div>
    }
  ]

  useEffect(() => {
    if (!config) return;

    (async () => {
      const rulesForPython = {
        checks: config.checks,
        weather_code_rules: config.weather_code_rules
      };

      const errors = await validateAllData(inputData, rulesForPython);
      const parsedErrors = JSON.parse(errors);
      setErrors(parsedErrors);

    })();
  }, [inputData]);

  useEffect(() => {
    async function load_config() {
      try {
        const content = await invoke("load_json");
        setConfig(content);
      } catch (err) {
        alert("Ошибка " + err);
      }
    }

    if (!config) {
      load_config();
    }
  }, [])

  return (
    <div className="app-main">

        <Layout style={{ width: "100%", height: "100vh" }}>
          <Layout>
            <Header>meteo-taf</Header>
            <Content style={{ display: "flex", flexDirection: "column" }}>
              <Tabs 
                items={appTabs}
                type="card"
              />
            </Content>
          </Layout>
        </Layout>

    </div>
  );
}

export default App;
