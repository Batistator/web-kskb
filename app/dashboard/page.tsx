'use client'; // Marca como Client Component para usar hooks
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CountersSection from '../components/CountersSection'; // Importa CountersSection
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null); // Estado para los datos del dashboard
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // Seguridad para SSR/SSG
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        router.push('/login');
      } else {
        validateToken(token).then((validationResult) => {
          if (!validationResult.isValid) {
            router.push('/login');
          }
        });
      }
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('jwt_token')

      console.log('Token:', token);

      if (!token) {
        setError('No se encontró token de autenticación.');
        setIsLoading(false);
        return;
      }

      const startDate = '2020-01-01';
      const endDate = '2040-01-01';
      const apiUrl = `http://localhost:8080/api/dashboard/getDashboardData?startDate=${startDate}&endDate=${endDate}`;

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
        setDashboardData(data); // Guarda toda la respuesta en el estado
        setIsLoading(false);

      } catch (apiError: any) {
        console.error('Error al hacer la petición a la API:', apiError);
        setError('Error al cargar datos del dashboard. Por favor, intenta de nuevo más tarde.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen"> {/* Centra el mensaje de carga */}
          <p>Cargando datos del dashboard...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen"> {/* Centra el mensaje de error */}
          <p className="text-red-500">Error al cargar el dashboard: {error}</p>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <Navbar />
        <main className="bg-gray-100 py-6 flex justify-center items-center h-screen"> {/* Centra el mensaje de no datos */}
          <p>No hay datos disponibles para el dashboard.</p>
        </main>
      </div>
    );
  }


  return (
    <div>
      <Navbar />

      <main className="bg-gray-100 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Resumen de partidas</h1>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Gráfico de Tarta - Pasa los datos desde dashboardData */}
            <div className="bg-white shadow rounded-lg p-6">
              <PieChart
                victorias={dashboardData.wins}
                derrotas={dashboardData.losses}
                empates={dashboardData.ties}
              />
            </div>

            {/* Gráfico de Barras - Pasa mapaData desde dashboardData */}
            <div className="bg-white shadow rounded-lg p-6">
              <BarChart mapaData={dashboardData.resultsPerMap} /> {/* Pasa resultsPerMap */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Función asíncrona para validar el token con el backend
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