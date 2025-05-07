
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TerrainData } from "@/types";

interface GeoJSONUploaderProps {
  onGeoJSONLoaded: (terrainData: Partial<TerrainData>) => void;
}

const GeoJSONUploader: React.FC<GeoJSONUploaderProps> = ({ onGeoJSONLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".geojson") && !file.name.endsWith(".json")) {
      toast({
        title: "Formato incorreto",
        description: "Por favor, selecione um arquivo GeoJSON (.geojson ou .json)",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileContent = await file.text();
      const geoJSON = JSON.parse(fileContent);

      // Verificar se o GeoJSON contém uma geometria válida
      if (!geoJSON || !geoJSON.type || !geoJSON.geometry) {
        // Tentar detectar se é o próprio objeto geometry
        const isFeature = geoJSON.type === "Feature";
        const isGeometry = geoJSON.type === "Polygon" || geoJSON.type === "MultiPolygon";
        
        let polygon;
        let coordinates;
        
        if (isFeature && geoJSON.geometry && geoJSON.geometry.type === "Polygon") {
          polygon = geoJSON.geometry;
          // Extrair coordenadas do centroide
          coordinates = getCentroid(geoJSON.geometry.coordinates[0]);
        } else if (isGeometry) {
          polygon = geoJSON;
          // Extrair coordenadas do centroide
          coordinates = getCentroid(geoJSON.coordinates[0]);
        } else {
          throw new Error("GeoJSON não contém um Polygon válido");
        }
        
        // Calcular área aproximada
        const area = calculateArea(polygon);
        
        toast({
          title: "GeoJSON carregado",
          description: `Lote carregado com sucesso. Área aproximada: ${area.toFixed(2)} m²`,
        });

        onGeoJSONLoaded({
          polygon,
          latitude: coordinates[1],
          longitude: coordinates[0],
          area,
        });
        
      } else {
        toast({
          title: "Formato incorreto",
          description: "O arquivo GeoJSON não contém um polígono válido",
          variant: "destructive",
        });
      }

      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error("Erro ao processar o arquivo GeoJSON:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Não foi possível ler o arquivo GeoJSON. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  // Função para calcular o centroide de um polígono
  const getCentroid = (coordinates: number[][]) => {
    const sumX = coordinates.reduce((sum, point) => sum + point[0], 0);
    const sumY = coordinates.reduce((sum, point) => sum + point[1], 0);
    return [sumX / coordinates.length, sumY / coordinates.length];
  };

  // Função simples para estimar área (para cálculo preciso usaremos Turf.js em Index.tsx)
  const calculateArea = (polygon: any) => {
    // Implementação rudimentar apenas para fornecer um valor aproximado
    // A implementação completa com Turf.js será feita em Index.tsx
    return 1000; // Valor fixo temporário
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        accept=".geojson,.json"
        className="hidden"
        onChange={handleFileUpload}
      />
      <Button onClick={handleButtonClick} variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" /> Importar GeoJSON do Lote
      </Button>
    </div>
  );
};

export default GeoJSONUploader;
