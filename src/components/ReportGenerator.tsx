
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, FileImage, FileDwg } from "lucide-react";

interface ReportGeneratorProps {
  onGenerateReport: () => void;
  onExportDWG: () => void;
  onExportImages: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerateReport,
  onExportDWG,
  onExportImages,
}) => {
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
          <Button onClick={onGenerateReport} className="w-full">
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
            <FileDwg className="h-4 w-4 mr-2" /> Exportar DWG
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
