import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  mapaData: {
    mapName: string; // Usa mapName para que coincida con el JSON del backend
    wins: number;    // Usa wins, losses, ties para que coincida con el JSON
    losses: number;
    ties: number;
  }[];
}

export default function BarChart({ mapaData }: BarChartProps) {
  const formatMapName = (mapName: string) => {
    const modifiedName = mapName.slice(3); // Elimina los 3 primeros caracteres
    return modifiedName.charAt(0).toUpperCase() + modifiedName.slice(1); // Pone el primer carácter en mayúscula
  };

  const { isDarkMode } = useTheme(); // Leer el estado global del tema
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'; // Color según el modo
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'; // Color de las líneas de guía

  const labels = mapaData.map(data => formatMapName(data.mapName)); // Usa mapName para el nombre del mapa

  const data = {
    labels,
    datasets: [
      {
        label: 'Victorias',
        data: mapaData.map(data => data.wins),    // Usa wins
        backgroundColor: 'rgba(54, 162, 54, 0.8)',
      },
      {
        label: 'Derrotas',
        data: mapaData.map(data => data.losses),   // Usa losses
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: 'Empates',
        data: mapaData.map(data => data.ties),     // Usa ties
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor, // Color del texto de la leyenda
        },
      },
      title: {
        display: true,
        text: 'Resultados por Mapa',
        color: textColor, // Color del texto del título
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Partidas',
          color: textColor, // Color del texto del eje Y
        },
        ticks: {
          color: textColor, // Color de las etiquetas del eje Y
        },
        grid: {
          color: gridColor, // Color de las líneas de guía del eje Y
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mapas',
          color: textColor, // Color del texto del eje X
        },
        ticks: {
          color: textColor, // Color de las etiquetas del eje X
        },
        grid: {
          color: gridColor, // Color de las líneas de guía del eje X
        },
      },
    },
  };

  return <div style={{ height: '400px' }}> <Bar data={data} options={options} /> </div>;
}