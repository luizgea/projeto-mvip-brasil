
import React, { useState, useEffect } from "react";
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
  
  // Estado para dimensões do edifício - CENTRALIZADO
  const [buildingWidth, setBuildingWidth] = useState(15);
  const [buildingLength, setBuildingLength] = useState(25);
  const [buildingHeight, setBuildingHeight] = useState(30);
  const [floors, setFloors] = useState(10);
  const [buildingType, setBuildingType] = useState("residencial");
  const [setbacks, setSetbacks] = useState({
    front: 5,
    back: 3,
    left: 2,
    right: 2,
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
  });
  
  // Estado para checklist de segurança contra incêndio
  const [fireSafetyItems, setFireSafetyItems] = useState<FireSafetyItem[]>([]);

  // Handler para alteração de setbacks
  const handleSetbackChange = (key: "front" | "back" | "left" | "right", value: number) => {
    setSetbacks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // useEffect para recalcular analysisResult quando os parâmetros mudarem
  useEffect(() => {
    if (terrainData) {
      // Cálculo de área construída
      const floorArea = buildingWidth * buildingLength;
      const totalBuiltArea = floorArea * floors;
      
      // Cálculo de CA
      const calculatedCA = totalBuiltArea / terrainData.area;
      
      // Cálculo de TO
      const taxaOcupacao = (floorArea / terrainData.area) * 100;
      
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
          projetada: buildingHeight,
          conforme: buildingHeight <= urbanParams.alturaMaxima,
        },
        recuos: {
          frontal: {
            permitido: urbanParams.recuos.frontal,
            projetado: setbacks.front,
            conforme: setbacks.front >= urbanParams.recuos.frontal,
          },
          lateral: {
            permitido: urbanParams.recuos.lateral,
            projetado: Math.min(setbacks.left, setbacks.right),
            conforme: setbacks.left >= urbanParams.recuos.lateral && setbacks.right >= urbanParams.recuos.lateral,
          },
          fundos: {
            permitido: urbanParams.recuos.fundos,
            projetado: setbacks.back,
            conforme: setbacks.back >= urbanParams.recuos.fundos,
          },
        },
      };
      
      setAnalysisResult(newResult);
    }
  }, [urbanParams, terrainData, buildingWidth, buildingLength, buildingHeight, floors, setbacks]);

  // useEffect para gerar checklist de segurança contra incêndio
  useEffect(() => {
    if (terrainData) {
      const floorArea = buildingWidth * buildingLength;
      const totalBuiltArea = floorArea * floors;
      const buildingHeightInMeters = buildingHeight;
      
      // Lista completa de itens de segurança contra incêndio
      const newFireSafetyItems: FireSafetyItem[] = [
        {
          id: "1",
          description: "Escada enclausurada",
          applicable: floors > 2 || buildingHeightInMeters > 12,
          compliant: null,
          details: "Exigido para edificações com mais de 2 pavimentos ou altura superior a 12m",
        },
        {
          id: "2",
          description: "Duas saídas independentes",
          applicable: floorArea > 750 || floors > 3,
          compliant: null,
          details: "Exigido para área construída superior a 750m² ou mais de 3 pavimentos",
        },
        {
          id: "3",
          description: "Hidrantes e extintores",
          applicable: totalBuiltArea > 750,
          compliant: null,
          details: "Requisitos conforme IT-08 do CBMMG",
        },
        {
          id: "4",
          description: "Rota acessível e iluminada",
          applicable: true,
          compliant: null,
          details: "Obrigatório para todas as edificações",
        },
        {
          id: "5",
          description: "Pressurização de escada",
          applicable: floors > 6 || buildingHeightInMeters > 18,
          compliant: null,
          details: "Exigido para edificações com mais de 6 pavimentos ou altura superior a 18m",
        },
        {
          id: "6",
          description: "Ventilação forçada",
          applicable: floorArea > 1000,
          compliant: null,
          details: "Exigido para edificações com área superior a 1000m²",
        },
        {
          id: "7",
          description: "Sistema de alarme",
          applicable: floorArea > 500 || floors > 2,
          compliant: null,
          details: "Exigido para edificações com área superior a 500m² ou mais de 2 pavimentos",
        },
        {
          id: "8",
          description: "Sinalização de emergência",
          applicable: true,
          compliant: null,
          details: "Obrigatório conforme NBR 13434",
        },
        {
          id: "9",
          description: "Iluminação de emergência",
          applicable: true,
          compliant: null,
          details: "Obrigatório conforme NBR 10898, autonomia mínima de 1h",
        },
        {
          id: "10",
          description: "Resistência ao fogo das estruturas",
          applicable: true,
          compliant: null,
          details: "Conforme NBR 15575, varia de acordo com o uso do edifício",
        }
      ];
      
      setFireSafetyItems(newFireSafetyItems);
    }
  }, [terrainData, buildingWidth, buildingLength, buildingHeight, floors]);

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
            buildingWidth={buildingWidth}
            buildingLength={buildingLength}
            buildingHeight={buildingHeight}
            floors={floors}
            buildingType={buildingType}
            setbacks={setbacks}
            onWidthChange={setBuildingWidth}
            onLengthChange={setBuildingLength}
            onHeightChange={setBuildingHeight}
            onFloorsChange={setFloors}
            onBuildingTypeChange={setBuildingType}
            onSetbackChange={handleSetbackChange}
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
