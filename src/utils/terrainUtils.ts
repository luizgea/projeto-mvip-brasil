
import * as turf from "@turf/turf";
import { FireSafetyItem } from "@/types";

// Normaliza um objeto GeoJSON para garantir que seja um Feature<Polygon>
export const normalizeGeoJSON = (polygon: any): turf.Feature<turf.Polygon> | null => {
  try {
    if (!polygon) return null;
    
    // Se já for um Feature<Polygon>
    if (polygon.type === "Feature" && polygon.geometry && polygon.geometry.type === "Polygon") {
      return polygon as turf.Feature<turf.Polygon>;
    }
    
    // Se for um Polygon direto
    if (polygon.type === "Polygon" && polygon.coordinates) {
      return turf.feature(polygon);
    }
    
    // Se for uma FeatureCollection, pegar o primeiro Feature
    if (polygon.type === "FeatureCollection" && polygon.features && polygon.features.length > 0) {
      const firstFeature = polygon.features[0];
      if (firstFeature.geometry && firstFeature.geometry.type === "Polygon") {
        return firstFeature as turf.Feature<turf.Polygon>;
      }
    }
    
    console.error("Formato de polígono não suportado:", polygon);
    return null;
  } catch (error) {
    console.error("Erro ao normalizar GeoJSON:", error);
    return null;
  }
};

// Calcula a área de um polígono GeoJSON
export const calculateArea = (polygon: any): number => {
  try {
    const normalizedPolygon = normalizeGeoJSON(polygon);
    if (!normalizedPolygon) return 0;
    
    const area = turf.area(normalizedPolygon);
    return Math.round(area); // em metros quadrados, arredondado
  } catch (error) {
    console.error("Erro ao calcular área do polígono:", error);
    return 0;
  }
};

// Computa a forma construtível baseada no polígono do terreno e recuos
export const computeBuildableShape = (lot: any, recuos: { frontal: number, lateral: number, fundos: number }): any => {
  try {
    const normalizedLot = normalizeGeoJSON(lot);
    if (!normalizedLot) return null;
    
    // Calcular o buffer negativo com o recuo máximo
    const maxRecuo = Math.max(recuos.frontal, recuos.lateral, recuos.fundos);
    const negativeBuffer = turf.buffer(normalizedLot, -maxRecuo, { units: "meters" });
    
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
): FireSafetyItem[] => {
  return [
    {
      id: "escada",
      description: "Escada enclausurada",
      applicable: alturaMaxima > 24 || floors > 3,
      compliant: null,
      details: "Exigido para edificações com mais de 3 pavimentos ou altura superior a 24m"
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
      description: "Hidrantes e mangotinhos",
      applicable: builtArea > 200,
      compliant: null,
      details: "Requisitos conforme IT-17 do CBMMG, 1 hidrante a cada 800m²"
    },
    {
      id: "extintores",
      description: "Extintores portáteis",
      applicable: true,
      compliant: null,
      details: "Classe ABC, 1 extintor a cada 200m², conforme IT-16 do CBMMG"
    },
    {
      id: "rota",
      description: "Rota acessível e iluminada",
      applicable: true,
      compliant: null,
      details: "Obrigatório para todas as edificações conforme NBR 9050"
    },
    {
      id: "pressurizacao",
      description: "Pressurização de escada",
      applicable: floors > 6 || alturaMaxima > 30,
      compliant: null,
      details: "Exigido para edificações com mais de 6 pavimentos ou altura superior a 30m"
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
      id: "sinalizacao",
      description: "Sinalização de emergência",
      applicable: true,
      compliant: null,
      details: "Obrigatório conforme NBR 13434 e IT-15 do CBMMG"
    },
    {
      id: "iluminacao",
      description: "Iluminação de emergência",
      applicable: true,
      compliant: null,
      details: "Obrigatório conforme NBR 10898, autonomia mínima de 1h"
    },
    {
      id: "resistencia",
      description: "Resistência ao fogo das estruturas",
      applicable: true,
      compliant: null,
      details: "Conforme NBR 15575, TRRF varia de acordo com o uso e altura do edifício"
    },
    {
      id: "brigada",
      description: "Brigada de incêndio",
      applicable: builtArea > 2000 || floors > 4,
      compliant: null,
      details: "Exigido para edificações com área superior a 2000m² ou mais de 4 pavimentos"
    }
  ];
};
