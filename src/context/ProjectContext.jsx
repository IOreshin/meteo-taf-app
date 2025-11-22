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
            wind_dir: 0,
            wind_speed: 0,
            visibility: 0,
            wind_gust: 0,
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
