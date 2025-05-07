
// Tipos para parâmetros urbanísticos
export interface UrbanParams {
  coeficienteAproveitamento: number;
  taxaOcupacao: number;
  alturaMaxima: number;
  recuos: {
    frontal: number;
    lateral: number;
    fundos: number;
  };
  tdc: number; // Transferência do Direito de Construir
  odc: number; // Outorga Onerosa de Direito de Construir
}

// Tipos para dados do terreno
export interface TerrainData {
  address: string;
  area: number;
  zoneamento: string;
  limitacoes: string[];
  cotas: {
    minima: number;
    maxima: number;
  };
  coordinates?: [number, number]; // [latitude, longitude] 
  latitude?: number;
  longitude?: number;
  // geometria do lote retornada pelo WFS (GeoJSON Polygon ou FeatureCollection)
  polygon?: GeoJSON.FeatureCollection<GeoJSON.Polygon> | GeoJSON.Polygon;
  // opcional: geometria unificada (pode apontar para polygon)
  geometry?: GeoJSON.Polygon;
  // dados de zoneamento (sigla e descrição)
  zone?: { sigla: string; descricao: string };
  // áreas para análise
  terrenoArea?: number;
  builtArea?: number;
  maxAllowed?: number;
  buildableShape?: GeoJSON.Polygon;
}

// Tipos para parâmetros da edificação
export interface BuildingParams {
  width: number;
  length: number;
  height: number;
  floors: number;
  type: 'residencial' | 'comercial' | 'misto';
  setbacks: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
}

// Tipos para checklist de conformidade
export interface ComplianceItem {
  id: string;
  description: string;
  isCompliant: boolean;
  details: string;
}

// Tipos para resultado da análise
export interface AnalysisResult {
  coeficienteAproveitamento: {
    permitido: number;
    projetado: number;
    conforme: boolean;
  };
  taxaOcupacao: {
    permitida: number;
    projetada: number;
    conforme: boolean;
  };
  alturaMaxima: {
    permitida: number;
    projetada: number;
    conforme: boolean;
  };
  recuos: {
    frontal: {
      permitido: number;
      projetado: number;
      conforme: boolean;
    };
    lateral: {
      permitido: number;
      projetado: number;
      conforme: boolean;
    };
    fundos: {
      permitido: number;
      projetado: number;
      conforme: boolean;
    };
  };
  terrenoArea?: number;
  builtArea?: number;
  maxAllowed?: number;
  buildableShape?: any;
}

// Tipos para checklist de segurança contra incêndio
export interface FireSafetyItem {
  id: string;
  description: string;
  applicable: boolean;
  compliant: boolean | null;
  details: string;
}
