
import React from "react";
import AddressSearchInput from "@/components/AddressSearchInput";
import MapView from "@/components/MapView";
import ParametersForm from "@/components/ParametersForm";
import GeoJSONUploader from "@/components/GeoJSONUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TerrainData, UrbanParams } from "@/types";

interface TerrenoUrbanismoTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  onUrbanParamsChange: (params: UrbanParams) => void;
  onTerrainDataChange: (data: TerrainData) => void;
}

const TerrenoUrbanismoTab: React.FC<TerrenoUrbanismoTabProps> = ({
  urbanParams,
  terrainData,
  onUrbanParamsChange,
  onTerrainDataChange,
}) => {
  const handleAddressFound = (address: string, coordinates: [number, number]) => {
    // Em uma implementação real, os dados seriam buscados de uma API externa
    // Aqui estamos apenas simulando o retorno de dados
    const mockTerrainData: TerrainData = {
      address: address,
      area: 1200,
      zoneamento: "ZAP - Zona de Adensamento Preferencial",
      limitacoes: ["ADE - Área de Diretrizes Especiais", "Patrimônio Histórico"],
      cotas: {
        minima: 850,
        maxima: 860,
      },
      coordinates: coordinates,
      latitude: coordinates[0],
      longitude: coordinates[1],
      // Mock GeoJSON for visualization
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [coordinates[1] - 0.001, coordinates[0] - 0.001],
            [coordinates[1] + 0.001, coordinates[0] - 0.001],
            [coordinates[1] + 0.001, coordinates[0] + 0.001],
            [coordinates[1] - 0.001, coordinates[0] + 0.001],
            [coordinates[1] - 0.001, coordinates[0] - 0.001]
          ]
        ]
      }
    };
    
    onTerrainDataChange(mockTerrainData);
  };
  
  const handleGeoJSONLoaded = (geoJSONData: Partial<TerrainData>) => {
    if (!terrainData) return;
    
    // Mesclar os dados do GeoJSON com os dados existentes do terreno
    const updatedTerrainData: TerrainData = {
      ...terrainData,
      ...geoJSONData,
      // Se temos uma área calculada do GeoJSON, usá-la
      area: geoJSONData.area || terrainData.area
    };
    
    onTerrainDataChange(updatedTerrainData);
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-2">Terreno & Urbanismo</h2>
        <p className="text-gray-500">
          Busque um endereço para carregar automaticamente os parâmetros urbanísticos ou insira-os manualmente.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Busca de Endereço</CardTitle>
                <CardDescription>
                  Digite o endereço para buscar os dados do terreno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddressSearchInput onAddressFound={handleAddressFound} />
                <GeoJSONUploader onGeoJSONLoaded={handleGeoJSONLoaded} />
                
                {terrainData && (
                  <div className="mt-6 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold">Endereço:</h4>
                      <p className="text-sm">{terrainData.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Área do Terreno:</h4>
                      <p className="text-sm">{terrainData.area} m²</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Zoneamento:</h4>
                      <p className="text-sm">{terrainData.zoneamento}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Limitações:</h4>
                      <ul className="text-sm list-disc list-inside">
                        {terrainData.limitacoes.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Cotas Altimétricas:</h4>
                      <p className="text-sm">
                        Mínima: {terrainData.cotas.minima}m, Máxima: {terrainData.cotas.maxima}m
                      </p>
                    </div>
                    {terrainData.polygon && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-600">
                          Polígono do lote importado com sucesso!
                        </h4>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <MapView 
              coordinates={terrainData?.coordinates || [-19.9167, -43.9345]}
              terrainData={terrainData}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Parâmetros Urbanísticos</h3>
          <ParametersForm params={urbanParams} onChange={onUrbanParamsChange} />
        </div>
      </div>
    </div>
  );
};

export default TerrenoUrbanismoTab;
