
import React from "react";
import AddressSearchInput from "@/components/AddressSearchInput";
import MapView from "@/components/MapView";
import ParametersForm from "@/components/ParametersForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TerrainData, UrbanParams } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TerrenoUrbanismoTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  onUrbanParamsChange: (params: UrbanParams) => void;
  onTerrainDataChange: (data: Partial<TerrainData>) => void;
}

const TerrenoUrbanismoTab: React.FC<TerrenoUrbanismoTabProps> = ({
  urbanParams,
  terrainData,
  onUrbanParamsChange,
  onTerrainDataChange,
}) => {
  const handleAddressFound = (data: Partial<TerrainData>) => {
    // Em uma implementação real com dados completos do WFS,
    // podemos usar diretamente os dados retornados
    if (!data) return;
    
    // Se já temos terrainData, mesclamos com os novos dados
    if (terrainData) {
      onTerrainDataChange({
        ...terrainData,
        ...data,
        // Garantir que outros campos existentes sejam preservados
        limitacoes: terrainData.limitacoes || ["Verificando..."],
        cotas: terrainData.cotas || { minima: 0, maxima: 0 }
      });
    } else {
      // Se não temos terrainData, criamos um objeto inicial
      onTerrainDataChange({
        address: data.address || "",
        area: data.area || 1000,
        zoneamento: data.zoneamento || "Zoneamento não disponível",
        limitacoes: ["Verificando limitações..."],
        cotas: { minima: 0, maxima: 0 },
        ...data
      });
    }
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
                      {terrainData.zone && (
                        <Badge variant="outline" className="mt-1">
                          {terrainData.zone.sigla}
                        </Badge>
                      )}
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
                          Polígono do lote carregado com sucesso!
                        </h4>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <MapView terrainData={terrainData} />
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
