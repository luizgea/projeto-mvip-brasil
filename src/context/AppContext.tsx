
import React, { createContext, useContext, useState, ReactNode } from "react";
import { TerrainData, UrbanParams, BuildingParams, AnalysisResult, FireSafetyItem } from "@/types";
import { useTerrainAnalysis } from "@/hooks/useTerrainAnalysis";

// Define the shape of our context
interface AppContextType {
  // State
  terrainData: TerrainData | null;
  urbanParams: UrbanParams;
  buildingParams: BuildingParams;
  
  // Analysis results (computed from the state)
  analysisResult: AnalysisResult;
  fireSafetyItems: FireSafetyItem[];
  
  // State setters
  setTerrainData: (data: Partial<TerrainData>) => void;
  setUrbanParams: (params: UrbanParams) => void;
  setBuildingParams: <K extends keyof BuildingParams>(key: K, value: BuildingParams[K]) => void;
  setSetbacks: (key: "front" | "back" | "left" | "right", value: number) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Define all the state
  const [terrainData, setTerrainDataState] = useState<TerrainData | null>(null);
  
  const [urbanParams, setUrbanParams] = useState<UrbanParams>({
    coeficienteAproveitamento: 2.5,
    taxaOcupacao: 70,
    alturaMaxima: 45,
    recuos: {
      frontal: 5,
      lateral: 2,
      fundos: 3,
    },
    tdc: 0.5,
    odc: 0.5,
  });
  
  const [buildingParams, setBuildingParamsState] = useState<BuildingParams>({
    width: 15,
    length: 25,
    height: 30,
    floors: 10,
    type: 'residencial',
    setbacks: {
      front: 5,
      back: 3,
      left: 2,
      right: 2,
    }
  });

  // Wrapper for setting terrain data (merges with existing data)
  const setTerrainData = (data: Partial<TerrainData>) => {
    setTerrainDataState(prev => prev ? { ...prev, ...data } : data as TerrainData);
  };

  // Wrapper for setting building params
  const setBuildingParams = <K extends keyof BuildingParams>(key: K, value: BuildingParams[K]) => {
    setBuildingParamsState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper for setting setbacks
  const setSetbacks = (key: "front" | "back" | "left" | "right", value: number) => {
    setBuildingParamsState(prev => ({
      ...prev,
      setbacks: {
        ...prev.setbacks,
        [key]: value,
      },
    }));
  };

  // Use the terrain analysis hook to compute the analysis results
  const { analysisResult, fireSafetyItems } = useTerrainAnalysis(
    terrainData, 
    urbanParams, 
    buildingParams
  );

  // Provide the context value to children
  const contextValue: AppContextType = {
    terrainData,
    urbanParams,
    buildingParams,
    analysisResult,
    fireSafetyItems,
    setTerrainData,
    setUrbanParams,
    setBuildingParams,
    setSetbacks
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
