
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MapView: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Visualização do Terreno</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <div className="w-full h-full p-2 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Mapa será carregado aqui (integração WFS/WMS da PBH)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
