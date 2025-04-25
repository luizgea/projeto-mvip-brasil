
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AreaComparisonChartProps {
  terrainArea: number;
  builtArea: number;
  maxAllowedArea: number;
}

const AreaComparisonChart: React.FC<AreaComparisonChartProps> = ({ 
  terrainArea, 
  builtArea, 
  maxAllowedArea 
}) => {
  const data = [
    {
      name: "Áreas",
      "Terreno": terrainArea,
      "Edificação": builtArea,
      "Máximo Permitido": maxAllowedArea,
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Comparação de Áreas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Terreno" fill="#8E9196" />
              <Bar dataKey="Edificação" fill="#7E69AB" />
              <Bar dataKey="Máximo Permitido" fill="#D6BCFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaComparisonChart;
