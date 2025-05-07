
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import TerrenoUrbanismoTab from "./TerrenoUrbanismoTab";
import VolumetriaTab from "./VolumetriaTab";
import ConformidadeTab from "./ConformidadeTab";
import RelatorioTab from "./RelatorioTab";
import { TerrainData, UrbanParams, AnalysisResult, FireSafetyItem, BuildingParams } from "@/types";
import { calculateArea, computeBuildableShape, generateFireSafetyItems } from "@/utils/terrainUtils";
import * as turf from "@turf/turf";

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
    buildableShape: null
  });
  
  // Estado para checklist de segurança contra incêndio
  const [fireSafetyItems, setFireSafetyItems] = useState<FireSafetyItem[]>([]);

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

  // useEffect para recalcular analysisResult quando os parâmetros mudarem
  useEffect(() => {
    if (!terrainData) return;

    // Calcular área do terreno usando Turf.js
    let terrenoArea = terrainData.area; // Valor padrão 
    let buildableShape = null;
    
    if (terrainData.polygon) {
      try {
        terrenoArea = calculateArea(terrainData.polygon);
        buildableShape = computeBuildableShape(terrainData.polygon, urbanParams.recuos);
      } catch (error) {
        console.error("Erro ao calcular área com Turf.js:", error);
      }
    }
    
    // Cálculo de área construída
    const floorArea = buildingParams.width * buildingParams.length;
    const totalBuiltArea = floorArea * buildingParams.floors;
    
    // Cálculo de CA
    const calculatedCA = totalBuiltArea / terrenoArea;
    
    // Cálculo de TO
    const taxaOcupacao = (floorArea / terrenoArea) * 100;
    
    // Análise de conformidade
    const newResult: AnalysisResult = {
      coeficienteAproveitamento: {
        permitido: urbanParams.coeficienteAproveitamento,
        projetado: parseFloat(calculatedCA.toFixed(2)),
        conforme: calculatedCA <= urbanParams.coeficienteAproveitamento,
      },
      taxaOcupacao: {
        permitida: urbanParams.taxaOcupacao,
        projetada: parseFloat(taxaOcupacao.toFixed(2)),
        conforme: taxaOcupacao <= urbanParams.taxaOcupacao,
      },
      alturaMaxima: {
        permitida: urbanParams.alturaMaxima,
        projetada: buildingParams.height,
        conforme: buildingParams.height <= urbanParams.alturaMaxima,
      },
      recuos: {
        frontal: {
          permitido: urbanParams.recuos.frontal,
          projetado: buildingParams.setbacks.front,
          conforme: buildingParams.setbacks.front >= urbanParams.recuos.frontal,
        },
        lateral: {
          permitido: urbanParams.recuos.lateral,
          projetado: Math.min(buildingParams.setbacks.left, buildingParams.setbacks.right),
          conforme: buildingParams.setbacks.left >= urbanParams.recuos.lateral && buildingParams.setbacks.right >= urbanParams.recuos.lateral,
        },
        fundos: {
          permitido: urbanParams.recuos.fundos,
          projetado: buildingParams.setbacks.back,
          conforme: buildingParams.setbacks.back >= urbanParams.recuos.fundos,
        },
      },
      terrenoArea: terrenoArea,
      builtArea: totalBuiltArea,
      maxAllowed: terrenoArea * urbanParams.coeficienteAproveitamento,
      buildableShape: buildableShape
    };
    
    setAnalysisResult(newResult);
    
    // Gerar items de segurança contra incêndio baseado nos parâmetros calculados
    const newFireSafetyItems = generateFireSafetyItems(
      buildingParams.height, 
      totalBuiltArea, 
      buildingParams.floors
    );
    
    setFireSafetyItems(newFireSafetyItems);
    
  }, [urbanParams, terrainData, buildingParams]);

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
              setFireSafetyItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, compliant } : item))
              );
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
