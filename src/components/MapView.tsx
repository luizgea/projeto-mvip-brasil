
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TerrainData } from "@/types";

interface MapViewProps {
  terrainData?: TerrainData | null;
}

const MapView: React.FC<MapViewProps> = ({ terrainData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geoJSONLayerRef = useRef<L.GeoJSON | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map only if it hasn't been initialized yet
    if (!leafletMapRef.current) {
      // Default coordinates for Belo Horizonte
      const defaultCoords: [number, number] = [-19.9167, -43.9345];
      
      // Create the map with EPSG:4326 projection
      const map = L.map(mapRef.current, {
        crs: L.CRS.EPSG3857 // Standard Web Mercator projection
      }).setView(defaultCoords, 13);
      
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

  // Update marker when terrainData changes
  useEffect(() => {
    if (!leafletMapRef.current || !terrainData) return;

    // Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Get coordinates from terrainData
    let lat: number, lon: number;
    
    if (terrainData.latitude && terrainData.longitude) {
      lat = terrainData.latitude;
      lon = terrainData.longitude;
    } else if (terrainData.coordinates) {
      [lat, lon] = terrainData.coordinates;
    } else {
      return; // No valid coordinates
    }
    
    // Add a marker for the location
    markerRef.current = L.marker([lat, lon])
      .addTo(leafletMapRef.current)
      .bindPopup("Localização selecionada")
      .openPopup();
    
    // Center the map on the coordinates
    leafletMapRef.current.setView([lat, lon], 15);
  }, [terrainData?.latitude, terrainData?.longitude, terrainData?.coordinates]);

  // Update GeoJSON layer when terrainData.polygon changes
  useEffect(() => {
    if (!leafletMapRef.current || !terrainData) return;

    // Remove previous GeoJSON layer if exists
    if (geoJSONLayerRef.current) {
      geoJSONLayerRef.current.remove();
      geoJSONLayerRef.current = null;
    }

    // When we have terrain data with a polygon, add it to the map
    if (terrainData.polygon) {
      try {
        geoJSONLayerRef.current = L.geoJSON(terrainData.polygon, {
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
        console.error("Erro ao renderizar polígono do terreno:", error);
      }
    }
    
    // If we have buildableShape, add it with a different style
    if (terrainData.buildableShape) {
      try {
        L.geoJSON(terrainData.buildableShape, {
          style: {
            color: "#10b981", // green
            weight: 2,
            opacity: 0.8,
            fillColor: "#34d399",
            fillOpacity: 0.3,
            dashArray: "5, 5" // dashed line
          }
        }).addTo(leafletMapRef.current);
      } catch (error) {
        console.error("Erro ao renderizar área edificável:", error);
      }
    }
  }, [terrainData?.polygon, terrainData?.buildableShape]);

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
