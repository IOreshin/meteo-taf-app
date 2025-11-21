import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { OutputFrame } from "./components/OutputFrame";
import {  Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { GroupTabs } from "./components/GroupTabs";
import { useProject } from "./context/ProjectContext";

function App() {
  const {config, setConfig} = useProject();

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
            </Content>
          </Layout>
        </Layout>

    </div>
  );
}

export default App;
