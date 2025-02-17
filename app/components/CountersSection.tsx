'use client'; // Marca el componente como Client Component para usar hooks

import React from 'react';

interface CountersSectionProps {
  totalVictorias: number;
  totalDerrotas: number;
  totalEmpates: number;
  mapaFavorable: string;
  mapaDesfavorable: string;
  mapaFavorito: string;
  diasVictoriosos: number;
  diasEmpate: number;
  diasDerrotas: number;
  maximaRachaVictorias: number;
  maximaRachaDerrotas: number;
  rachaActualVictorias: number;
  partidasNoShinchanPrimero: number;
  porcentajeNoShinchan: number;
}

const CountersSection: React.FC<CountersSectionProps> = ({
  totalVictorias,
  totalDerrotas,
  totalEmpates,
  mapaFavorable,
  mapaDesfavorable,
  mapaFavorito,
  diasVictoriosos,
  diasEmpate,
  diasDerrotas,
  maximaRachaVictorias,
  maximaRachaDerrotas,
  rachaActualVictorias,
  partidasNoShinchanPrimero,
  porcentajeNoShinchan,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <CounterCard title="Total Victorias" value={totalVictorias} />
      <CounterCard title="Total Derrotas" value={totalDerrotas} />
      <CounterCard title="Total Empates" value={totalEmpates} />
      <CounterCard title="Mapa Favorable" value={mapaFavorable} />
      <CounterCard title="Mapa Desfavorable" value={mapaDesfavorable} />
      <CounterCard title="Mapa Favorito" value={mapaFavorito} />
      <CounterCard title="Días Victoriosos" value={diasVictoriosos} />
      <CounterCard title="Días de Empate" value={diasEmpate} />
      <CounterCard title="Días de Derrotas" value={diasDerrotas} />
      <CounterCard title="Máxima Racha Victorias" value={maximaRachaVictorias} />
      <CounterCard title="Máxima Racha Derrotas" value={maximaRachaDerrotas} />
      <CounterCard title="Racha Actual Victorias" value={rachaActualVictorias} />
      <CounterCard title="Partidas no Shinchan Primero" value={partidasNoShinchanPrimero} />
      <CounterCard title="Porcentaje No Shinchan" value={`${porcentajeNoShinchan}%`} />
    </div>
  );
};

interface CounterCardProps {
  title: string;
  value: string | number;
}

const CounterCard: React.FC<CounterCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
};

export default CountersSection;