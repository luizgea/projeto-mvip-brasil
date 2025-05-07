
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportGenerator from "@/components/ReportGenerator";
import { useToast } from "@/hooks/use-toast";
import { TerrainData, UrbanParams, AnalysisResult, FireSafetyItem, BuildingParams } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

interface RelatorioTabProps {
  urbanParams: UrbanParams;
  terrainData: TerrainData | null;
  analysisResult: AnalysisResult;
  fireSafetyItems: FireSafetyItem[];
  buildingParams: BuildingParams; // Added this missing prop
}

const RelatorioTab: React.FC<RelatorioTabProps> = ({
  urbanParams,
  terrainData,
  analysisResult,
  fireSafetyItems,
  buildingParams, // Added the prop to the component parameters
}) => {
  const { toast } = useToast();

  const handleGenerateReport = () => {
    // Lógica avançada de geração de PDF será implementada em uma próxima etapa
    // Por enquanto mantemos o toast
    toast({
      title: "Gerando relatório",
      description: "O relatório PDF está sendo gerado e ficará disponível para download em instantes.",
    });
    
    // Em uma implementação real, aqui seria chamada uma função para gerar o PDF
    // usando jsPDF ou outra biblioteca
  };

  const handleExportDWG = () => {
    // Aqui seria implementada a lógica para exportar arquivos DWG/DXF
    toast({
      title: "Exportando DWG",
      description: "Os arquivos DWG estão sendo gerados e ficarão disponíveis para download em instantes.",
    });
  };

  const handleExportImages = () => {
    // Aqui seria implementada a lógica para capturar e salvar imagens 3D
    // usando renderer.domElement.toDataURL() do Three.js
    toast({
      title: "Exportando imagens",
      description: "As imagens estão sendo geradas e ficarão disponíveis para download em instantes.",
    });
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-2">Relatório</h2>
        <p className="text-gray-500">
          Gere relatórios, exporte desenhos e compartilhe os resultados da sua análise de viabilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReportGenerator
            onGenerateReport={handleGenerateReport}
            onExportDWG={handleExportDWG}
            onExportImages={handleExportImages}
            urbanParams={urbanParams}
            terrainData={terrainData}
            analysisResult={analysisResult}
            fireSafetyItems={fireSafetyItems}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Relatório</CardTitle>
              <CardDescription>
                Resumo dos dados que serão incluídos no relatório completo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Dados do Terreno</h3>
                {terrainData ? (
                  <div className="text-sm">
                    <p><strong>Endereço:</strong> {terrainData.address}</p>
                    <p><strong>Área:</strong> {terrainData.area} m²</p>
                    <p><strong>Zoneamento:</strong> {terrainData.zoneamento}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum terreno selecionado</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-md font-semibold">Parâmetros Urbanísticos</h3>
                <div className="text-sm">
                  <p><strong>Coeficiente de Aproveitamento:</strong> {urbanParams.coeficienteAproveitamento}</p>
                  <p><strong>Taxa de Ocupação:</strong> {urbanParams.taxaOcupacao}%</p>
                  <p><strong>Altura Máxima:</strong> {urbanParams.alturaMaxima} m</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-md font-semibold">Resultados da Análise</h3>
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parâmetro</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Coeficiente de Aproveitamento</TableCell>
                      <TableCell>
                        {analysisResult.coeficienteAproveitamento.conforme ? (
                          <CheckCircle className="text-green-500 h-4 w-4 inline mr-1" />
                        ) : (
                          <XCircle className="text-red-500 h-4 w-4 inline mr-1" />
                        )}
                        {analysisResult.coeficienteAproveitamento.projetado} / {analysisResult.coeficienteAproveitamento.permitido}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Taxa de Ocupação</TableCell>
                      <TableCell>
                        {analysisResult.taxaOcupacao.conforme ? (
                          <CheckCircle className="text-green-500 h-4 w-4 inline mr-1" />
                        ) : (
                          <XCircle className="text-red-500 h-4 w-4 inline mr-1" />
                        )}
                        {analysisResult.taxaOcupacao.projetada}% / {analysisResult.taxaOcupacao.permitida}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Altura Máxima</TableCell>
                      <TableCell>
                        {analysisResult.alturaMaxima.conforme ? (
                          <CheckCircle className="text-green-500 h-4 w-4 inline mr-1" />
                        ) : (
                          <XCircle className="text-red-500 h-4 w-4 inline mr-1" />
                        )}
                        {analysisResult.alturaMaxima.projetada}m / {analysisResult.alturaMaxima.permitida}m
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <h3 className="text-md font-semibold">Situação da Segurança Contra Incêndio</h3>
                <div className="text-sm">
                  {fireSafetyItems.filter(item => item.applicable).map(item => (
                    <div key={item.id} className="flex items-center gap-2 mb-1">
                      {item.compliant === null ? (
                        <div className="h-4 w-4 rounded-full bg-gray-300" />
                      ) : item.compliant ? (
                        <CheckCircle className="text-green-500 h-4 w-4" />
                      ) : (
                        <XCircle className="text-red-500 h-4 w-4" />
                      )}
                      <span>{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagem de Visualização</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[250px] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">
                Prévia da imagem 3D do modelo (será incluída no relatório)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RelatorioTab;
