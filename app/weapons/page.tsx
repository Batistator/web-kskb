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
  SortDescriptor
} from "@heroui/react";
import Image from 'next/image';
import LoadingSpinner from '../components/Spinner';
import { RangeValue } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";

export default function WeaponsPage() {
  const [weaponsData, setWeaponsData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [counts, setCounts] = useState({ shinchan: 0, kazama: 0, nene: 0, swagchan: 0, mafios: 0 });
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: '', direction: 'ascending' });

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

    const apiUrl = `http://localhost:8080/api/weapons/getWeaponData?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error al obtener datos de armas. Status: ${response.status}`;
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
      setWeaponsData(data);

      // Contar los registros que no son 0 para cada personaje
      const counts = {
        shinchan: data.filter((item: any) => item.shinchan !== 0).length,
        kazama: data.filter((item: any) => item.kazama !== 0).length,
        nene: data.filter((item: any) => item.nene !== 0).length,
        swagchan: data.filter((item: any) => item.swagchan !== 0).length,
        mafios: data.filter((item: any) => item.mafios !== 0).length,
      };
      setCounts(counts);

      setIsLoading(false);

    } catch (apiError: any) {
      console.error('Error al hacer la petición a la API:', apiError);
      setError('Error al cargar datos de armas. Por favor, intenta de nuevo más tarde.');
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

  const sortedItems = React.useMemo(() => {
    let sorted = [...(weaponsData || [])];
  
    if (sortDescriptor.column && sortDescriptor.direction) {
      const key = sortDescriptor.column;
      const direction = sortDescriptor.direction;
  
      sorted.sort((a: any, b: any) => {
        let aValue = a[key];
        let bValue = b[key];
  
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [weaponsData, sortDescriptor]);

  if (isLoading) {
    return (
      <div>
      <Navbar />
      <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
        <LoadingSpinner />
        <p className="mt-4">Cargando contadores...</p>
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
          <p className="text-red-500">Error al cargar contadores: {error}</p>
        </main>
      </div>
    );
  }

  if (!weaponsData) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
          <p>No hay datos disponibles de armas.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Armas</h1>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          {/* Panel de contadores */}
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-900">ShinChan</span>
                <span className="text-2xl font-bold text-blue-600">{counts.shinchan}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-900">Kazama</span>
                <span className="text-2xl font-bold text-yellow-600">{counts.kazama}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-900">Nene</span>
                <span className="text-2xl font-bold text-yellow-400">{counts.nene}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-900">SwagChan</span>
                <span className="text-2xl font-bold text-purple-600">{counts.swagchan}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-900">The Mafios</span>
                <span className="text-2xl font-bold text-green-600">{counts.mafios}</span>
              </div>
            </div>
          </div>

          <Table
            isCompact
            isStriped
            aria-label="Armas"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              <TableColumn key="icon">
                &nbsp;
              </TableColumn>
              <TableColumn key="weapon" allowsSorting>
                Arma
              </TableColumn>
              <TableColumn key="shinchan" style={{ color: '#262626', background: 'linear-gradient(to right, rgba(104,163,229,0) 0%, rgba(104,163,229,0.75) 50% 90%, rgba(104,163,229,0) 100%)', borderRadius: '16px', textAlign: 'right' }} allowsSorting>
                ShinChan&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="kazama" style={{ color: '#262626', background: 'linear-gradient(to right, rgba(237,163,56,0) 0%, rgba(237,163,56,0.75) 50% 90%, rgba(237,163,56,0) 100%)', borderRadius: '16px', textAlign: 'right' }} allowsSorting>
                Kazama&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="nene" style={{ color: '#262626', background: 'linear-gradient(to right, rgba(230,241,61,0) 0%, rgba(230,241,61,0.75) 50% 90%, rgba(230,241,61,0) 100%)', borderRadius: '16px', textAlign: 'right' }} allowsSorting>
                Nene&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="swagchan" style={{ color: '#262626', background: 'linear-gradient(to right, rgba(128,60,161,0) 0%, rgba(128,60,161,0.75) 50% 90%, rgba(128,60,161,0) 100%)', borderRadius: '16px', textAlign: 'right' }} allowsSorting>
                SwagChan&nbsp;&nbsp;
              </TableColumn>
              <TableColumn key="mafios" style={{ color: '#262626', background: 'linear-gradient(to right, rgba(16,152,86,0) 0%, rgba(16,152,86,0.75) 50% 90%, rgba(16,152,86,0) 100%)', borderRadius: '16px', textAlign: 'right' }} allowsSorting>
                The Mafios&nbsp;&nbsp;
              </TableColumn>
            </TableHeader>
            <TableBody items={sortedItems}>
              {(item: any) => (
                <TableRow key={getKeyValue(item, "weapon")}>
                    <TableCell style={{ width: '150px', height: '30px' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={item.icon || '/default-icon.png'} alt="icon" width={150} height={30} style={{ objectFit: 'contain', maxHeight: '30px' }} />
                    </div>
                    </TableCell>
                    <TableCell style={{ maxWidth: '150px' }}>{item.weapon}</TableCell>
                    <TableCell style={{ flex: 1, background: 'linear-gradient(to right, rgba(104,163,229,0) 0%, rgba(104,163,229,0.75) 50% 90%, rgba(104,163,229,0) 100%)', textAlign: 'right' }}>{item.shinchan}&nbsp;&nbsp;</TableCell>
                    <TableCell style={{ flex: 1, background: 'linear-gradient(to right, rgba(237,163,56,0) 0%, rgba(237,163,56,0.75) 50% 90%, rgba(237,163,56,0) 100%)', textAlign: 'right' }}>{item.kazama}&nbsp;&nbsp;</TableCell>
                    <TableCell style={{ flex: 1, background: 'linear-gradient(to right, rgba(230,241,61,0) 0%, rgba(230,241,61,0.75) 50% 90%, rgba(230,241,61,0) 100%)', textAlign: 'right' }}>{item.nene}&nbsp;&nbsp;</TableCell>
                    <TableCell style={{ flex: 1, background: 'linear-gradient(to right, rgba(128,60,161,0) 0%, rgba(128,60,161,0.75) 50% 90%, rgba(128,60,161,0) 100%)', textAlign: 'right' }}>{item.swagchan}&nbsp;&nbsp;</TableCell>
                    <TableCell style={{ flex: 1, background: 'linear-gradient(to right, rgba(16,152,86,0) 0%, rgba(16,152,86,0.75) 50% 90%, rgba(16,152,86,0) 100%)', textAlign: 'right' }}>{item.mafios}&nbsp;&nbsp;</TableCell>
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