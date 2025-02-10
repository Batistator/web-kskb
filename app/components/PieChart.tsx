import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  victorias: number;
  derrotas: number;
  empates: number;
}

export default function PieChart({ victorias, derrotas, empates }: PieChartProps) {
  const data = {
    labels: ['Victorias', 'Derrotas', 'Empates'],
    datasets: [
      {
        label: '# de Partidas',
        data: [victorias, derrotas, empates],
        backgroundColor: [
          'rgba(54, 162, 54, 0.8)', // Verde para Victorias
          'rgba(255, 99, 132, 0.8)', // Rojo para Derrotas
          'rgba(255, 206, 86, 0.8)', // Amarillo para Empates
        ],
        borderColor: [
          'rgba(54, 162, 54, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar la relación de aspecto
    plugins: {
      legend: {
        position: 'bottom' as const, // Leyenda abajo
      },
      title: {
        display: true,
        text: 'Distribución de Resultados',
      },
    },
  };


  return <div style={{ height: '300px' }}> <Pie data={data} options={options} /> </div>;
}