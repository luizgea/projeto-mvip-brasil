
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressSearchInputProps {
  onAddressFound: (address: string, coordinates: [number, number]) => void;
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
      // Usar Nominatim OpenStreetMap para geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Belo Horizonte, Brasil")}&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const coordinates: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
        
        toast({
          title: "Endereço encontrado",
          description: "Parâmetros urbanísticos carregados com sucesso.",
        });
        
        // Chama o callback com o endereço e as coordenadas
        onAddressFound(address, coordinates);
      } else {
        toast({
          title: "Endereço não encontrado",
          description: "Não foi possível encontrar o endereço. Tente ser mais específico.",
          variant: "destructive",
        });
      }
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
