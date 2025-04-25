
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MapPin, Layers, CheckSquare, FileText } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="w-full bg-mvip-50 h-16 gap-2 p-2">
        <TabsTrigger 
          value="terreno" 
          className={cn(
            "flex-1 h-full flex items-center gap-2 data-[state=active]:bg-white",
            "data-[state=active]:shadow-md"
          )}
        >
          <MapPin className="h-5 w-5" />
          <span>Terreno & Urbanismo</span>
        </TabsTrigger>
        <TabsTrigger 
          value="volumetria" 
          className={cn(
            "flex-1 h-full flex items-center gap-2 data-[state=active]:bg-white",
            "data-[state=active]:shadow-md"
          )}
        >
          <Layers className="h-5 w-5" />
          <span>Volumetria</span>
        </TabsTrigger>
        <TabsTrigger 
          value="conformidade" 
          className={cn(
            "flex-1 h-full flex items-center gap-2 data-[state=active]:bg-white",
            "data-[state=active]:shadow-md"
          )}
        >
          <CheckSquare className="h-5 w-5" />
          <span>Conformidade</span>
        </TabsTrigger>
        <TabsTrigger 
          value="relatorio" 
          className={cn(
            "flex-1 h-full flex items-center gap-2 data-[state=active]:bg-white",
            "data-[state=active]:shadow-md"
          )}
        >
          <FileText className="h-5 w-5" />
          <span>Relatório</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
