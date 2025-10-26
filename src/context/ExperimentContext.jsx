"use client";

import React, { createContext, useContext, useState } from 'react';

const ExperimentContext = createContext();

export const ExperimentProvider = ({ children }) => {
    const [experiments, setExperiments] = useState([]);

    return (
        <ExperimentContext.Provider value={{ experiments, setExperiments }}>
            {children}
        </ExperimentContext.Provider>
    );
};

export const useExperiments = () => {
    const context = useContext(ExperimentContext);
    if (!context)
        throw new Error("useAppContext must be used within an AppProvider");
    return context;
}

// export const useExperiments = () => useContext(ExperimentContext);