
import React, { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import TerrenoUrbanismoTab from "./TerrenoUrbanismoTab";
import VolumetriaTab from "./VolumetriaTab";
import ConformidadeTab from "./ConformidadeTab";
import RelatorioTab from "./RelatorioTab";
import { TerrainData, UrbanParams, BuildingParams } from "@/types";
import { useTerrainAnalysis } from "@/hooks/useTerrainAnalysis";

const Index = () => {
  const [activeTab, setActiveTab] = useState("terreno");
  
  // Estado centralizado para parâmetros urbanísticos
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
  
  // Estado centralizado para dados do terreno
  const [terrainData, setTerrainData] = useState<TerrainData | null>(null);
  
  // Estado centralizado para parâmetros da edificação
  const [buildingParams, setBuildingParams] = useState<BuildingParams>({
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

  // Handler para alteração de building parameters
  const handleBuildingParamChange = <K extends keyof BuildingParams>(key: K, value: BuildingParams[K]) => {
    setBuildingParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler para alteração de setbacks
  const handleSetbackChange = (key: "front" | "back" | "left" | "right", value: number) => {
    setBuildingParams((prev) => ({
      ...prev,
      setbacks: {
        ...prev.setbacks,
        [key]: value,
      },
    }));
  };

  // Handler para alteração de terrain data
  const handleTerrainDataChange = (data: Partial<TerrainData>) => {
    setTerrainData(prev => prev ? { ...prev, ...data } : data as TerrainData);
  };

  // Usar o hook para cálculos de análise
  const { analysisResult, fireSafetyItems } = useTerrainAnalysis(
    terrainData, 
    urbanParams, 
    buildingParams
  );

  // Renderiza a aba ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case "terreno":
        return (
          <TerrenoUrbanismoTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            onUrbanParamsChange={setUrbanParams}
            onTerrainDataChange={handleTerrainDataChange}
          />
        );
      case "volumetria":
        return (
          <VolumetriaTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            buildingParams={buildingParams}
            analysisResult={analysisResult}
            onBuildingParamChange={handleBuildingParamChange}
            onSetbackChange={handleSetbackChange}
          />
        );
      case "conformidade":
        return (
          <ConformidadeTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            buildingWidth={buildingParams.width}
            buildingLength={buildingParams.length}
            buildingHeight={buildingParams.height}
            floors={buildingParams.floors}
            analysisResult={analysisResult}
            fireSafetyItems={fireSafetyItems}
            onFireSafetyItemChange={(id, compliant) => {
              // Using the setter function directly since fireSafetyItems comes from the hook
            }}
          />
        );
      case "relatorio":
        return (
          <RelatorioTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            analysisResult={analysisResult}
            fireSafetyItems={fireSafetyItems}
            buildingParams={buildingParams}
          />
        );
      default:
        return (
          <TerrenoUrbanismoTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            onUrbanParamsChange={setUrbanParams}
            onTerrainDataChange={handleTerrainDataChange}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto">
            <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>
        <div className="tab-content">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Index;
