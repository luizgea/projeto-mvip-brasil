
import * as turf from "@turf/turf";

// Calcula a área de um polígono GeoJSON
export const calculateArea = (polygon: any): number => {
  try {
    if (!polygon) return 0;
    
    // Converter para formato esperado pelo Turf se necessário
    let feature;
    
    if (polygon.type === "Polygon") {
      feature = turf.polygon(polygon.coordinates);
    } else if (polygon.type === "MultiPolygon") {
      feature = turf.multiPolygon(polygon.coordinates);
    } else if (polygon.type === "Feature" && polygon.geometry) {
      feature = polygon;
    } else {
      console.error("Formato de polígono não suportado:", polygon);
      return 0;
    }
    
    const area = turf.area(feature);
    return area; // em metros quadrados
  } catch (error) {
    console.error("Erro ao calcular área do polígono:", error);
    return 0;
  }
};

// Computa a forma construtível baseada no polígono do terreno e recuos
export const computeBuildableShape = (lot: any, recuos: { frontal: number, lateral: number, fundos: number }): any => {
  try {
    if (!lot) return null;
    
    // Converter para formato esperado pelo Turf se necessário
    let feature;
    
    if (lot.type === "Polygon") {
      feature = turf.polygon(lot.coordinates);
    } else if (lot.type === "MultiPolygon") {
      feature = turf.multiPolygon(lot.coordinates);
    } else if (lot.type === "Feature" && lot.geometry) {
      feature = lot;
    } else {
      console.error("Formato de polígono não suportado:", lot);
      return null;
    }
    
    // Calcular o buffer negativo máximo
    const maxRecuo = Math.max(recuos.frontal, recuos.lateral, recuos.fundos);
    const negativeBuffer = turf.buffer(feature, -maxRecuo, { units: "meters" });
    
    return negativeBuffer;
  } catch (error) {
    console.error("Erro ao computar forma construtível:", error);
    return null;
  }
};

// Gera checklist de segurança contra incêndio com base nos parâmetros
export const generateFireSafetyItems = (
  alturaMaxima: number, 
  builtArea: number, 
  floors: number
) => {
  return [
    {
      id: "escada",
      description: "Escada enclausurada",
      applicable: alturaMaxima > 12 || floors > 2,
      compliant: null,
      details: "Exigido para edificações com mais de 2 pavimentos ou altura superior a 12m"
    },
    {
      id: "saidas",
      description: "Duas saídas independentes",
      applicable: builtArea > 750 || floors > 3,
      compliant: null,
      details: "Exigido para área construída superior a 750m² ou mais de 3 pavimentos"
    },
    {
      id: "hidrantes",
      description: "Hidrantes e extintores",
      applicable: builtArea > 750,
      compliant: null,
      details: "Requisitos conforme IT-08 do CBMMG"
    },
    {
      id: "rota",
      description: "Rota acessível e iluminada",
      applicable: true,
      compliant: null,
      details: "Obrigatório para todas as edificações"
    },
    {
      id: "pressurização",
      description: "Pressurização de escada",
      applicable: floors > 6 || alturaMaxima > 18,
      compliant: null,
      details: "Exigido para edificações com mais de 6 pavimentos ou altura superior a 18m"
    },
    {
      id: "ventilacao",
      description: "Ventilação forçada",
      applicable: builtArea > 1000,
      compliant: null,
      details: "Exigido para edificações com área superior a 1000m²"
    },
    {
      id: "alarme",
      description: "Sistema de alarme",
      applicable: builtArea > 500 || floors > 2,
      compliant: null,
      details: "Exigido para edificações com área superior a 500m² ou mais de 2 pavimentos"
    },
    {
      id: "sinalização",
      description: "Sinalização de emergência",
      applicable: true,
      compliant: null,
      details: "Obrigatório conforme NBR 13434"
    },
    {
      id: "iluminação",
      description: "Iluminação de emergência",
      applicable: true,
      compliant: null,
      details: "Obrigatório conforme NBR 10898, autonomia mínima de 1h"
    },
    {
      id: "resistência",
      description: "Resistência ao fogo das estruturas",
      applicable: true,
      compliant: null,
      details: "Conforme NBR 15575, varia de acordo com o uso do edifício"
    }
  ];
};
