
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

const ConformidadeTab: React.FC<ConformidadeTabProps> = ({
  urbanParams,
  terrainData,
  buildingWidth,
  buildingLength,
  buildingHeight,
  floors,
}) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    coeficienteAproveitamento: { permitido: 0, projetado: 0, conforme: false },
    taxaOcupacao: { permitida: 0, projetada: 0, conforme: false },
    alturaMaxima: { permitida: 0, projetada: 0, conforme: false },
    recuos: {
      frontal: { permitido: 0, projetado: 0, conforme: false },
      lateral: { permitido: 0, projetado: 0, conforme: false },
      fundos: { permitido: 0, projetado: 0, conforme: false },
    },
  });

  const [fireSafetyItems, setFireSafetyItems] = useState<FireSafetyItem[]>([
    {
      id: "1",
      description: "Escada enclausurada",
      applicable: floors > 2,
      compliant: null,
      details: "Exigido para edificações com mais de 2 pavimentos",
    },
    {
      id: "2",
      description: "Duas saídas independentes",
      applicable: buildingWidth * buildingLength > 750,
      compliant: null,
      details: "Exigido para área construída superior a 750m²",
    },
    {
      id: "3",
      description: "Hidrantes e extintores",
      applicable: true,
      compliant: null,
      details: "",
    },
    {
      id: "4",
      description: "Rota acessível e iluminada",
      applicable: true,
      compliant: null,
      details: "",
    },
    {
      id: "5",
      description: "Pressurização de escada",
      applicable: floors > 6,
      compliant: null,
      details: "Exigido para edificações com mais de 6 pavimentos",
    },
    {
      id: "6",
      description: "Ventilação forçada",
      applicable: buildingWidth * buildingLength > 1000,
      compliant: null,
      details: "Exigido para área construída superior a 1000m²",
    },
    {
      id: "7",
      description: "Sistema de alarme de incêndio",
      applicable: buildingWidth * buildingLength > 500,
      compliant: null,
      details: "Exigido para área construída superior a 500m²",
    },
  ]);

  useEffect(() => {
    if (terrainData) {
      // Cálculo de área construída
      const floorArea = buildingWidth * buildingLength;
      const totalBuiltArea = floorArea * floors;
      
      // Cálculo de CA
      const calculatedCA = totalBuiltArea / terrainData.area;
      
      // Cálculo de TO
      const taxaOcupacao = (floorArea / terrainData.area) * 100;
      
      // Análise de conformidade
      const newResult: AnalysisResult = {
        coeficienteAproveitamento: {
          permitido: urbanParams.coeficienteAproveitamento,
          projetado: parseFloat(calculatedCA.toFixed(2)),
          conforme: calculatedCA <= urbanParams.coeficienteAproveitamento,
        },
        taxaOcupacao: {
          permitida: urbanParams.taxaOcupacao,
          projetada: parseFloat(taxaOcupacao.toFixed(2)),
          conforme: taxaOcupacao <= urbanParams.taxaOcupacao,
        },
        alturaMaxima: {
          permitida: urbanParams.alturaMaxima,
          projetada: buildingHeight,
          conforme: buildingHeight <= urbanParams.alturaMaxima,
        },
        recuos: {
          frontal: {
            permitido: urbanParams.recuos.frontal,
            projetado: 5, // valor fixo para este exemplo
            conforme: 5 >= urbanParams.recuos.frontal,
          },
          lateral: {
            permitido: urbanParams.recuos.lateral,
            projetado: 3, // valor fixo para este exemplo
            conforme: 3 >= urbanParams.recuos.lateral,
          },
          fundos: {
            permitido: urbanParams.recuos.fundos,
            projetado: 3, // valor fixo para este exemplo
            conforme: 3 >= urbanParams.recuos.fundos,
          },
        },
      };
      
      setAnalysisResult(newResult);

      // Atualizar aplicabilidade de itens de segurança contra incêndio
      const updatedFireSafetyItems = fireSafetyItems.map(item => {
        if (item.id === "1") { // Escada enclausurada
          return { ...item, applicable: floors > 2 };
        } else if (item.id === "2") { // Duas saídas independentes
          return { ...item, applicable: floorArea > 750 };
        } else if (item.id === "5") { // Pressurização de escada
          return { ...item, applicable: floors > 6 };
        } else if (item.id === "6") { // Ventilação forçada
          return { ...item, applicable: floorArea > 1000 };
        } else if (item.id === "7") { // Sistema de alarme
          return { ...item, applicable: floorArea > 500 };
        }
        return item;
      });
      
      setFireSafetyItems(updatedFireSafetyItems);
    }
  }, [urbanParams, terrainData, buildingWidth, buildingLength, buildingHeight, floors]);

  const handleFireSafetyItemChange = (id: string, compliant: boolean) => {
    setFireSafetyItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, compliant } : item))
    );
  };

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
              onItemChange={handleFireSafetyItemChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConformidadeTab;
