// src/assets/logos/index.ts

// 1. Import the specific image files using relative paths from this file.
//    NOTE: Adjust './' path if the logo files are in a different subfolder.
import manUnited from '../images/man_united_logo.png';
import leicesterCity from '../images/leicester_city_logo.png';
// You'll need to add logos for other teams in the image like Crystal Palace (CRY) and West Ham (WHU).

// 2. Export them in a central map using short, standardized keys.
export const TeamLogos = {
    // Keys match the abbreviations used in the UI (CRY, WHU, ASV, etc.)
    'MANU': manUnited,
    'LEIC': leicesterCity,
    'CRY': manUnited, // Using MU logo as placeholder for now, since you haven't supplied the CP logo
    'WHU': leicesterCity, // Using LC logo as placeholder for now, since you haven't supplied the WHU logo
    'ASTON': manUnited, // Using MU logo as placeholder for now, since you haven't supplied the Aston Martin logo
};

// Ensure the 'man_united_logo.png' file exists in 'src/assets/images/'