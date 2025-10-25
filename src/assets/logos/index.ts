// src/assets/logos/index.ts

// Import the specific image files using relative paths from this file.
import manUnited from './England - Premier League/Manchester United.png';
import leicesterCity from './England - Premier League/Leicester City.png';
import crystalPalace from './England - Premier League/Crystal Palace.png';
import westHamUnited from './England - Premier League/West Ham United.png';
import astonVilla from './England - Premier League/Aston Villa.png';
import arsenal from './England - Premier League/Arsenal FC.png';
import chelsea from './England - Premier League/Chelsea FC.png';
import liverpool from './England - Premier League/Liverpool FC.png';
import everton from './England - Premier League/Everton FC.png';
import realMadrid from './Spain - LaLiga/Real Madrid.png';
import barcelona from './Spain - LaLiga/FC Barcelona.png';
import bayernMunich from './Germany - Bundesliga/Bayern Munich.png';
import borussiaDortmund from './Germany - Bundesliga/Borussia Dortmund.png';
import atleticoMadrid from './Spain - LaLiga/Atlético de Madrid.png'; // New La Liga logo
import sevilla from './Spain - LaLiga/Sevilla FC.png'; // New La Liga logo


// Export them in a central map using short, standardized keys.
export const TeamLogos: { [key: string]: string } = {
    'MANU': manUnited,
    'LEIC': leicesterCity,
    'CRY': crystalPalace,
    'WHU': westHamUnited,
    'ASTON': astonVilla,
    'ARS': arsenal,
    'CHE': chelsea,
    'LIV': liverpool,
    'EVE': everton,
    'RMA': realMadrid,
    'BAR': barcelona,
    'BAY': bayernMunich,
    'DOR': borussiaDortmund,
    'ATM': atleticoMadrid, // New La Liga logo
    'SEV': sevilla, // New La Liga logo
};