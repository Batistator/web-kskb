"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CountersSection from '../components/CountersSection';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { useRouter } from 'next/navigation';
import DateRangePicker from '../components/DateRangePicker';
import moment from 'moment';
import LoadingSpinner from '../components/Spinner';
import { RangeValue } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme(); // Leer el estado global del tema

  const fetchData = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('jwt_token');

    if (!token) {
      setError('No se encontró token de autenticación.');
      setIsLoading(false);
      router.push('/login');
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}api/dashboard/getDashboardData?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error al obtener datos del dashboard. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (jsonError) {
          console.error('Error parsing error JSON response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setDashboardData(data);
      setIsLoading(false);

    } catch (apiError: any) {
      console.error('Error al hacer la petición a la API:', apiError);
      setError('Error al cargar datos del dashboard. Por favor, intenta de nuevo más tarde.');
      setIsLoading(false);
    }
  };

  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: startDate ? parseDate(startDate.format('YYYY-MM-DD')) : parseDate("2023-09-01"),
    end: endDate ? parseDate(endDate.format('YYYY-MM-DD')) : parseDate("2099-01-01")
  });

  useEffect(() => {
    const storedValue = localStorage.getItem('dateRange');
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token");
  
      if (!token) {
        router.push('/login');
      } else {
        validateToken(token).then((validationResult) => {
          if (!validationResult.isValid) {
            router.push('/login');
          } else {
            if (storedValue) {
              const parsedValue = JSON.parse(storedValue);
              setValue({
                start: parseDate(parsedValue.start),
                end: parseDate(parsedValue.end)
              });
              // Usar directamente los valores parseados
              fetchData(parsedValue.start, parsedValue.end);
            } else {
              setValue({
                start: startDate ? parseDate(startDate.format('YYYY-MM-DD')) : parseDate("2023-09-01"),
                end: endDate ? parseDate(endDate.format('YYYY-MM-DD')) : parseDate("2099-01-01")
              });
              // Usar los valores por defecto
              fetchData(
                startDate ? startDate.format('YYYY-MM-DD') : "2023-09-01", 
                endDate ? endDate.format('YYYY-MM-DD') : "2099-01-01"
              );
            }
          }
        });
      }
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (startDate: moment.Moment | null, endDate: moment.Moment | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate && endDate) {
      fetchData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className={`py-6 flex justify-center items-center h-screen ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4">Cargando datos del dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <main className={`py-6 flex justify-center items-center h-screen ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <p className="text-red-500">Error al cargar el dashboard: {error}</p>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <Navbar />
        <main className={`py-6 flex justify-center items-center h-screen ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <p>No hay datos disponibles para el dashboard.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className={`py-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Resumen de partidas</h1>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className={`shadow rounded-lg p-6 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
              <PieChart
                victorias={dashboardData.wins}
                derrotas={dashboardData.losses}
                empates={dashboardData.ties}
              />
            </div>
            <div className={`shadow rounded-lg p-6 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
              <BarChart mapaData={dashboardData.resultsPerMap} />
            </div>
          </div>
          <CountersSection
            totalVictorias={dashboardData.wins}
            totalDerrotas={dashboardData.losses}
            totalEmpates={dashboardData.ties}
            mapaFavorable={dashboardData.bestMap}
            mapaDesfavorable={dashboardData.worstMap}
            mapaFavorito={dashboardData.favouriteMap}
            diasVictoriosos={dashboardData.allWinsDays}
            diasEmpate={dashboardData.allTiesDays}
            diasDerrotas={dashboardData.allLosesDays}
            maximaRachaVictorias={dashboardData.maxWinStreak}
            maximaRachaDerrotas={dashboardData.maxLoseStreak}
            rachaActualVictorias={dashboardData.actualWinStreak}
            partidasNoShinchanPrimero={dashboardData.noBestShinchanMatches}
            porcentajeNoShinchan={dashboardData.noBestShinchanRate}
          />
        </div>
      </main>
    </div>
  );
}

async function validateToken(token: string): Promise<{ isValid: boolean }> {
  const backendValidationEndpoint = `${process.env.NEXT_PUBLIC_API_HOST}api/validation/token`;
  try {
    const response = await fetch(backendValidationEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { isValid: true };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    console.error('Error al validar el token con el backend:', error);
    return { isValid: false };
  }
}