import React from 'react';

// Define la interfaz para los datos de los contadores
interface CounterData {
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

// Datos dummy para simular la API
const dummyCounterData: CounterData = {
  totalVictorias: 150,
  totalDerrotas: 75,
  totalEmpates: 30,
  mapaFavorable: 'Mapa A',
  mapaDesfavorable: 'Mapa B',
  mapaFavorito: 'Mapa C',
  diasVictoriosos: 45,
  diasEmpate: 10,
  diasDerrotas: 20,
  maximaRachaVictorias: 12,
  maximaRachaDerrotas: 7,
  rachaActualVictorias: 5,
  partidasNoShinchanPrimero: 60,
  porcentajeNoShinchan: 40,
};

export default function CountersSection() {
  // En un caso real, aquí harías la llamada a la API y guardarías los datos en un estado.
  // De momento, usaremos los datos dummy.
  const counterData = dummyCounterData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {/* Contadores */}
      <CounterCard title="Total Victorias" value={counterData.totalVictorias} />
      <CounterCard title="Total Derrotas" value={counterData.totalDerrotas} />
      <CounterCard title="Total Empates" value={counterData.totalEmpates} />
      <CounterCard title="Mapa Favorable" value={counterData.mapaFavorable} />
      <CounterCard title="Mapa Desfavorable" value={counterData.mapaDesfavorable} />
      <CounterCard title="Mapa Favorito" value={counterData.mapaFavorito} />
      <CounterCard title="Días Victoriosos" value={counterData.diasVictoriosos} />
      <CounterCard title="Días de Empate" value={counterData.diasEmpate} />
      <CounterCard title="Días de Derrotas" value={counterData.diasDerrotas} />
      <CounterCard title="Máxima Racha de Victorias" value={counterData.maximaRachaVictorias} />
      <CounterCard title="Máxima Racha de Derrotas" value={counterData.maximaRachaDerrotas} />
      <CounterCard title="Racha Actual de Victorias" value={counterData.rachaActualVictorias} />
      <CounterCard title="Partidas no Shinchan Primero" value={counterData.partidasNoShinchanPrimero} />
      <CounterCard title="Porcentaje No Shinchan" value={`${counterData.porcentajeNoShinchan}%`} />
    </div>
  );
}


interface CounterCardProps {
  title: string;
  value: string | number;
}

// Componente reutilizable para cada tarjeta de contador
function CounterCard({ title, value }: CounterCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}