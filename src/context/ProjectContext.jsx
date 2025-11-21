import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [inputData, setInputData] = useState(null);

    return (
        <ProjectContext.Provider value={{
            config, setConfig,
            inputData, setInputData
        }}>
            {children}
        </ProjectContext.Provider>
    );
}
