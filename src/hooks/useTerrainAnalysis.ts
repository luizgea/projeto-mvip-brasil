
import { useState, useEffect } from "react";
import { TerrainData, UrbanParams, BuildingParams, AnalysisResult, FireSafetyItem } from "@/types";
import * as turf from "@turf/turf";
import { calculateArea, computeBuildableShape, generateFireSafetyItems } from "@/utils/terrainUtils";

export const useTerrainAnalysis = (
  terrainData: TerrainData | null,
  urbanParams: UrbanParams,
  buildingParams: BuildingParams
) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    coeficienteAproveitamento: {
      permitido: 2.5,
      projetado: 0,
      conforme: true,
    },
    taxaOcupacao: {
      permitida: 70,
      projetada: 0,
      conforme: true,
    },
    alturaMaxima: {
      permitida: 45,
      projetada: 0,
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
        projetado: 2,
        conforme: true,
      },
      fundos: {
        permitido: 3,
        projetado: 3,
        conforme: true,
      },
    }
  });

  const [fireSafetyItems, setFireSafetyItems] = useState<FireSafetyItem[]>([]);

  useEffect(() => {
    // Recalcular tudo quando mudar terrainData, urbanParams ou buildingParams
    if (!terrainData) return;
    
    // Calcular área do terreno
    let terrenoArea = terrainData.area; // Usar área informada como padrão
    let buildableShape = null;
    
    if (terrainData.polygon) {
      try {
        // Calcular área exata com Turf se tivermos o polígono
        terrenoArea = calculateArea(terrainData.polygon);
        
        // Computar forma construtível com recuos
        buildableShape = computeBuildableShape(terrainData.polygon, {
          frontal: urbanParams.recuos.frontal,
          lateral: urbanParams.recuos.lateral,
          fundos: urbanParams.recuos.fundos
        });
        
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
    
    // Gerar checklist de incêndio com base nos parâmetros calculados
    const newFireSafetyItems = generateFireSafetyItems(
      buildingParams.height,
      totalBuiltArea,
      buildingParams.floors
    );
    
    setFireSafetyItems(newFireSafetyItems);
    
  }, [terrainData, urbanParams, buildingParams]);

  return { analysisResult, fireSafetyItems };
};
