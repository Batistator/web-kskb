"use client"
import React from 'react';
import Navbar from '../components/Navbar'; // Importa el Navbar
import CountersSection from '../components/CountersSection'; // Importa la sección de Contadores
import PieChart from '../components/PieChart'; // Importa el PieChart
import BarChart from '../components/BarChart'; // Importa el BarChart

// Datos dummy para el gráfico de tarta
const dummyPieData = {
  victorias: 150,
  derrotas: 75,
  empates: 30,
};

// Datos dummy para el gráfico de barras
const dummyBarData = [
  { mapa: 'Mapa A', victorias: 50, derrotas: 25, empates: 10 },
  { mapa: 'Mapa B', victorias: 30, derrotas: 35, empates: 5 },
  { mapa: 'Mapa C', victorias: 70, derrotas: 15, empates: 15 },
  { mapa: 'Mapa D', victorias: 20, derrotas: 5, empates: 0 },
];


export default function DashboardPage() {
  return (
    <div>
      <Navbar /> {/* Renderiza el Navbar */}

      <main className="bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Resumen del Dashboard</h1>

          <CountersSection /> {/* Renderiza la sección de Contadores */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Gráfico de Tarta */}
            <div className="bg-white shadow rounded-lg p-6">
              <PieChart victorias={dummyPieData.victorias} derrotas={dummyPieData.derrotas} empates={dummyPieData.empates} />
            </div>

            {/* Gráfico de Barras */}
            <div className="bg-white shadow rounded-lg p-6">
              <BarChart mapaData={dummyBarData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}