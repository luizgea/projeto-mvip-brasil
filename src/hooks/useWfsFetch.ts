
import { useState } from "react";
import { TerrainData } from "@/types";
import { useToast } from "./use-toast";

interface WfsResponse {
  type: string;
  features: Array<{
    type: string;
    geometry: GeoJSON.Polygon;
    properties: Record<string, any>;
  }>;
}

export const useWfsFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLotData = async (lat: number, lon: number): Promise<Partial<TerrainData> | null> => {
    setIsLoading(true);
    try {
      // Fetch lot data from WFS
      const wfsLotUrl = `https://bhmap.pbh.gov.br/v2/api/idebhgeo/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=ide_bhgeo:LOTE_CTM&outputFormat=application/json&srsName=EPSG:4326&cql_filter=INTERSECTS(GEOMETRIA,POINT(${lon} ${lat}))`.replace(/\s+/g, '');
      
      const lotResponse = await fetch(wfsLotUrl);
      if (!lotResponse.ok) throw new Error("Erro ao buscar dados do lote");
      
      const lotData: WfsResponse = await lotResponse.json();
      
      // Check if we got features
      if (!lotData.features?.length) {
        toast({
          title: "Lote não encontrado",
          description: "Não foi possível encontrar um lote nessa localização.",
          variant: "destructive",
        });
        return null;
      }
      
      // Get first feature (lot)
      const lotFeature = lotData.features[0];
      const lotGeometry = lotFeature.geometry;
      
      // Fetch zoning data from WFS
      const wfsZoneUrl = wfsLotUrl.replace('LOTE_CTM', 'ZONEAMENTO');
      const zoneResponse = await fetch(wfsZoneUrl);
      
      let zoneData: { sigla: string; descricao: string } | undefined = undefined;
      
      if (zoneResponse.ok) {
        const zoneResult: WfsResponse = await zoneResponse.json();
        if (zoneResult.features?.length) {
          const zoneFeature = zoneResult.features[0];
          zoneData = {
            sigla: zoneFeature.properties.SIGLA_ZONEAMENTO || "N/A",
            descricao: zoneFeature.properties.DESC_ZONEAMENTO || "Não disponível"
          };
        }
      }
      
      // Return terrain data with lot and zoning information
      const terrainData: Partial<TerrainData> = {
        latitude: lat,
        longitude: lon,
        polygon: lotGeometry,
        geometry: lotGeometry,
        zone: zoneData,
        zoneamento: zoneData?.descricao || "Zoneamento não encontrado",
        // Additional lot properties if available
        area: lotFeature.properties.AREA_LOTE || 1000,
        address: `${lotFeature.properties.LOGRADOURO || ""} ${lotFeature.properties.NUMERO || ""}`.trim() || "Endereço não disponível"
      };
      
      toast({
        title: "Dados do lote carregados",
        description: "Lote e zoneamento encontrados com sucesso.",
      });
      
      return terrainData;
    } catch (error) {
      console.error("Erro ao buscar dados WFS:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados do lote e zoneamento.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchLotData, isLoading };
};
