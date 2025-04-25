
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TerrainData } from "@/types";

interface MapViewProps {
  coordinates?: [number, number]; // [latitude, longitude]
  terrainData?: TerrainData | null;
}

const MapView: React.FC<MapViewProps> = ({ coordinates = [-19.9167, -43.9345], terrainData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geoJSONLayerRef = useRef<L.GeoJSON | null>(null);

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
    }

    // Clean up function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []); // Initialize map only once

  // Update marker when coordinates change
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Use terrainData coordinates if available, otherwise use provided coordinates
    const displayCoords = terrainData?.coordinates || coordinates;

    // Add a marker for the location
    markerRef.current = L.marker(displayCoords)
      .addTo(leafletMapRef.current)
      .bindPopup("Localização selecionada")
      .openPopup();

    // Center the map on the coordinates
    leafletMapRef.current.setView(displayCoords, 15);
  }, [coordinates, terrainData?.coordinates]);

  // Update GeoJSON layer when terrainData changes
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Remove previous GeoJSON layer if exists
    if (geoJSONLayerRef.current) {
      geoJSONLayerRef.current.remove();
      geoJSONLayerRef.current = null;
    }

    // When we have terrain data with a polygon, add it to the map
    if (terrainData?.geometry) {
      try {
        geoJSONLayerRef.current = L.geoJSON(terrainData.geometry, {
          style: {
            color: "#4338ca",
            weight: 2,
            opacity: 0.8,
            fillColor: "#818cf8",
            fillOpacity: 0.4
          }
        }).addTo(leafletMapRef.current);
        
        // Fit map bounds to the GeoJSON layer
        if (geoJSONLayerRef.current.getBounds().isValid()) {
          leafletMapRef.current.fitBounds(geoJSONLayerRef.current.getBounds());
        }
      } catch (error) {
        console.error("Erro ao renderizar geometria do terreno:", error);
      }
    }
  }, [terrainData?.geometry]);

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
