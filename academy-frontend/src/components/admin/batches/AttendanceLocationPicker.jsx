"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import { 
  MapPin, 
  Crosshair, 
  Radius, 
  Navigation, 
  LocateFixed,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import L from "leaflet";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Pulse marker for current location
const pulseIcon = new L.DivIcon({
  className: "custom-pulse-marker",
  html: `<div class="relative">
          <div class="w-4 h-4 bg-[var(--primary)] rounded-full border-2 border-white shadow-lg"></div>
          <div class="absolute inset-0 w-4 h-4 bg-[var(--primary)] rounded-full animate-ping opacity-40"></div>
         </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Map controller component
function MapController({ center, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

// Location marker with click handling
function LocationMarker({ attendanceConfig, setAttendanceConfig, onLocationSet }) {
  useMapEvents({
    click(e) {
      setAttendanceConfig(prev => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
      onLocationSet?.();
    }
  });

  if (!attendanceConfig.latitude || !attendanceConfig.longitude) return null;

  return (
    <>
      <Marker 
        position={[attendanceConfig.latitude, attendanceConfig.longitude]} 
        icon={customIcon}
      />
      <Circle
        center={[attendanceConfig.latitude, attendanceConfig.longitude]}
        radius={attendanceConfig.radius}
        pathOptions={{
          color: "var(--primary)",
          fillColor: "var(--primary)",
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "5, 10"
        }}
      />
    </>
  );
}

// Current location marker
function CurrentLocationMarker({ position }) {
  if (!position) return null;
  return <Marker position={position} icon={pulseIcon} zIndexOffset={1000} />;
}

export default function AttendanceLocationPicker({ attendanceConfig, setAttendanceConfig }) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const [hasSetLocation, setHasSetLocation] = useState(false);

  const center = useMemo(() => [
    attendanceConfig.latitude || 34.0837,
    attendanceConfig.longitude || 74.7973
  ], [attendanceConfig.latitude, attendanceConfig.longitude]);

  // Get current location
  const handleGetCurrentLocation = useCallback(() => {
    setLocating(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
        setAttendanceConfig(prev => ({
          ...prev,
          latitude,
          longitude
        }));
        setHasSetLocation(true);
        setLocating(false);
      },
      (error) => {
        let message = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        setLocationError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setAttendanceConfig]);

  // Preset radius options with visual indicators
  const radiusOptions = [
    { value: 50, label: "50m", desc: "Room precise", color: "bg-emerald-500" },
    { value: 100, label: "100m", desc: "Building", color: "bg-blue-500" },
    { value: 200, label: "200m", desc: "Block", color: "bg-amber-500" },
    { value: 300, label: "300m", desc: "Campus area", color: "bg-orange-500" },
    { value: 500, label: "500m", desc: "Wide area", color: "bg-red-500" }
  ];

  const selectedRadius = radiusOptions.find(r => r.value === attendanceConfig.radius) || radiusOptions[1];

  return (
    <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-custom)] bg-[var(--muted)]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <MapPin className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
                Attendance Zone
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Click map or use GPS to set location
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={locating}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                       ${locating 
                         ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-wait' 
                         : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 shadow-md shadow-[var(--primary)]/20'
                       }`}
          >
            {locating ? (
              <>
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <LocateFixed className="w-3.5 h-3.5" />
                Use My Location
              </>
            )}
          </button>
        </div>

        {locationError && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 
                          border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {hasSetLocation && !locationError && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 
                          border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Location set successfully</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative h-[320px] sm:h-[380px]">
        <MapContainer
          center={center}
          zoom={15}
          className="h-full w-full z-0"
          scrollWheelZoom={true}
          doubleClickZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} />
          <LocationMarker 
            attendanceConfig={attendanceConfig} 
            setAttendanceConfig={setAttendanceConfig}
            onLocationSet={() => setHasSetLocation(true)}
          />
          <CurrentLocationMarker position={currentPosition} />
        </MapContainer>

        {/* Map overlay controls */}
        <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
          <div className="bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border-custom)] p-2 text-[10px] text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
              <span>Click to set</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full border border-[var(--primary)] bg-[var(--primary)]/20"></div>
              <span>Radius zone</span>
            </div>
          </div>
        </div>

        {/* Radius indicator overlay */}
        {attendanceConfig.radius && (
          <div className="absolute top-4 left-4 z-[400]">
            <div className="bg-[var(--card)]/90 backdrop-blur-sm rounded-lg shadow-lg border border-[var(--border-custom)] px-3 py-2">
              <div className="flex items-center gap-2">
                <Radius className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-bold text-[var(--foreground)]">{attendanceConfig.radius}m</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">radius</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coordinates & Radius */}
      <div className="p-5 space-y-5">
        
        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Latitude
            </label>
            <div className="relative">
              <Crosshair className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <input
                readOnly
                value={attendanceConfig.latitude ? attendanceConfig.latitude.toFixed(6) : "Not set"}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-custom)] bg-[var(--muted)]/50 
                           text-[var(--foreground)] text-sm font-mono font-semibold
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Longitude
            </label>
            <div className="relative">
              <Crosshair className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <input
                readOnly
                value={attendanceConfig.longitude ? attendanceConfig.longitude.toFixed(6) : "Not set"}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-custom)] bg-[var(--muted)]/50 
                           text-[var(--foreground)] text-sm font-mono font-semibold
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Radius Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              Detection Radius
            </label>
            <span className="text-xs font-semibold text-[var(--primary)]">
              {selectedRadius.desc}
            </span>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAttendanceConfig(prev => ({ ...prev, radius: option.value }))}
                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                           ${attendanceConfig.radius === option.value
                             ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm'
                             : 'border-[var(--border-custom)] bg-[var(--background)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]'
                           }`}
              >
                <div className={`w-3 h-3 rounded-full ${option.color} ${attendanceConfig.radius === option.value ? 'ring-2 ring-offset-1 ring-[var(--primary)]' : ''}`} />
                <span className={`text-xs font-bold ${attendanceConfig.radius === option.value ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Visual radius scale */}
          <div className="mt-3 flex items-center gap-3 px-2">
            <div className="flex-1 h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
                style={{ width: `${((attendanceConfig.radius - 50) / 450) * 100}%` }}
              />
            </div>
            <Info className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5 text-center">
            Students must be within this radius to mark attendance
          </p>
        </div>
      </div>
    </div>
  );
}