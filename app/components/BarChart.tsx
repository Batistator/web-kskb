import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface BarChartProps {
  mapaData: {
    mapa: string;
    victorias: number;
    derrotas: number;
    empates: number;
  }[]; // Array de objetos con datos por mapa
}


export default function BarChart({ mapaData }: BarChartProps) {
  const labels = mapaData.map(data => data.mapa); // Etiquetas del eje X (nombres de mapas)

  const data = {
    labels,
    datasets: [
      {
        label: 'Victorias',
        data: mapaData.map(data => data.victorias),
        backgroundColor: 'rgba(54, 162, 54, 0.8)', // Verde para Victorias
      },
      {
        label: 'Derrotas',
        data: mapaData.map(data => data.derrotas),
        backgroundColor: 'rgba(255, 99, 132, 0.8)', // Rojo para Derrotas
      },
      {
        label: 'Empates',
        data: mapaData.map(data => data.empates),
        backgroundColor: 'rgba(255, 206, 86, 0.8)', // Amarillo para Empates
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Resultados por Mapa',
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Eje Y empieza en 0
        title: {
          display: true,
          text: 'Número de Partidas', // Título del eje Y
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mapas', // Título del eje X
        },
      },
    },
  };


  return <div style={{ height: '400px' }}> <Bar data={data} options={options} /> </div>;
}