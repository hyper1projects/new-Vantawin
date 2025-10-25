import { teamALogoPath, teamBLogoPath } from '../components/assets/logos'; // Import from the centralized index

// This map should be updated with your actual logo files.
// For example, if you have 'src/components/assets/logos/myTeam.png',
// you would add: import myTeamLogoPath from '../components/assets/logos/myTeam.png';
// and then: 'myTeam': myTeamLogoPath,
export const logoMap: { [key: string]: string } = {
  'teamA': teamALogoPath,
  'teamB': teamBLogoPath,
  // Add more mappings here for your actual team logos
};

export const getLogoSrc = (logoIdentifier: string): string => {
  // Returns the mapped logo path or a generic placeholder if not found
  return logoMap[logoIdentifier] || 'https://via.placeholder.com/24';
};[logoIdentifier] || 'https://via.placeholder.com/24';
};