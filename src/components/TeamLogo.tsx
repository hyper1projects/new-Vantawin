import React, { useState, useEffect } from 'react';

interface TeamLogoProps {
    teamName: string;
    league?: string;
    className?: string;
    alt?: string;
}

const LEAGUE_FOLDER_MAP: { [key: string]: string } = {
    'Premier League': 'England - Premier League',
    'La Liga': 'Spain - LaLiga',
    'Champions League': 'Champions League',
};

const LA_LIGA_MAPPING: { [key: string]: string } = {
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

const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, league, className, alt }) => {
    // Unconditional log to verify mount
    console.log(`[TeamLogo] Mounting for team: "${teamName}"`);

    const [imgSrc, setImgSrc] = useState<string>('');
    const [attemps, setAttempts] = useState(0);

    const folder = league && LEAGUE_FOLDER_MAP[league] ? LEAGUE_FOLDER_MAP[league] : (league || 'Other');

    // Define the variations
    // 1. Mapped name (if exists)
    // 2. Mapped name unaccented (if exists - handles "regular e" cases)
    // 3. Direct: "Arsenal.png"
    // 4. Suffix FC: "Arsenal FC.png"
    // 5. Remove Suffix FC: "Arsenal" from "Arsenal FC"
    // 6. Remove Suffix AFC: "Sunderland" from "Sunderland AFC"
    // 7. Prefix AFC: "AFC Bournemouth" from "Bournemouth"
    // 8. Ampersand: "Brighton & Hove Albion" from "Brighton and Hove Albion"
    // 9. Kebab: "arsenal.football-logos.cc.png"

    const kebabName = teamName.toLowerCase().replace(/\s+/g, '-');
    const withAmpersand = teamName.replace(/\band\b/gi, '&');
    // Handle "Brighton & Hove Albion" -> "Brighton.HoveAlbion" (derived from withAmpersand)
    const dotName = withAmpersand.replace(/&/g, '.').replace(/\s/g, '');

    let mappedName = '';
    if (folder === 'Spain - LaLiga' && LA_LIGA_MAPPING[teamName]) {
        mappedName = LA_LIGA_MAPPING[teamName];
    }

    // Helper to strip accents (e.g. Atlético -> Atletico)
    const normalizeName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const variants = [
        ...(mappedName ? [
            `/teams/${folder}/${mappedName}.png`,
            `/teams/${folder}/${normalizeName(mappedName)}.png`
        ] : []),
        `/teams/${folder}/${teamName}.png`,
        `/teams/${folder}/${normalizeName(teamName)}.png`,
        `/teams/${folder}/${teamName} FC.png`,
        `/teams/${folder}/${teamName.replace(/ FC$/i, '')}.png`,
        `/teams/${folder}/${teamName.replace(/ AFC$/i, '')}.png`,
        `/teams/${folder}/AFC ${teamName}.png`,
        `/teams/${folder}/${withAmpersand}.png`,
        `/teams/${folder}/${dotName}.png`,
        `/teams/${folder}/${kebabName}.football-logos.cc.png`
    ];

    useEffect(() => {
        // Debug logging
        if (['Brighton', 'Bournemouth', 'Atletico', 'Alaves', 'Betis', 'Oviedo'].some(s => teamName.includes(s))) {
            console.log(`[TeamLogo] Debug for "${teamName}"`);
            console.log(`[TeamLogo] League: "${league}" -> Folder: "${folder}"`);
            console.log(`[TeamLogo] Mapped Name: "${mappedName}"`);
            console.log(`[TeamLogo] Variants:`, variants);
        }
        setAttempts(0);
        setImgSrc(variants[0]);
    }, [teamName, league]);

    const handleError = () => {
        const nextAttempt = attemps + 1;
        if (nextAttempt < variants.length) {
            setAttempts(nextAttempt);
            setImgSrc(variants[nextAttempt]);
        } else {
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