
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressSearchInputProps {
  onAddressFound: (address: string) => void;
}

const AddressSearchInput: React.FC<AddressSearchInputProps> = ({ onAddressFound }) => {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!address.trim()) {
      toast({
        title: "Endereço vazio",
        description: "Por favor, digite um endereço para buscar.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Em uma implementação real, aqui seria feita uma chamada à API de geocoding
      // Por exemplo: const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Belo Horizonte, Brasil")}`);
      
      // Simulação de busca (em uma aplicação real, isso seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sucesso simulado
      toast({
        title: "Endereço encontrado",
        description: "Parâmetros urbanísticos carregados com sucesso.",
      });
      
      // Aqui seria processada a resposta da API e extraída a coordenada
      // Por enquanto, apenas chamamos o callback com o endereço digitado
      onAddressFound(address);
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível encontrar o endereço. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro na busca de endereço:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex w-full max-w-md gap-2">
      <Input
        type="text"
        placeholder="Digite o endereço completo"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? "Buscando..." : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AddressSearchInput;
