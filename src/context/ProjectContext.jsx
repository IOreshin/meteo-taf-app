import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
    const [config, setConfig] = useState(null);

    return (
        <ProjectContext.Provider value={{ config, setConfig }}>
            {children}
        </ProjectContext.Provider>
    );
}
