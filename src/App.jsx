import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { OutputFrame } from "./components/OutputFrame";
import {  Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { GroupTabs } from "./components/GroupTabs";
import { useProject } from "./context/ProjectContext";
import { ValidationPanel } from "./components/ValidationPanel";
import { runPython, callFunction } from "tauri-plugin-python-api";

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
              <GroupTabs/>
              <OutputFrame/>
              <ValidationPanel errors={errors}/>
            </Content>
          </Layout>
        </Layout>

    </div>
  );
}

export default App;
