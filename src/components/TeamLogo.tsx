import React, { useState, useEffect } from 'react';

interface TeamLogoProps {
    teamName: string;
    league?: string; // Kept for potential future use, but not used in logic now
    className?: string;
    alt?: string;
}

// This mapping can still be useful for normalizing team names
const TEAM_NAME_MAPPING: { [key: string]: string } = {
    'Atletico Madrid': 'Atletico de Madrid',
    'Atlético Madrid': 'Atletico de Madrid',
    'Atlético de Madrid': 'Atletico de Madrid',
    'Real Betis': 'Real Betis Balompie',
    'Celta Vigo': 'Celta de Vigo',
    'Espanyol': 'RCD Espanyol Barcelona',
    'Mallorca': 'RCD Mallorca',
    'Osasuna': 'CA Osasuna',
    'Alaves': 'Deportivo Alaves',
    'Deportivo Alaves': 'Deportivo Alaves',
    'Deportivo Alavés': 'Deportivo Alaves',
    'Barcelona': 'FC Barcelona',
    'Girona': 'Girona FC',
    'Sevilla': 'Sevilla FC',
    'Valencia': 'Valencia CF',
    'Villarreal': 'Villarreal CF',
    'Getafe': 'Getafe CF',
    'Elche': 'Elche CF',
    'Levante': 'Levante UD',
    'Cadiz': 'Cádiz CF',
    'Valladolid': 'Real Valladolid CF',
    'Real Sociedad': 'Real Sociedad',
    'Athletic Club': 'Athletic Bilbao',
    'Athletic Bilbao': 'Athletic Bilbao',
    'Rayo Vallecano': 'Rayo Vallecano',
    'Oviedo': 'Real Oviedo',
    'Real Oviedo': 'Real Oviedo',
};

const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, className, alt }) => {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [attempts, setAttempts] = useState(0);

    // Helper to strip accents (e.g. Atlético -> Atletico)
    const normalizeName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const mappedName = TEAM_NAME_MAPPING[teamName] || '';
    const kebabName = teamName.toLowerCase().replace(/\s+/g, '-');
    const withAmpersand = teamName.replace(/\band\b/gi, '&');
    const dotName = withAmpersand.replace(/&/g, '.').replace(/\s/g, '');

    // All variants now point to the single /teams/ directory
    const variants = [
        ...(mappedName ? [
            `/teams/${mappedName}.png`,
            `/teams/${normalizeName(mappedName)}.png`
        ] : []),
        `/teams/${teamName}.png`,
        `/teams/${normalizeName(teamName)}.png`,
        `/teams/${teamName} FC.png`,
        `/teams/${teamName.replace(/ FC$/i, '')}.png`,
        `/teams/${teamName.replace(/ AFC$/i, '')}.png`,
        `/teams/AFC ${teamName}.png`,
        `/teams/${withAmpersand}.png`,
        `/teams/${dotName}.png`,
        `/teams/${kebabName}.football-logos.cc.png`
    ];

    useEffect(() => {
        setAttempts(0);
        // Start with the first variant
        setImgSrc(variants[0]);
    }, [teamName]);

    const handleError = () => {
        const nextAttempt = attempts + 1;
        if (nextAttempt < variants.length) {
            setAttempts(nextAttempt);
            setImgSrc(variants[nextAttempt]);
        } else {
            // If all variants fail, use a placeholder
            setImgSrc('/placeholder.svg');
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt || teamName}
            className={className}
            onError={handleError}
        />
    );
};

export default TeamLogo;