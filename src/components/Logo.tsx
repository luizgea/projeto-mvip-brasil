
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute bottom-0 w-10 h-4 bg-mvip-100"></div>
        <div className="absolute bottom-4 w-8 h-3 left-1 bg-mvip-100"></div>
        <div className="absolute bottom-7 w-6 h-2 left-2 bg-mvip-100"></div>
      </div>
      <div>
        <h1 className="font-bold text-2xl text-mvip-foreground">MVíP</h1>
        <p className="text-[0.65rem] text-mvip-100 leading-none">METODOLOGIA DE VIABILIDADE PARAMÉTRICA</p>
      </div>
    </div>
  );
};

export default Logo;
