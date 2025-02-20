'use client'; // Marca el componente como Client Component para usar hooks

import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider, Link } from '@heroui/react';
import {Image} from "@heroui/image";
import {Avatar} from "@heroui/react";

interface CountersSectionProps {
  totalVictorias: number;
  totalDerrotas: number;
  totalEmpates: number;
  mapaFavorable: string;
  mapaDesfavorable: string;
  mapaFavorito: string;
  diasVictoriosos: number;
  diasEmpate: number;
  diasDerrotas: number;
  maximaRachaVictorias: number;
  maximaRachaDerrotas: number;
  rachaActualVictorias: number;
  partidasNoShinchanPrimero: number;
  porcentajeNoShinchan: number;
}

const CountersSection: React.FC<CountersSectionProps> = ({
  totalVictorias,
  totalDerrotas,
  totalEmpates,
  mapaFavorable,
  mapaDesfavorable,
  mapaFavorito,
  diasVictoriosos,
  diasEmpate,
  diasDerrotas,
  maximaRachaVictorias,
  maximaRachaDerrotas,
  rachaActualVictorias,
  partidasNoShinchanPrimero,
  porcentajeNoShinchan,
}) => {
  const formatMapName = (mapName: string) => {
    if (!mapName) return '';
    const modifiedName = mapName.slice(3); // Elimina los 3 primeros caracteres
    return modifiedName.charAt(0).toUpperCase() + modifiedName.slice(1); // Pone el primer carácter en mayúscula
  };

  const counterCardGroups: CounterCardGroupProps[] = [
    {
      icon: "./icons/flag-checkered-solid.svg",
      title: "Resumen de Partidas",
      subtitle:"Total: " + (totalVictorias + totalDerrotas + totalEmpates),
      value: [
        { title: "Victorias", value: totalVictorias, color: "text-green-500", icon:"" },
        { title: "Derrotas", value: totalDerrotas, color: "text-red-500", icon:"" },
        { title: "Empates", value: totalEmpates, color: "text-yellow-500", icon:"" },
      ],
    },
    {
      icon: "./icons/map-solid.svg",
      title: "Mapas",
      subtitle:"",
      value: [
        { title: "Mapa Favorable", value: formatMapName(mapaFavorable), color: "text-green-500", icon:"./map/"+mapaFavorable+".png" },
        { title: "Mapa Desfavorable", value: formatMapName(mapaDesfavorable), color: "text-red-500", icon:"./map/"+mapaDesfavorable+".png" },
        { title: "Mapa Favorito", value: formatMapName(mapaFavorito), color: "text-black", icon:"./map/"+mapaFavorito+".png" },
      ],
    },
    {
      icon: "./icons/calendar-days-solid.svg",
      title: "Días",
      subtitle:"",
      value: [
        { title: "Días Victoriosos", value: diasVictoriosos, color: "text-green-500", icon:"" },
        { title: "Días de Empate", value: diasEmpate, color: "text-yellow-500", icon:"" },
        { title: "Días de Derrotas", value: diasDerrotas, color: "text-red-500", icon:"" },
      ],
    },
    {
      icon: "./icons/medal-solid.svg",
      title: "Rachas",
      subtitle:"",
      value: [
        { title: "Máxima Racha Victorias", value: maximaRachaVictorias, color: "text-green-500", icon:"" },
        { title: "Máxima Racha Derrotas", value: maximaRachaDerrotas, color: "text-red-500", icon:"" },
        { title: "Racha Actual Victorias", value: rachaActualVictorias, color: "text-black", icon:"" },
      ],
    },
    {
      icon: "./icons/percent-solid.svg",
      title: "Otros",
      subtitle:"",
      value: [
        { title: "Partidas no Shinchan Primero", value: partidasNoShinchanPrimero, color: "text-black", icon:"" },
        { title: "Porcentaje No Shinchan", value: `${porcentajeNoShinchan}%`, color: "black", icon:"" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {counterCardGroups.map((group, index) => (
        <CounterCardGroup icon={group.icon} key={index} title={group.title} subtitle={group.subtitle} value={group.value} />
      ))}
    </div>
  );
};

interface CounterCardProps {
  icon: string;
  title: string;
  value: string | number;
  color: string;
}

interface CounterCardGroupProps {
  icon: string;
  title: string;
  subtitle: string;
  value: CounterCardProps[];
}

const CounterCard: React.FC<CounterCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <dt className="text-sm font-bold text-gray-500 truncate">{title}</dt>
      <div className="flex items-center">
        {icon && <Avatar size="md" src={icon} className="mr-2 " />}
        <dd className={`mt-1 text-3xl font-semibold ${color}`}>{value}</dd>
      </div>
    </div>
  );
};

const CounterCardGroup: React.FC<CounterCardGroupProps> = ({ icon, title, subtitle, value }) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src={icon}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md font-bold">{title}</p>
          <p className="text-small text-default-500">{subtitle}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {value.map((item, index) => (
          <CounterCard key={index} icon={item.icon} title={item.title} value={item.value} color ={item.color} />
        ))}
      </CardBody>
    </Card>
  );
};




export default CountersSection;