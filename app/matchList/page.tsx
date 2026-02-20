"use client";

import React, { useState, useEffect } from 'react';
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
  SortDescriptor,
  // --- NUEVOS IMPORTS ---
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  useDisclosure,
  Chip
} from "@heroui/react";
import LoadingSpinner from '../components/Spinner';
import { DateValue, parseDate } from "@internationalized/date";
import { RangeValue } from "@heroui/react";
import { useTheme } from '../context/ThemeContext';

export default function MatchListPage() {
  const [matchListData, setMatchListData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const router = useRouter();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: '', direction: 'ascending' });
  const { isDarkMode } = useTheme();

  // --- LÓGICA DEL MODAL ---
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedChat, setSelectedChat] = useState<any[]>([]);

  const handleOpenChat = (messages: any[]) => {
    setSelectedChat(messages);
    onOpen();
  };

  const formatMapName = (mapName: string) => {
    if (!mapName) return '';
    const modifiedName = mapName.startsWith('de_') ? mapName.slice(3) : mapName;
    return modifiedName.charAt(0).toUpperCase() + modifiedName.slice(1);
  };

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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}api/matches/getMatchListData?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setMatchListData(data);
    } catch (apiError: any) {
      setError('Error al cargar datos del dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  const DownloadButton = ({ 
    fileName, 
    onDownload, 
    isDownloading 
  }: { 
    fileName: string, 
    onDownload: (name: string) => void, 
    isDownloading: boolean 
  }) => {
    return (
      <Button 
        isIconOnly 
        size="sm" 
        variant="flat" 
        color="primary"
        isLoading={isDownloading}
        onPress={() => onDownload(fileName)}
      >
        {!isDownloading && "⬇️"}
      </Button>
    );
  };

  const handleDownload = async (fileName: string, checksum: string) => {
    // 1. Marcamos el ítem específico como cargando dentro de la lista
    setMatchListData((prevData: any[]) =>
      prevData.map((item) =>
        item.checksum === checksum ? { ...item, isDownloading: true } : item
      )
    );
    const token = localStorage.getItem('jwt_token');
    const apiDemoDownloadUrl = `${process.env.NEXT_PUBLIC_API_HOST}api/matches/download/${fileName}`;
    if (!token) {
      setError('No se encontró token de autenticación.');
      setIsLoading(false);
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch(apiDemoDownloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setMatchListData((prevData: any[]) =>
        prevData.map((item) =>
          item.checksum === checksum ? { ...item, isDownloading: false } : item
        )
      );
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error descargando el archivo:", error);
      alert("Error al descargar el fichero de demo.");
    } 
  };

  // Efecto para inicializar datos (simplificado para legibilidad)
  useEffect(() => {
    const storedValue = localStorage.getItem('dateRange');
    const startStr = storedValue ? JSON.parse(storedValue).start : "2023-09-01";
    const endStr = storedValue ? JSON.parse(storedValue).end : "2099-01-01";
    
    fetchData(startStr, endStr);
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
      sorted.sort((a, b) => {
        const first = a[sortDescriptor.column as keyof any];
        const second = b[sortDescriptor.column as keyof any];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }
    return sorted;
  }, [matchListData, sortDescriptor]);

  if (isLoading) return (
    <div>
      <Navbar />
      <main className={`py-6 flex justify-center items-center h-screen ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        <LoadingSpinner />
      </main>
    </div>
  );

  return (
    <div>
      <Navbar />
      <main className={`py-6 min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Lista de partidas</h1>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} startDate={startDate} endDate={endDate} />
          </div>

          <Table 
            isCompact 
            isStriped 
            aria-label="Partidas jugadas" 
            sortDescriptor={sortDescriptor} 
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              <TableColumn key="date" allowsSorting>Fecha</TableColumn>
              <TableColumn key="weekDay" allowsSorting>Día</TableColumn>
              <TableColumn key="map" allowsSorting>Mapa</TableColumn>
              <TableColumn key="duration" allowsSorting>Duración</TableColumn>
              <TableColumn key="teamAScore" allowsSorting>Eq. A</TableColumn>
              <TableColumn key="teamBScore" allowsSorting>Eq. B</TableColumn>
              <TableColumn key="result" allowsSorting>Resultado</TableColumn>
              <TableColumn key="overtime" allowsSorting>Prórroga</TableColumn>
              <TableColumn key="chat" align="center">Chat</TableColumn>
              <TableColumn key="download" align="center">Download</TableColumn>
            </TableHeader>
            <TableBody items={sortedItems}>
              {(item) => (
                <TableRow key={item.checksum}>
                  <TableCell>{moment(item.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell>{item.weekDay}</TableCell>
                  <TableCell>{formatMapName(item.map)}</TableCell>
                  <TableCell>{item.durationString}</TableCell>
                  <TableCell>{item.teamAScore}</TableCell>
                  <TableCell>{item.teamBScore}</TableCell>
                  <TableCell>
                    <span className={item.result === 'Victoria' ? 'text-green-500 font-bold' : item.result === 'Derrota' ? 'text-red-500 font-bold' : 'text-yellow-500'}>
                      {item.result}
                    </span>
                  </TableCell>
                  <TableCell>{item.overtime ? 'Sí' : 'No'}</TableCell>
                  {/* CELDA CON BOTÓN CONDICIONAL */}
                  <TableCell>
                    {item.chatMessages && item.chatMessages.length > 0 ? (
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat" 
                        color="primary"
                        onPress={() => handleOpenChat(item.chatMessages)}
                      >
                        💬
                      </Button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.demoFileName && item.demoFileName.trim().length > 0 ? (
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat" 
                        color="default"
                        // Ahora leemos el estado del propio objeto 'item'
                        isLoading={item.isDownloading} 
                        onPress={() => handleDownload(item.demoFileName, item.checksum)}
                      >
                        {!item.isDownloading && "⬇️"}
                      </Button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* --- MODAL PARA EL CHAT --- */}
          <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            scrollBehavior="inside"
            size="lg"
            className={isDarkMode ? "dark text-foreground bg-background" : ""}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Historial del Chat</ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-3">
                      {selectedChat.map((msg, index) => (
                        <div key={index} className="border-b border-divider pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-small">{msg.playerName}:</span>
                            <Chip size="sm" variant="flat" color={msg.playerSide === "2" ? "warning" : "primary"}>
                               {msg.playerSide === "2" ? "T" : "CT"}
                            </Chip>
                            {!msg.playerAlive && <Chip size="sm" color="danger" variant="dot">Muerto</Chip>}
                            
                          </div>
                          <p className="text-sm italic pl-4">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

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