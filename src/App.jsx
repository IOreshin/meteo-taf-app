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
import { About } from "./components/About";

async function load_config(name) {
  try {
    const content = await invoke("load_json", { jsonName: name });
    return content;
  } catch (err) {
    alert("Ошибка " + err);
  }
}

function App() {
  const {inputData, appData, setAppData, 
        airports, setAirports, 
        validationRules, setValidationRules,
        appDataNeedReload, setAppDataNeedReload} = useProject();
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
    },
    {
      key: '3',
      label: 'Справка',
      children:
        <About />
    }
  ]

  useEffect(() => {
    if (!validationRules?.common_rules) return;
    const validator = new Validator(validationRules.common_rules, validationRules.rules_by_code, inputData);
    const validatedErrors = validator.validate();
    setErrors(validatedErrors);

  }, [inputData, validationRules]);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const appContent = await load_config("app-data.json");
        setAppData(appContent);

        const airportsContent = await load_config("airports.json");
        setAirports(airportsContent.airports);

        const validationRulesContent = await load_config("validation-rules.json");
        setValidationRules(validationRulesContent);
      } catch (err) {
        console.error("Ошибка загрузки конфигов:", err);
      }
    };
    if (appDataNeedReload)
    {
      fetchConfigs();
      setAppDataNeedReload(false);
    }

  }, [appDataNeedReload]);

  return (
    <div className="app-main">

        <Layout style={{ width: "100%", height: "100vh" }}>
          <Layout>
            <Header>meteo-taf</Header>
            <Content style={{ display: "flex", flexDirection: "column" , overflowY:"auto"}}>
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
