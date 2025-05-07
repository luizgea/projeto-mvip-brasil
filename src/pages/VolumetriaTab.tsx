
import React from "react";
import ThreeDScene from "@/components/ThreeDScene";
import BuildingControls from "@/components/BuildingControls";
import AreaComparisonChart from "@/components/AreaComparisonChart";
import { AnalysisResult, BuildingParams, TerrainData, UrbanParams } from "@/types";

interface VolumetriaTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  buildingParams: BuildingParams;
  analysisResult: AnalysisResult;
  onBuildingParamChange: <K extends keyof BuildingParams>(key: K, value: BuildingParams[K]) => void;
  onSetbackChange: (key: "front" | "back" | "left" | "right", value: number) => void;
}

const VolumetriaTab: React.FC<VolumetriaTabProps> = ({
  urbanParams,
  terrainData,
  buildingParams,
  analysisResult,
  onBuildingParamChange,
  onSetbackChange
}) => {
  // Calculando áreas para o gráfico de comparação usando análise real
  const terrainArea = analysisResult.terrenoArea || terrainData?.area || 1000;
  const builtArea = analysisResult.builtArea || (buildingParams.width * buildingParams.length * buildingParams.floors * 0.85);
  const maxAllowedArea = analysisResult.maxAllowed || (terrainArea * urbanParams.coeficienteAproveitamento);

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
            buildingWidth={buildingParams.width}
            buildingLength={buildingParams.length}
            buildingHeight={buildingParams.height}
            floors={buildingParams.floors}
            setbacks={buildingParams.setbacks}
            buildingType={buildingParams.type}
            onWidthChange={(value) => onBuildingParamChange('width', value)}
            onLengthChange={(value) => onBuildingParamChange('length', value)}
            onHeightChange={(value) => onBuildingParamChange('height', value)}
            onFloorsChange={(value) => onBuildingParamChange('floors', value)}
            onBuildingTypeChange={(value) => onBuildingParamChange('type', value)}
            onSetbackChange={onSetbackChange}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
            <ThreeDScene
              buildingParams={{
                width: buildingParams.width,
                length: buildingParams.length,
                height: buildingParams.height,
                floors: buildingParams.floors,
                setbacks: buildingParams.setbacks,
              }}
              buildablePolygon={analysisResult.buildableShape}
              alturaMaxima={urbanParams.alturaMaxima}
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
