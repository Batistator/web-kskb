'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext

// Lista de canciones (referenciadas estáticamente)
const musicTracks = [
  {
    id: 1,
    title: "Hiru Aventuras",
    artist: "Nene & Disney",
    file: "/music/hiruaventuras.mp3",
    coverImage: "/music/covers/hiruaventuras.png"
  },
  {
    id: 2,
    title: "Hiru Aventuras - Temporada 2",
    artist: "Nene & Disney",
    file: "/music/hiruaventuras2.mp3",
    coverImage: "/music/covers/hiruaventuras2.png"
  },
  {
    id: 3,
    title: "Accenture y Chollazos",
    artist: "Nene & Parchís",
    file: "/music/accentureychollazos.mp3",
    coverImage: "/music/covers/accentureychollazos.png"
  },
  {
    id: 4,
    title: "SwagChan y los Masters del Indraverso",
    artist: "Nene & Mattel",
    file: "/music/swagchanindraverso.mp3",
    coverImage: "/music/covers/swagchanindraverso.png"
  },
  {
    id: 5,
    title: "Kazama o Raydark - Supercampeadores",
    artist: "Nene & Morant",
    file: "/music/supercampeadores.mp3",
    coverImage: "/music/covers/supercampeadores.png"
  },
  {
    id: 6,
    title: "ShinChan - Tiritos Party",
    artist: "Nene & Usui",
    file: "/music/tiritosparty.mp3",
    coverImage: "/music/covers/tiritosparty.png"
  },
  {
    id: 7,
    title: "KSKB - Inferno",
    artist: "Nene & Sesto",
    file: "/music/inferno.mp3",
    coverImage: "/music/covers/inferno.png"
  },
  {
    id: 8,
    title: "Nene - (Pendiente pa siempre)",
    artist: "Nadie...",
    file: null,
    coverImage: "/music/covers/nene.png"
  },
];

// Definición de tipo para nuestras pistas de música
interface Track {
  id: number;
  title: string;
  artist: string;
  file: string | null;
  coverImage: string;
}

// Componente para cada reproductor individual
const AudioPlayer = ({ track }: { track: Track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const { isDarkMode } = useTheme(); // Leer el estado global del tema
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Este efecto se encarga de configurar el audio cuando el componente se monta
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !track.file) return;

    // Función para manejar cuando los metadatos están cargados
    const handleMetadata = () => {
      setDuration(audioElement.duration);
      setAudioReady(true);
    };

    // Comprobar si la duración ya está disponible
    if (audioElement.readyState >= 1) {
      handleMetadata();
    } else {
      audioElement.addEventListener('loadedmetadata', handleMetadata);
    }

    // Función para actualizar el tiempo actual
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', () => setIsPlaying(false));

    // Limpieza para evitar memory leaks
    return () => {
      audioElement.removeEventListener('loadedmetadata', handleMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [track.file]);

  // Gestionar reproducción/pausa
  const togglePlayPause = () => {
    if (!audioRef.current || !track.file) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };
  
  // Gestionar cambios en la barra de progreso
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Formatea segundos a formato mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determinar si debemos mostrar el player o un mensaje de "no disponible"
  const isTrackAvailable = !!track.file;
  
  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} rounded-lg shadow-md p-4 mb-6`}>
      <div className="flex items-center">
        <div className="w-16 h-16 mr-4">
          <img 
            src={track.coverImage || "/music/covers/default.jpg"} 
            alt={`${track.title} cover`}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{track.title}</h3>
          <p className="text-gray-600">{track.artist}</p>
        </div>
      </div>
      
      {isTrackAvailable ? (
        <div className="mt-4">
          <audio 
            ref={audioRef}
            src={track.file || undefined}
            preload="metadata"
          />
          
          <div className="flex items-center mb-2">
            <button 
              onClick={togglePlayPause}
              disabled={!audioReady} 
              className={`${audioReady ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400"} text-white rounded-full p-2 mr-4`}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <div className="flex-grow flex items-center">
              <span className="text-sm w-12">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={currentTime} 
                onChange={handleSeek}
                className="flex-grow mx-2"
                disabled={!audioReady}
              />
              <span className="text-sm w-12">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-gray-500 italic">
          Pista no disponible
        </div>
      )}
    </div>
  );
};

export default function MusicPage() {
  const { isDarkMode } = useTheme(); // Leer el estado global del tema
  return (
    <div>
      <Navbar />
      <main className={`py-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Música del Squad</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {musicTracks.map(track => (
              <AudioPlayer key={track.id} track={track} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}