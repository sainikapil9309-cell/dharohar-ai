"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Create custom colored pin icons
const createCustomIcon = (color: string = "#DE6B48") => {
  return L.divIcon({
    className: "custom-leaflet-pin",
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

export type HeritageRecord = {
  id: number;
  name: string;
  location: string;
  state?: string;
  latitude: number;
  longitude: number;
  period?: string;
  category?: string;
  description?: string;
  tags?: string[];
  colour?: string;
};

type Props = {
  records: HeritageRecord[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  isPickerMode?: boolean;
};

// Component to handle user clicking on map to choose coordinates
function LocationPickerHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(
          parseFloat(e.latlng.lat.toFixed(5)),
          parseFloat(e.latlng.lng.toFixed(5))
        );
      }
    },
  });
  return null;
}

// Auto-adjust view when selected location changes
function FlyToLocation({
  location,
}: {
  location?: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 12, { duration: 1.2 });
    }
  }, [location, map]);
  return null;
}

export default function HeritageMap({
  records,
  selectedLocation,
  onLocationSelect,
  isPickerMode = false,
}: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="mt-6 flex h-[460px] w-full items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 text-stone-500">
        <span className="animate-pulse">Loading Heritage Map...</span>
      </div>
    );
  }

  const defaultCenter: [number, number] = [23.5937, 78.9629]; // India geographic center

  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
      {/* Top Banner overlay if picking location */}
      {isPickerMode && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between rounded-lg bg-white/95 px-4 py-2 text-xs font-medium text-stone-800 shadow-md backdrop-blur">
          <span className="flex items-center gap-1.5 text-amber-700">
            📍 <strong>Click on the map</strong> to set the monument's location
          </span>
          {selectedLocation && (
            <span className="font-mono text-stone-600">
              {selectedLocation.lat}, {selectedLocation.lng}
            </span>
          )}
        </div>
      )}

      <div className="h-[480px] w-full">
        <MapContainer
          center={
            selectedLocation
              ? [selectedLocation.lat, selectedLocation.lng]
              : records.length > 0
              ? [records[0].latitude, records[0].longitude]
              : defaultCenter
          }
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPickerHandler onLocationSelect={onLocationSelect} />
          <FlyToLocation location={selectedLocation} />

          {/* User-selected temporary marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createCustomIcon("#2563EB")} // Bright Blue for current draft selection
            >
              <Popup>
                <div className="text-xs">
                  <strong>Selected Upload Location</strong>
                  <br />
                  Lat: {selectedLocation.lat}, Lng: {selectedLocation.lng}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Render all heritage and community uploaded pins */}
          {records.map((record) => {
            const isUserUpload = record.id >= 1000;
            const pinColor = record.colour || (isUserUpload ? "#2A9D8F" : "#DE6B48");

            return (
              <Marker
                key={record.id}
                position={[record.latitude, record.longitude]}
                icon={createCustomIcon(pinColor)}
              >
                <Popup className="heritage-popup">
                  <div className="max-w-[240px] space-y-1.5 p-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {record.name}
                      </span>
                      {isUserUpload && (
                        <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800">
                          Community
                        </span>
                      )}
                    </div>

                    <div className="text-stone-500">
                      📍 {record.location} {record.state ? `, ${record.state}` : ""}
                    </div>

                    {(record.category || record.period) && (
                      <div className="text-stone-600 font-medium">
                        🏛️ {record.category} {record.period ? `· ${record.period}` : ""}
                      </div>
                    )}

                    {record.description && (
                      <p className="line-clamp-3 text-stone-600 text-[11px] leading-relaxed">
                        {record.description}
                      </p>
                    )}

                    {record.tags && record.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {record.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}