import { TeamLogos } from '../assets/logos'; // Import from the centralized index

export const logoMap: { [key: string]: string } = TeamLogos; // Directly use TeamLogos

export const getLogoSrc = (logoIdentifier: string): string => {
  // Returns the mapped logo path or a generic placeholder if not found
  return logoMap[logoIdentifier] || 'https://via.placeholder.com/24';
};