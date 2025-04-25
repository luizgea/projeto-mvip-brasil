
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddressSearchInputProps {
  onAddressFound: (address: string) => void;
}

const AddressSearchInput: React.FC<AddressSearchInputProps> = ({ onAddressFound }) => {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!address.trim()) {
      toast({
        title: "Endereço vazio",
        description: "Por favor, digite um endereço para buscar.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulação de busca (em uma aplicação real, isso seria uma chamada à API)
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "Endereço encontrado",
        description: "Parâmetros urbanísticos carregados com sucesso.",
      });
      onAddressFound(address);
    }, 1500);
  };

  return (
    <div className="flex w-full max-w-md gap-2">
      <Input
        type="text"
        placeholder="Digite o endereço completo"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? "Buscando..." : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AddressSearchInput;
