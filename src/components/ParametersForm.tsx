
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { UrbanParams } from "@/types";

interface ParametersFormProps {
  params: UrbanParams;
  onChange: (params: UrbanParams) => void;
}

const ParametersForm: React.FC<ParametersFormProps> = ({ params, onChange }) => {
  const handleSliderChange = (key: keyof UrbanParams, value: number[]) => {
    onChange({
      ...params,
      [key]: value[0],
    });
  };

  const handleRecuoChange = (key: keyof typeof params.recuos, value: number[]) => {
    onChange({
      ...params,
      recuos: {
        ...params.recuos,
        [key]: value[0],
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Coeficientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ca">Coef. Aproveitamento (CA)</Label>
              <span className="text-sm font-medium">{params.coeficienteAproveitamento}</span>
            </div>
            <Slider
              id="ca"
              min={0}
              max={5}
              step={0.1}
              value={[params.coeficienteAproveitamento]}
              onValueChange={(value) => handleSliderChange("coeficienteAproveitamento", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="to">Taxa de Ocupação (TO)</Label>
              <span className="text-sm font-medium">{params.taxaOcupacao}%</span>
            </div>
            <Slider
              id="to"
              min={0}
              max={100}
              step={1}
              value={[params.taxaOcupacao]}
              onValueChange={(value) => handleSliderChange("taxaOcupacao", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="tdc">TDC</Label>
              <span className="text-sm font-medium">{params.tdc}</span>
            </div>
            <Slider
              id="tdc"
              min={0}
              max={2}
              step={0.1}
              value={[params.tdc]}
              onValueChange={(value) => handleSliderChange("tdc", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="odc">ODC</Label>
              <span className="text-sm font-medium">{params.odc}</span>
            </div>
            <Slider
              id="odc"
              min={0}
              max={2}
              step={0.1}
              value={[params.odc]}
              onValueChange={(value) => handleSliderChange("odc", value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recuos e Altura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="altura">Altura Máxima (m)</Label>
              <span className="text-sm font-medium">{params.alturaMaxima} m</span>
            </div>
            <Slider
              id="altura"
              min={0}
              max={100}
              step={1}
              value={[params.alturaMaxima]}
              onValueChange={(value) => handleSliderChange("alturaMaxima", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="frontal">Recuo Frontal</Label>
              <span className="text-sm font-medium">{params.recuos.frontal} m</span>
            </div>
            <Slider
              id="frontal"
              min={0}
              max={10}
              step={0.5}
              value={[params.recuos.frontal]}
              onValueChange={(value) => handleRecuoChange("frontal", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="lateral">Recuo Lateral</Label>
              <span className="text-sm font-medium">{params.recuos.lateral} m</span>
            </div>
            <Slider
              id="lateral"
              min={0}
              max={10}
              step={0.5}
              value={[params.recuos.lateral]}
              onValueChange={(value) => handleRecuoChange("lateral", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fundos">Recuo Fundos</Label>
              <span className="text-sm font-medium">{params.recuos.fundos} m</span>
            </div>
            <Slider
              id="fundos"
              min={0}
              max={10}
              step={0.5}
              value={[params.recuos.fundos]}
              onValueChange={(value) => handleRecuoChange("fundos", value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParametersForm;
