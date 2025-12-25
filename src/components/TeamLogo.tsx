import React from 'react';
import { teamLogoMap } from '@/data/team-logo-map';

interface TeamLogoProps {
    teamName: string;
    className?: string;
    alt?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, className, alt }) => {
    // Directly look up the team name in our new map.
    // If it's not found, default to the placeholder image.
    const logoSrc = teamLogoMap[teamName] || '/placeholder.svg';

    return (
        <img
            src={logoSrc}
            alt={alt || teamName}
            className={className}
            // As a final fallback, if the mapped image file is somehow missing,
            // this will prevent a broken image icon from showing.
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
    );
};

export default TeamLogo;