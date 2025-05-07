
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceTable from "@/components/ComplianceTable";
import FireSafetyChecklist from "@/components/FireSafetyChecklist";
import { AnalysisResult, FireSafetyItem, TerrainData, UrbanParams } from "@/types";

interface ConformidadeTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  buildingWidth: number;
  buildingLength: number;
  buildingHeight: number;
  floors: number;
  analysisResult: AnalysisResult;
  fireSafetyItems: FireSafetyItem[];
  onFireSafetyItemChange: (id: string, compliant: boolean) => void;
}

const ConformidadeTab: React.FC<ConformidadeTabProps> = ({
  urbanParams,
  terrainData,
  buildingWidth,
  buildingLength,
  buildingHeight,
  floors,
  analysisResult,
  fireSafetyItems,
  onFireSafetyItemChange
}) => {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-2">Análise de Conformidade</h2>
        <p className="text-gray-500">
          Verifique a conformidade do projeto com os parâmetros urbanísticos e normas de segurança.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Conformidade Urbanística</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceTable result={analysisResult} />
            
            {analysisResult.terrenoArea && analysisResult.builtArea && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Informações adicionais:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Área do terreno:</span> {analysisResult.terrenoArea.toFixed(2)} m²
                  </div>
                  <div>
                    <span className="font-semibold">Área construída:</span> {analysisResult.builtArea.toFixed(2)} m²
                  </div>
                  <div>
                    <span className="font-semibold">Área máxima permitida:</span> {analysisResult.maxAllowed?.toFixed(2)} m²
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança Contra Incêndio</CardTitle>
          </CardHeader>
          <CardContent>
            <FireSafetyChecklist
              items={fireSafetyItems}
              onItemChange={onFireSafetyItemChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConformidadeTab;
