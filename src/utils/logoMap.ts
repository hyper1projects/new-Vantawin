// src/utils/logoMap.ts

// Import your logo images here
import teamALogo from '../assets/logos/teamA.png';
import teamBLogo from '../assets/logos/teamB.png';
import chelseaLogo from '../assets/logos/chelsea.png'; // Assuming you have this image
import liverpoolLogo from '../assets/logos/liverpool.png'; // Assuming you have this image

const logoMap: { [key: string]: string } = {
  teamA: teamALogo,
  teamB: teamBLogo,
  chelsea: chelseaLogo,
  liverpool: liverpoolLogo,
  // Add more team logos here as needed
};

export const getLogoSrc = (logoIdentifier: string): string => {
  return logoMap[logoIdentifier] || ''; // Return empty string or a default logo if not found
};