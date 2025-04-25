
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, FileImage, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult, FireSafetyItem, TerrainData, UrbanParams } from "@/types";

interface ReportGeneratorProps {
  onGenerateReport: () => void;
  onExportDWG: () => void;
  onExportImages: () => void;
  urbanParams?: UrbanParams;
  terrainData?: TerrainData | null;
  analysisResult?: AnalysisResult;
  fireSafetyItems?: FireSafetyItem[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerateReport,
  onExportDWG,
  onExportImages,
  urbanParams,
  terrainData,
  analysisResult,
  fireSafetyItems
}) => {
  const { toast } = useToast();

  const handleGenerateReport = () => {
    // Verificar se temos dados suficientes para gerar o relatório
    if (!terrainData) {
      toast({
        title: "Dados insuficientes",
        description: "Por favor, selecione um terreno antes de gerar o relatório.",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui chamaríamos a lógica de geração do PDF
    // Por enquanto, vamos manter o callback original
    onGenerateReport();
    
    toast({
      title: "Gerando relatório",
      description: "Seu relatório PDF está sendo gerado...",
    });
    
    // Simulação de tempo de processamento
    setTimeout(() => {
      toast({
        title: "Relatório concluído",
        description: "Seu relatório PDF foi gerado com sucesso!",
      });
      // Aqui poderia abrir uma janela para download ou vizualização do PDF
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatório Completo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Gere um relatório completo com todos os parâmetros, análises de conformidade e imagens 3D.
          </p>
          <Button onClick={handleGenerateReport} className="w-full">
            <FileText className="h-4 w-4 mr-2" /> Gerar Relatório PDF
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Exportar Desenhos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Exporte plantas, cortes e vistas para formatos compatíveis com softwares CAD.
          </p>
          <Button variant="outline" onClick={onExportDWG} className="w-full mb-2">
            <File className="h-4 w-4 mr-2" /> Exportar DWG
          </Button>
          <Button variant="outline" onClick={onExportImages} className="w-full">
            <FileImage className="h-4 w-4 mr-2" /> Exportar Imagens
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
