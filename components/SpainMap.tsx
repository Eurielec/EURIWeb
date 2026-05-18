'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = '/spain-provinces.json';

// Projection config for Spain
const PROJECTION_CONFIG = {
  center: [-3.5, 40] as [number, number],
  scale: 2500,
};

export function SpainMap({ members }: { members: any[] }) {
  const [hoveredInfo, setHoveredInfo] = useState<{type: 'province'|'city', title: string, subtitle?: string, count: number} | null>(null);

  // Contar socios totales por provincia para el hover del fondo
  const provinceCounts = members.reduce((acc, m) => {
    if (!m.province) return acc;
    let prov = m.province;
    if (prov === 'Valencia') prov = 'València/Valencia';
    if (prov === 'Alicante') prov = 'Alacant/Alicante';
    if (prov === 'Castellón') prov = 'Castelló/Castellón';
    if (prov === 'Álava') prov = 'Araba/Álava';
    
    acc[prov] = (acc[prov] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Agrupar miembros por mismas coordenadas para mostrar contadores si hay más de 1 en la misma ciudad
  const membersByCoords = members.reduce((acc, m) => {
    if (!m.latitude || !m.longitude) return acc;
    const key = `${m.latitude},${m.longitude}`;
    if (!acc[key]) {
      acc[key] = {
         city: m.city || m.province,
         province: m.province,
         lat: m.latitude,
         lon: m.longitude,
         count: 1
      };
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {} as Record<string, any>);

  const validPoints = Object.values(membersByCoords);

  return (
    <div className="relative w-full aspect-4/3 max-w-4xl mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl flex items-center justify-center p-4">
      {/* Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute top-8 right-8 border px-4 py-3 rounded-xl shadow-xl z-20 pointer-events-none"
          style={{ background: '#111', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          <p className="font-black text-lg" style={{ color: '#ffffff' }}>
            {hoveredInfo.title}
          </p>
          {hoveredInfo.subtitle && (
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{hoveredInfo.subtitle}</p>
          )}
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {hoveredInfo.count} {hoveredInfo.count === 1 ? 'Socio' : 'Socios'}{hoveredInfo.type === 'province' && ' en total'}
          </p>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJECTION_CONFIG}
        className="w-full h-full relative z-10"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const provinceName = geo.properties.name;
              const pCount = provinceCounts[provinceName] || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredInfo({ type: 'province', title: provinceName, count: pCount })}
                  onMouseLeave={() => setHoveredInfo(null)}
                  style={{
                    default: {
                      fill: '#171717', 
                      stroke: '#3f3f46',
                      strokeWidth: 0.5,
                      outline: 'none',
                      transition: 'fill 250ms'
                    },
                    hover: {
                      fill: '#262626', // Ligerísimo cambio para saber qué se toca, sin colores chillones
                      stroke: '#52525b',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'default',
                    },
                    pressed: {
                      fill: '#262626',
                      outline: 'none',
                    }
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Markers para cada ciudad */}
        {validPoints.map((point: any, idx) => (
          <Marker 
            key={idx} 
            coordinates={[point.lon, point.lat]}
            onMouseEnter={() => setHoveredInfo({ type: 'city', title: point.city, subtitle: point.province, count: point.count })}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            <circle 
              r={point.count > 1 ? 6 + (point.count * 0.5) : 5} 
              fill="#fb923c" 
              className="drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] cursor-pointer hover:fill-orange-300 transition-colors"
            />
          </Marker>
        ))}
      </ComposableMap>

      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />
    </div>
  );
}
