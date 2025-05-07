import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BuildingControlsProps {
  buildingWidth: number;
  buildingLength: number;
  buildingHeight: number;
  floors: number;
  setbacks: {
    front: number;
    back: number;
    left: number;
    right: number;
  };
  buildingType: string;
  onWidthChange: (value: number) => void;
  onLengthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onFloorsChange: (value: number) => void;
  onBuildingTypeChange: (value: "residencial" | "comercial" | "misto") => void;
  onSetbackChange: (key: "front" | "back" | "left" | "right", value: number) => void;
}

const BuildingControls: React.FC<BuildingControlsProps> = ({
  buildingWidth,
  buildingLength,
  buildingHeight,
  floors,
  setbacks,
  buildingType,
  onWidthChange,
  onLengthChange,
  onHeightChange,
  onFloorsChange,
  onBuildingTypeChange,
  onSetbackChange,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tipologia</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={buildingType} 
            onValueChange={(value) => {
              // Ensure we only pass valid values
              if (value === "residencial" || value === "comercial" || value === "misto") {
                onBuildingTypeChange(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de edificação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="misto">Misto</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimensões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="width">Largura</Label>
              <span className="text-sm font-medium">{buildingWidth} m</span>
            </div>
            <Slider
              id="width"
              min={5}
              max={50}
              step={0.5}
              value={[buildingWidth]}
              onValueChange={(value) => onWidthChange(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="length">Comprimento</Label>
              <span className="text-sm font-medium">{buildingLength} m</span>
            </div>
            <Slider
              id="length"
              min={5}
              max={50}
              step={0.5}
              value={[buildingLength]}
              onValueChange={(value) => onLengthChange(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="height">Altura</Label>
              <span className="text-sm font-medium">{buildingHeight} m</span>
            </div>
            <Slider
              id="height"
              min={3}
              max={100}
              step={1}
              value={[buildingHeight]}
              onValueChange={(value) => onHeightChange(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="floors">Pavimentos</Label>
              <span className="text-sm font-medium">{floors}</span>
            </div>
            <Slider
              id="floors"
              min={1}
              max={30}
              step={1}
              value={[floors]}
              onValueChange={(value) => onFloorsChange(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recuos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="front">Frontal</Label>
              <span className="text-sm font-medium">{setbacks.front} m</span>
            </div>
            <Slider
              id="front"
              min={0}
              max={10}
              step={0.5}
              value={[setbacks.front]}
              onValueChange={(value) => onSetbackChange("front", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="back">Fundos</Label>
              <span className="text-sm font-medium">{setbacks.back} m</span>
            </div>
            <Slider
              id="back"
              min={0}
              max={10}
              step={0.5}
              value={[setbacks.back]}
              onValueChange={(value) => onSetbackChange("back", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="left">Lateral Esquerda</Label>
              <span className="text-sm font-medium">{setbacks.left} m</span>
            </div>
            <Slider
              id="left"
              min={0}
              max={10}
              step={0.5}
              value={[setbacks.left]}
              onValueChange={(value) => onSetbackChange("left", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="right">Lateral Direita</Label>
              <span className="text-sm font-medium">{setbacks.right} m</span>
            </div>
            <Slider
              id="right"
              min={0}
              max={10}
              step={0.5}
              value={[setbacks.right]}
              onValueChange={(value) => onSetbackChange("right", value[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingControls;
