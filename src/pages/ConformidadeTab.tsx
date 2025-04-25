
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
