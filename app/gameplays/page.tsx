'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';

// Tipo para los videos de YouTube
interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  comments: string[];
}

// Componente Modal para videos
interface VideoModalProps {
  videoId: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoId, onClose }) => {
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={handleClickOutside}>
      <div className="bg-white rounded-lg shadow-lg relative w-full max-w-4xl">
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center z-10"
        >
          &times;
        </button>
        <div className="relative pb-[56.25%] h-0 rounded-t-lg overflow-hidden">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default function GameplaysPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // ID de la lista de reproducción (reemplaza con tu lista real)
  const playlistId = 'PLjrNMjANEPkMmLfwIn3c7YEjisD0NuKvs'; // Lista de reproducción KSKB
  // Clave API (deberías moverla a variables de entorno en producción)
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;//'YOUR_YOUTUBE_API_KEY';

  useEffect(() => {
    const fetchComments = async (videoId: string): Promise<string[]> => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=5`
        );
    
        if (!response.ok) {
          throw new Error('Error al obtener comentarios');
        }
    
        const data = await response.json();
        return data.items.map((item: any) => item.snippet.topLevelComment.snippet.textDisplay);
      } catch (error) {
        console.error(`Error al obtener comentarios para el video ${videoId}:`, error);
        return [];
      }
    };
    
    const fetchYouTubeVideos = async () => {
      setLoading(true);
      try {
        let allVideos: YouTubeVideo[] = [];
        let nextPageToken = '';
        let hasMorePages = true;
    
        while (hasMorePages) {
          const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${pageParam}`
          );
    
          if (!response.ok) {
            throw new Error('Error al obtener videos de YouTube');
          }
    
          const data = await response.json();
    
          const videosData: YouTubeVideo[] = await Promise.all(
            data.items.map(async (item: any) => {
              const comments = await fetchComments(item.snippet.resourceId.videoId);
              return {
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
                thumbnail: item.snippet.thumbnails.medium.url || '/placeholder-image.jpg',
                description: item.snippet.description,
                comments, // Añadir los comentarios al video
              };
            })
          );
    
          allVideos = [...allVideos, ...videosData];
          nextPageToken = data.nextPageToken;
          hasMorePages = !!nextPageToken;
        }
    
        setVideos(allVideos);
        setFilteredVideos(allVideos);
      } catch (err) {
        console.error('Error al cargar videos:', err);
        setError('No se pudieron cargar los videos. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchYouTubeVideos();
  }, []);

  // Filtrar videos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Gameplays</h1>
        
        {/* Buscador */}
        <div className="mb-6">
            <div className="max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
              </div>
              <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Filtrar videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Modal del video cuando hay uno seleccionado */}
        {selectedVideo && (
          <VideoModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}

        {/* Lista de videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative h-48">
                <Image 
                  src={video.thumbnail} 
                  alt={video.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm3.536 10.535l-5 3A1 1 0 017 12.5v-6a1 1 0 011.536-.835l5 3a1 1 0 010 1.67z"/>
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.description}</p>
                {video.comments.length > 0 && ( // Renderizar solo si hay comentarios
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm text-gray-700">Comentarios:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {video.comments.map((comment, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: comment }}></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron videos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}