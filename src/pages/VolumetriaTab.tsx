
import React from "react";
import ThreeDScene from "@/components/ThreeDScene";
import BuildingControls from "@/components/BuildingControls";
import AreaComparisonChart from "@/components/AreaComparisonChart";
import { TerrainData, UrbanParams } from "@/types";

interface VolumetriaTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  buildingWidth: number;
  buildingLength: number;
  buildingHeight: number;
  floors: number;
  buildingType: string;
  setbacks: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
  onWidthChange: (value: number) => void;
  onLengthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onFloorsChange: (value: number) => void;
  onBuildingTypeChange: (value: string) => void;
  onSetbackChange: (key: "front" | "back" | "left" | "right", value: number) => void;
}

const VolumetriaTab: React.FC<VolumetriaTabProps> = ({ 
  urbanParams, 
  terrainData,
  buildingWidth,
  buildingLength,
  buildingHeight,
  floors,
  buildingType,
  setbacks,
  onWidthChange,
  onLengthChange,
  onHeightChange,
  onFloorsChange,
  onBuildingTypeChange,
  onSetbackChange
}) => {
  // Cálculo das áreas para o gráfico de comparação
  const terrainArea = terrainData?.area || 1000;
  const builtArea = buildingWidth * buildingLength * floors * 0.85; // Estimativa simplificada
  const maxAllowedArea = terrainArea * urbanParams.coeficienteAproveitamento;

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-2">Volumetria</h2>
        <p className="text-gray-500">
          Ajuste os parâmetros da edificação e visualize o modelo 3D gerado com base nos limites urbanísticos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BuildingControls
            buildingWidth={buildingWidth}
            buildingLength={buildingLength}
            buildingHeight={buildingHeight}
            floors={floors}
            setbacks={setbacks}
            buildingType={buildingType}
            onWidthChange={onWidthChange}
            onLengthChange={onLengthChange}
            onHeightChange={onHeightChange}
            onFloorsChange={onFloorsChange}
            onBuildingTypeChange={onBuildingTypeChange}
            onSetbackChange={onSetbackChange}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
            <ThreeDScene
              buildingParams={{
                width: buildingWidth,
                length: buildingLength,
                height: buildingHeight,
                floors: floors,
                setbacks,
              }}
            />
          </div>

          <div className="mt-6">
            <AreaComparisonChart
              terrainArea={terrainArea}
              builtArea={builtArea}
              maxAllowedArea={maxAllowedArea}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumetriaTab;
