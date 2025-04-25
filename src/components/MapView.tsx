
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  coordinates?: [number, number]; // [latitude, longitude]
  terrainData?: any;
}

const MapView: React.FC<MapViewProps> = ({ coordinates = [-19.9167, -43.9345], terrainData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map only if it hasn't been initialized yet
    if (!leafletMapRef.current) {
      // Create the map
      const map = L.map(mapRef.current).setView(coordinates, 13);
      leafletMapRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a marker for the location
      L.marker(coordinates).addTo(map)
        .bindPopup("Localização selecionada")
        .openPopup();

      // When we have terrain data with a polygon, we'd add it here
      if (terrainData && terrainData.geometry) {
        // This is a placeholder for real GeoJSON data that would come from the PBH WFS service
        try {
          L.geoJSON(terrainData.geometry).addTo(map);
        } catch (error) {
          console.error("Erro ao renderizar geometria do terreno:", error);
        }
      }
    }

    // Clean up function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [coordinates]); // Re-init map if coordinates change

  // Update map view if coordinates change after initial render
  useEffect(() => {
    if (leafletMapRef.current && coordinates) {
      leafletMapRef.current.setView(coordinates, 13);
    }
  }, [coordinates]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Visualização do Terreno</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <div 
          ref={mapRef} 
          className="w-full h-full" 
          style={{ borderRadius: "0 0 0.5rem 0.5rem" }}
        />
      </CardContent>
    </Card>
  );
};

export default MapView;
