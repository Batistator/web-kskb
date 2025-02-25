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

export default function MatchListPage() {
  const [matchListData, setMatchListData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
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

      const apiUrl = `http://localhost:8080/api/total/getTotalData?startDate=${startDate}&endDate=${endDate}`;

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

    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("jwt_token");

        if (!token) {
          router.push('/login');
        } else {
          validateToken(token).then((validationResult) => {
            if (!validationResult.isValid) {
              router.push('/login');
            } else {
              fetchData('2020-01-01', '2040-01-01');
            }
          });
        }
      }
    }, []);

    const handleDateRangeChange = (startDate: moment.Moment | null, endDate: moment.Moment | null) => {
      setStartDate(startDate);
      setEndDate(endDate);
      if (startDate && endDate) {
        fetchData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      }
    };

    const sortedItems = React.useMemo(() => {
      let sorted = [...(matchListData || [])];

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
  }, [matchListData, sortDescriptor]);


    if (isLoading) {
      return (
        <div>
          <Navbar />
          <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
            <p>Cargando datos de partidas...</p>
          </main>
        </div>
      );
    }

    if (error) {
      return (
        <div>
          <Navbar />
          <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
            <p className="text-red-500">Error al cargar estadísticas: {error}</p>
          </main>
        </div>
      );
    }

    if (!matchListData) {
      return (
        <div>
          <Navbar />
          <main className="bg-gray-100 py-6 flex justify-center items-center h-screen">
            <p>No hay datos disponibles de partidas.</p>
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
            <h1 className="text-2xl font-semibold text-gray-900">Estadísticas</h1>
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
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              <TableColumn key="data" allowsSorting>
                Dato
              </TableColumn>
              <TableColumn key="icon" allowsSorting>
                <Image src="/path/to/image" alt="description" width={50} height={50} />
              </TableColumn>
              <TableColumn key="shinchan" allowsSorting>
                ShinChan
              </TableColumn>
              <TableColumn key="kazama" allowsSorting>
                Kazama
              </TableColumn>
              <TableColumn key="nene" allowsSorting>
                Nene
              </TableColumn>
              <TableColumn key="swagchan" allowsSorting>
                SwagChan
              </TableColumn>
              <TableColumn key="mafios" allowsSorting>
                The Mafios
              </TableColumn>
            </TableHeader>
            <TableBody items={sortedItems}>
              {(item) => (
                <TableRow key={getKeyValue(item, "data")}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.icon}</TableCell>
                  <TableCell>{item.shinchan}</TableCell>
                  <TableCell>{item.kazama}</TableCell>
                  <TableCell>{item.nene}</TableCell>
                  <TableCell>{item.swagchan}</TableCell>
                  <TableCell>{item.mafios}</TableCell>
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