'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DateRangePicker from '../components/DateRangePicker'; // Ajusta la ruta según la ubicación de tu componente
import Image from 'next/legacy/image';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/Spinner';
import { DateValue, RangeValue } from '@heroui/react';
import { parseDate } from '@internationalized/date';

interface Title {
  player: string;
  valueString: string;
  title: string;
  description: string;
  icon: string;
}

export default function TitlesPage() {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [titlesData, setTitlesData] = useState<Title[]>([]);
  const router = useRouter();

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

    const apiUrl = `http://localhost:8080/api/titles/getAllTitles?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error al obtener datos de títulos. Status: ${response.status}`;
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
      setTitlesData(data);
      setIsLoading(false);

    } catch (apiError: any) {
      console.error('Error al hacer la petición a la API:', apiError);
      setError('Error al cargar datos de titulos. Por favor, intenta de nuevo más tarde.');
      setIsLoading(false);
    }
  };

  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: startDate ? parseDate(startDate.format('YYYY-MM-DD')) : parseDate("2023-09-01"),
    end: endDate ? parseDate(endDate.format('YYYY-MM-DD')) : parseDate("2099-01-01")
  });

  const handleDateRangeChange = (startDate: moment.Moment | null, endDate: moment.Moment | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate && endDate) {
      fetchData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  };

  const countTitlesByPlayer = (titles: Title[]) => {
    const counts: { [key: string]: number } = {};
    titles.forEach(title => {
      if (!(title.player === '-')) {
        counts[title.player] = (counts[title.player] || 0) + 1;  
      }
    });
    return counts;
  };

  const playerTitleCounts = countTitlesByPlayer(titlesData);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4">Cargando datos de títulos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
          <p className="text-red-500">Error al cargar lista de títulos: {error}</p>
        </main>
      </div>
    );
  }

  if (!titlesData) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
          <p>No hay datos disponibles de títulos.</p>
        </main>
      </div>
    );
  }

  function playerColor(player: string) {
    const colors: { [key: string]: string } = {
      'ShinChan': 'blue-600',
      'The Mafios': 'green-600',
      'Nene': 'yellow-400',
      'SwagChan': 'purple-600',
      'Kazama': 'yellow-600',
    };
    return colors[player] || 'gray';
  }

  return (
    <div>
      <Navbar />
      <main className="bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Lista de Títulos</h1>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          {/* Panel de contadores */}
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(playerTitleCounts).map(([player, count]) => {
                const colorClass = `text-${playerColor(player)}`;
                return (
                  <div key={player} className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-gray-900">{player}</span>
                    <span className={`text-2xl font-bold ${colorClass}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            {titlesData.map((title: Title) => {
              let bgColorClass = "";
              let bgColorStyle = {};
              
              // Set background color based on player
              switch(title.player) {
                case 'ShinChan':
                  bgColorStyle = { backgroundColor: "rgba(104,163,229,0.75)" };
                  bgColorClass = "border border-blue-800";
                  break;
                case 'The Mafios':
                  bgColorStyle = { backgroundColor: "rgba(16,152,86,0.75)" };
                  bgColorClass = "border border-green-800";
                  break;
                case 'Nene':
                  bgColorStyle = { backgroundColor: "rgba(230,241,61,0.75)" };
                  bgColorClass = "border border-yellow-500";
                  break;
                case 'SwagChan':
                  bgColorStyle = { backgroundColor: "rgba(128,60,161,0.75)" };
                  bgColorClass = "border border-purple-800";
                  break;
                case 'Kazama':
                  bgColorStyle = { backgroundColor: "rgba(237,163,56,0.75)" };
                  bgColorClass = "border border-yellow-800";
                  break;
                default:
                  bgColorClass = "border border-gray-400 bg-gray-200";
              }
              
              return (
                <div 
                  key={title.title} 
                  className={`p-4 rounded-lg shadow-lg ${bgColorClass} mx-2 my-6 flex flex-col text-black`} 
                  style={{ width: '200px', minHeight: '320px', ...bgColorStyle }}
                >
                  <h2 className="text-xl font-bold text-center truncate" title={title.title}>{title.title}</h2>
                  <p className="text-gray-800 text-center h-12 overflow-hidden text-sm" title={title.description}>{title.description}</p>
                  <div className="w-full h-48 relative my-2">
                    <Image src={title.icon} alt={title.title} layout="fill" objectFit="contain" />
                  </div>
                  <p className="text-sm text-gray-800 text-center truncate">{title.valueString}</p>
                  <p className="text-lg font-semibold text-center truncate mt-auto">{title.player}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

async function validateToken(token: string): Promise<{ isValid: boolean }> {
  const backendValidationEndpoint = 'http://localhost:8080/api/validation/token';
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