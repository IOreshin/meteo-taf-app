import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
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
    const [appData, setAppData] = useState(null);
    const [airports, setAirports] = useState(null);
    const [validationRules, setValidationRules] = useState(null);
    const [appDataNeedReload, setAppDataNeedReload] = useState(true);

    return (
        <ProjectContext.Provider value={{
            inputData, setInputData,
            appData, setAppData,
            airports, setAirports,
            validationRules, setValidationRules,
            appDataNeedReload, setAppDataNeedReload
        }}>
            {children}
        </ProjectContext.Provider>
    );
}
