
import React from "react";
import TerrenoUrbanismoTab from "@/pages/TerrenoUrbanismoTab";
import VolumetriaTab from "@/pages/VolumetriaTab";
import ConformidadeTab from "@/pages/ConformidadeTab";
import RelatorioTab from "@/pages/RelatorioTab";
import { useAppContext } from "@/context/AppContext";

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const {
    urbanParams,
    terrainData,
    buildingParams,
    analysisResult,
    fireSafetyItems,
    setTerrainData,
    setUrbanParams,
    setBuildingParams,
    setSetbacks
  } = useAppContext();

  switch (activeTab) {
    case "terreno":
      return (
        <TerrenoUrbanismoTab
          urbanParams={urbanParams}
          terrainData={terrainData}
          onUrbanParamsChange={setUrbanParams}
          onTerrainDataChange={setTerrainData}
        />
      );
    case "volumetria":
      return (
        <VolumetriaTab
          urbanParams={urbanParams}
          terrainData={terrainData}
          buildingParams={buildingParams}
          analysisResult={analysisResult}
          onBuildingParamChange={setBuildingParams}
          onSetbackChange={setSetbacks}
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
            // This is handled by the hook now
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
          onTerrainDataChange={setTerrainData}
        />
      );
  }
};

export default TabContent;
