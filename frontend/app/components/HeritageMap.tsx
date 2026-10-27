"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type HeritageRecord = {
  id: number;
  name: string;
  location: string;
  state: string;
  latitude: number;
  longitude: number;
  period: string;
  category: string;
};

type Props = {
  records: HeritageRecord[];
};

export default function HeritageMap({ records }: Props) {
  return (
    <div className="mt-6 h-[450px] overflow-hidden rounded-2xl border border-stone-200">
      <MapContainer
        center={[25.5, 74.5]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {records.map((record) => (
          <Marker
            key={record.id}
            position={[record.latitude, record.longitude]}
          >
            <Popup>
              <strong>{record.name}</strong>
              <br />
              {record.location}, {record.state}
              <br />
              {record.category} · {record.period}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}