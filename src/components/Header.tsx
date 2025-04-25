
import React from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Save, FilePlus, Settings } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-mvip shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Logo />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
            <FilePlus className="mr-2 h-4 w-4" /> Novo
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
