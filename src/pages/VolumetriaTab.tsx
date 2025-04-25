
import React, { useState, useEffect } from "react";
import ThreeDScene from "@/components/ThreeDScene";
import BuildingControls from "@/components/BuildingControls";
import AreaComparisonChart from "@/components/AreaComparisonChart";
import { TerrainData, UrbanParams } from "@/types";

interface VolumetriaTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
}

const VolumetriaTab: React.FC<VolumetriaTabProps> = ({ urbanParams, terrainData }) => {
  const [buildingWidth, setBuildingWidth] = useState(15);
  const [buildingLength, setBuildingLength] = useState(25);
  const [buildingHeight, setBuildingHeight] = useState(30);
  const [floors, setFloors] = useState(10);
  const [buildingType, setBuildingType] = useState("residencial");
  const [setbacks, setSetbacks] = useState({
    front: 5,
    back: 3,
    left: 2,
    right: 2,
  });

  const handleSetbackChange = (key: keyof typeof setbacks, value: number) => {
    setSetbacks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
            onWidthChange={setBuildingWidth}
            onLengthChange={setBuildingLength}
            onHeightChange={setBuildingHeight}
            onFloorsChange={setFloors}
            onBuildingTypeChange={setBuildingType}
            onSetbackChange={handleSetbackChange}
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
