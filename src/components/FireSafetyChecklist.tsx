
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FireSafetyItem } from "@/types";

interface FireSafetyChecklistProps {
  items: FireSafetyItem[];
  onItemChange: (id: string, compliant: boolean) => void;
}

const FireSafetyChecklist: React.FC<FireSafetyChecklistProps> = ({ items, onItemChange }) => {
  const handleDownloadPDF = () => {
    // Em uma implementação real, aqui seria gerado um PDF com o checklist
    alert("Função de download de PDF será implementada");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Checklist de Segurança Contra Incêndio</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" /> Exportar PDF
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="w-[150px]">Aplicável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.applicable && (
                    <Checkbox
                      checked={item.compliant || false}
                      onCheckedChange={(checked) => {
                        onItemChange(item.id, checked as boolean);
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className={!item.applicable ? "text-gray-400" : ""}>
                  {item.description}
                  {item.details && <p className="text-xs text-gray-500 mt-1">{item.details}</p>}
                </TableCell>
                <TableCell>{item.applicable ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FireSafetyChecklist;
