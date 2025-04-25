
import React, { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import TerrenoUrbanismoTab from "./TerrenoUrbanismoTab";
import VolumetriaTab from "./VolumetriaTab";
import ConformidadeTab from "./ConformidadeTab";
import RelatorioTab from "./RelatorioTab";
import { TerrainData, UrbanParams, AnalysisResult, FireSafetyItem } from "@/types";

const Index = () => {
  const [activeTab, setActiveTab] = useState("terreno");
  
  // Estado para parâmetros urbanísticos
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
  
  // Estado para dados do terreno
  const [terrainData, setTerrainData] = useState<TerrainData | null>(null);
  
  // Estado para dimensões do edifício
  const [buildingWidth, setBuildingWidth] = useState(15);
  const [buildingLength, setBuildingLength] = useState(25);
  const [buildingHeight, setBuildingHeight] = useState(30);
  const [floors, setFloors] = useState(10);
  
  // Estado para análise de resultados
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    coeficienteAproveitamento: {
      permitido: 2.5,
      projetado: 2.1,
      conforme: true,
    },
    taxaOcupacao: {
      permitida: 70,
      projetada: 60,
      conforme: true,
    },
    alturaMaxima: {
      permitida: 45,
      projetada: 30,
      conforme: true,
    },
    recuos: {
      frontal: {
        permitido: 5,
        projetado: 5,
        conforme: true,
      },
      lateral: {
        permitido: 2,
        projetado: 3,
        conforme: true,
      },
      fundos: {
        permitido: 3,
        projetado: 3,
        conforme: true,
      },
    },
  });
  
  // Estado para checklist de segurança contra incêndio
  const [fireSafetyItems, setFireSafetyItems] = useState<FireSafetyItem[]>([
    {
      id: "1",
      description: "Escada enclausurada",
      applicable: true,
      compliant: null,
      details: "Exigido para edificações com mais de 2 pavimentos",
    },
    {
      id: "2",
      description: "Duas saídas independentes",
      applicable: true,
      compliant: null,
      details: "Exigido para área construída superior a 750m²",
    },
    {
      id: "3",
      description: "Hidrantes e extintores",
      applicable: true,
      compliant: null,
      details: "",
    },
    {
      id: "4",
      description: "Rota acessível e iluminada",
      applicable: true,
      compliant: null,
      details: "",
    },
    {
      id: "5",
      description: "Pressurização de escada",
      applicable: true,
      compliant: null,
      details: "Exigido para edificações com mais de 6 pavimentos",
    },
  ]);

  // Renderiza a aba ativa
  const renderActiveTab = () => {
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
          />
        );
      case "conformidade":
        return (
          <ConformidadeTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            buildingWidth={buildingWidth}
            buildingLength={buildingLength}
            buildingHeight={buildingHeight}
            floors={floors}
          />
        );
      case "relatorio":
        return (
          <RelatorioTab
            urbanParams={urbanParams}
            terrainData={terrainData}
            analysisResult={analysisResult}
            fireSafetyItems={fireSafetyItems}
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
