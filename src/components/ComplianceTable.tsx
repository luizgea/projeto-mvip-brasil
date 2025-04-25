
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalysisResult } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

interface ComplianceTableProps {
  result: AnalysisResult;
}

const ComplianceTable: React.FC<ComplianceTableProps> = ({ result }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parâmetro</TableHead>
          <TableHead>Permitido</TableHead>
          <TableHead>Projetado</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Coeficiente de Aproveitamento</TableCell>
          <TableCell>{result.coeficienteAproveitamento.permitido}</TableCell>
          <TableCell>{result.coeficienteAproveitamento.projetado}</TableCell>
          <TableCell>
            {result.coeficienteAproveitamento.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Taxa de Ocupação</TableCell>
          <TableCell>{result.taxaOcupacao.permitida}%</TableCell>
          <TableCell>{result.taxaOcupacao.projetada}%</TableCell>
          <TableCell>
            {result.taxaOcupacao.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Altura Máxima</TableCell>
          <TableCell>{result.alturaMaxima.permitida} m</TableCell>
          <TableCell>{result.alturaMaxima.projetada} m</TableCell>
          <TableCell>
            {result.alturaMaxima.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Recuo Frontal</TableCell>
          <TableCell>{result.recuos.frontal.permitido} m</TableCell>
          <TableCell>{result.recuos.frontal.projetado} m</TableCell>
          <TableCell>
            {result.recuos.frontal.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Recuo Lateral</TableCell>
          <TableCell>{result.recuos.lateral.permitido} m</TableCell>
          <TableCell>{result.recuos.lateral.projetado} m</TableCell>
          <TableCell>
            {result.recuos.lateral.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Recuo Fundos</TableCell>
          <TableCell>{result.recuos.fundos.permitido} m</TableCell>
          <TableCell>{result.recuos.fundos.projetado} m</TableCell>
          <TableCell>
            {result.recuos.fundos.conforme ? (
              <CheckCircle className="text-green-500 h-5 w-5" />
            ) : (
              <XCircle className="text-red-500 h-5 w-5" />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ComplianceTable;
