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

    // Debugging logo lookup
    if (!teamLogoMap[teamName]) {
        console.warn(`[TeamLogo] Missing map entry for: "${teamName}". Using placeholder.`);
    } else {
        // console.log(`[TeamLogo] Found: "${teamName}" -> "${logoSrc}"`);
    }

    return (
        <img
            src={logoSrc}
            alt={alt || teamName}
            className={className}
            // As a final fallback, if the mapped image file is somehow missing,
            // this will prevent a broken image icon from showing.
            onError={(e) => {
                console.error(`[TeamLogo] Failed to load image: ${logoSrc}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
        />
    );
};

export default TeamLogo;