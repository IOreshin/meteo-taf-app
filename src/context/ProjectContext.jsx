import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [inputData, setInputData] = useState({
        "0": {
            city: "",
            issue_time: "",
            time_from: "",
            time_to: "",
            wind_dir: "",
            wind_speed: "",
            visibility: "",
            wind_gust: "",
            weather_events: [],
            clouds_entries: []
        }
    });

    return (
        <ProjectContext.Provider value={{
            config, setConfig,
            inputData, setInputData
        }}>
            {children}
        </ProjectContext.Provider>
    );
}
