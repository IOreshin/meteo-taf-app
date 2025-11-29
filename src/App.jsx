import { Children, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { OutputFrame } from "./components/OutputFrame";
import {  Layout, Tabs } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { GroupTabs } from "./components/GroupTabs";
import { useProject } from "./context/ProjectContext";
import { ValidationPanel } from "./components/ValidationPanel";
import { ConditionsPanel } from "./components/ConditionsPanel/ConditionsPanel";
import { Validator } from "./components/Validator/Validator";

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
    if (!config?.common_conditions) return;
    const validator = new Validator(config.common_conditions, inputData);
    const validatedErrors = validator.validate();
    setErrors(validatedErrors);

  }, [inputData, config]);

  useEffect(() => {
    async function load_config() {
      try {
        const content = await invoke("load_json", { jsonName: "config.json" });
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
