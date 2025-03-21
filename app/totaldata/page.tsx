"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import DateRangePicker from '../components/DateRangePicker';
import moment from 'moment';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  SortDescriptor
} from "@heroui/react";
import Image from 'next/image';
import LoadingSpinner from '../components/Spinner';
import { RangeValue } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext

export default function MatchListPage() {
  const [matchListData, setMatchListData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: '', direction: 'ascending' });
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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}api/total/getTotalData?startDate=${startDate}&endDate=${endDate}`;

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
      setMatchListData(data);
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
        <p className="mt-4">Cargando estadísticas...</p>
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
          <p className="text-red-500">Error al cargar estadísticas: {error}</p>
        </main>
      </div>
    );
  }

  if (!matchListData) {
    return (
      <div>
        <Navbar />
        <main className={`py-6 flex justify-center items-center h-screen ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <p>No hay datos disponibles de partidas.</p>
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
          <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Estadísticas</h1>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <Table
            isCompact
            isStriped
            aria-label="Datos totales"
          >
            <TableHeader>
              <TableColumn key="icon">
                &nbsp;
              </TableColumn>
              <TableColumn key="data">
                &nbsp;
              </TableColumn>
                <TableColumn key="shinchan" style={{ color: isDarkMode ? '#FFFFFF' : '#262626', background: 'linear-gradient(to right, rgba(104,163,229,0) 0%, rgba(104,163,229,0.50) 50% 90%, rgba(104,163,229,0) 100%)', borderRadius: '16px', textAlign: 'right' }}>
                ShinChan&nbsp;&nbsp;
                </TableColumn>
              <TableColumn key="kazama" style={{ color: isDarkMode ? '#FFFFFF' : '#262626', background: 'linear-gradient(to right, rgba(237,163,56,0) 0%, rgba(237,163,56,0.50) 50% 90%, rgba(237,163,56,0) 100%)', borderRadius: '16px', textAlign: 'right' }}>
                Kazama&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="nene" style={{ color: isDarkMode ? '#FFFFFF' : '#262626', background: 'linear-gradient(to right, rgba(230,241,61,0) 0%, rgba(230,241,61,0.50) 50% 90%, rgba(230,241,61,0) 100%)', borderRadius: '16px', textAlign: 'right' }}>
                Nene&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="swagchan" style={{ color: isDarkMode ? '#FFFFFF' : '#262626', background: 'linear-gradient(to right, rgba(128,60,161,0) 0%, rgba(128,60,161,0.50) 50% 90%, rgba(128,60,161,0) 100%)', borderRadius: '16px', textAlign: 'right' }}>
                SwagChan&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="mafios" style={{ color: isDarkMode ? '#FFFFFF' : '#262626', background: 'linear-gradient(to right, rgba(16,152,86,0) 0%, rgba(16,152,86,0.50) 50% 90%, rgba(16,152,86,0) 100%)', borderRadius: '16px', textAlign: 'right' }}>
                The Mafios&nbsp;&nbsp;
              </TableColumn>
            </TableHeader>
            <TableBody items={matchListData}>
              {(item: any) => (
                <TableRow key={getKeyValue(item, "data")}>
                  <TableCell style={{ width: '150px' }}><Image className={isDarkMode ? "invert" : ""} src={item.icon || '/default-icon.png'} alt="icon" width={150} height={30} /></TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell style={{ background: 'linear-gradient(to right, rgba(104,163,229,0) 0%, rgba(104,163,229,0.50) 50% 90%, rgba(104,163,229,0) 100%)', textAlign: 'right' }}>{item.shinchan}&nbsp;&nbsp;</TableCell>
                  <TableCell style={{ background: 'linear-gradient(to right, rgba(237,163,56,0) 0%, rgba(237,163,56,0.50) 50% 90%, rgba(237,163,56,0) 100%)', textAlign: 'right' }}>{item.kazama}&nbsp;&nbsp;</TableCell>
                  <TableCell style={{ background: 'linear-gradient(to right, rgba(230,241,61,0) 0%, rgba(230,241,61,0.50) 50% 90%, rgba(230,241,61,0) 100%)', textAlign: 'right' }}>{item.nene}&nbsp;&nbsp;</TableCell>
                  <TableCell style={{ background: 'linear-gradient(to right, rgba(128,60,161,0) 0%, rgba(128,60,161,0.50) 50% 90%, rgba(128,60,161,0) 100%)', textAlign: 'right' }}>{item.swagchan}&nbsp;&nbsp;</TableCell>
                  <TableCell style={{ background: 'linear-gradient(to right, rgba(16,152,86,0) 0%, rgba(16,152,86,0.50) 50% 90%, rgba(16,152,86,0) 100%)', textAlign: 'right' }}>{item.mafios}&nbsp;&nbsp;</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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