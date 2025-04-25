
import React, { useState } from "react";
import AddressSearchInput from "@/components/AddressSearchInput";
import MapView from "@/components/MapView";
import ParametersForm from "@/components/ParametersForm";
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
  const handleAddressFound = (address: string) => {
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
    };
    
    onTerrainDataChange(mockTerrainData);
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <MapView />
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
