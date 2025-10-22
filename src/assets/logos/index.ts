// src/assets/logos/index.ts

// Import the specific image files using relative paths from this file.
import manUnited from './England - Premier League/Manchester United.png';
import leicesterCity from '../images/leicester_city_logo.png'; // Corrected path for Leicester City
import crystalPalace from './England - Premier League/Crystal Palace.png';
import westHamUnited from './England - Premier League/West Ham United.png';
import astonVilla from './England - Premier League/Aston Villa.png';

// Export them in a central map using short, standardized keys.
export const TeamLogos: { [key: string]: string } = {
    'MANU': manUnited,
    'LEIC': leicesterCity,
    'CRY': crystalPalace,
    'WHU': westHamUnited,
    'ASTON': astonVilla,
};