'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext


interface ImageData {
  src: string;
  alt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const { isDarkMode } = useTheme(); // Leer el estado global del tema

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/frontApi/nemes');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const openModal = (image: ImageData) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Navbar />
      <main className={`py-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Colección Nemes mañaneros</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="cursor-pointer" onClick={() => openModal(image)}>
                <div className="relative h-64">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    layout="fill" 
                    objectFit="cover" 
                  />
                </div>
              </div>
            ))}
          </div>
          {selectedImage && (
            <Modal onClose={closeModal}>
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="max-h-[80vh] max-w-full" 
              />
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}