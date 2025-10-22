// src/assets/logos/index.ts

// 1. Import the specific image files using relative paths from this file.
//    NOTE: Adjust './' path if the logo files are in a different subfolder.
import manUnited from './England - Premier League/Manchester United.png';
import leicesterCity from './England - Premier League/Leicester City.png'; // Assuming this is the correct path for Leicester
import crystalPalace from './England - Premier League/Crystal Palace.png';
import westHamUnited from './England - Premier League/West Ham United.png';
import astonVilla from './England - Premier League/Aston Villa.png';

// 2. Export them in a central map using short, standardized keys.
export const TeamLogos = {
    // Keys match the abbreviations used in the UI (CRY, WHU, ASV, etc.)
    'MANU': manUnited,
    'LEIC': leicesterCity,
    'CRY': crystalPalace,
    'WHU': westHamUnited,
    'ASTON': astonVilla,
};