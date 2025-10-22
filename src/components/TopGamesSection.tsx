"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Placeholder images for sports icons
// NOTE: These paths must be correct in your project for the images to load.
import FootballIcon from '/public/images/icons/football.svg';
import BasketballIcon from '/public/images/icons/basketball.svg';
import TennisIcon from '/public/images/icons/tennis.svg';
import AmericanFootballIcon from '/public/images/icons/american-football.svg';

// Team logos
import ManUnitedLogo from '@/assets/images/man_united_logo.png';
import LeicesterCityLogo from '@/assets/images/leicester_city_logo.png';
import StarIcon from '@/assets/images/icons/star_icon.svg'; // Assuming a star icon for 'Favorite'

// --- Game Row Card Component (Placeholder to match Top Games image) ---
// This component simulates the row layout seen in Group 1000005759.jpg
const GameRowCard = ({ status, team1Logo, team1Name, team2Logo, team2Name, option1, option2, option3 }) => {
    const isLive = status === 'Live';
    return (
        <div className="flex items-center justify-between p-4 bg-transparent border-b border-vanta-blue-medium last:border-b-0">
            <div className="flex flex-col gap-1 w-2/3">
                <div className="flex items-center text-sm font-semibold text-white">
                    {isLive ? (
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
                    ) : (
                        <span className="text-gray-400 mr-2 text-xs w-20 flex-shrink-0">{status}</span>
                    )}
                    <span className="text-gray-400 text-xs mr-2">{!isLive && status.length > 10 ? status.substring(0, 10) + '...' : status}</span>
                </div>
                
                {/* Team 1 */}
                <div className="flex items-center gap-2 text-sm text-white font-medium">
                    <img src={team1Logo} alt={team1Name} className="w-4 h-4 object-contain" />
                    <span>{team1Name}</span>
                </div>
                {/* Team 2 */}
                <div className="flex items-center gap-2 text-sm text-white font-medium">
                    <img src={team2Logo} alt={team2Name} className="w-4 h-4 object-contain" />
                    <span>{team2Name}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm w-1/3 justify-end">
                <span className="text-xs text-gray-400">Game View</span>
                <img src={StarIcon} alt="Favorite" className="w-4 h-4 opacity-70 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-400"> > </span>
            </div>

            {/* Prediction Buttons (Simplified for row layout) */}
            <div className="flex space-x-2">
                <Button className="bg-vanta-blue-medium/50 text-white font-semibold py-2 px-3 text-xs hover:bg-vanta-blue-medium">{option1}</Button>
                <Button className="bg-vanta-blue-medium/50 text-white font-semibold py-2 px-3 text-xs hover:bg-vanta-blue-medium">{option2}</Button>
                <Button className="bg-vanta-blue-medium/50 text-white font-semibold py-2 px-3 text-xs hover:bg-vanta-blue-medium">{option3}</Button>
            </div>
        </div>
    );
};
// --- End Game Row Card Component ---


const TopGamesSection = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSport, setActiveSport] = useState('Football'); // Default active sport

    const filters = ['All', 'Live', 'Up Next'];
    const sports = [
        { name: 'Football', icon: FootballIcon },
        { name: 'Basketball', icon: BasketballIcon },
        { name: 'Tennis', icon: TennisIcon },
        { name: 'A.Football', icon: AmericanFootballIcon },
    ];

    // Dummy game data (using team names from the image)
    const games = [
        {
            status: 'Live',
            team1Logo: ManUnitedLogo,
            team1Name: 'Crystal Palace',
            team2Logo: LeicesterCityLogo,
            team2Name: 'West Ham United',
            option1: 'CRY',
            option2: 'DRAW',
            option3: 'WHU',
        },
        {
            status: 'Live',
            team1Logo: ManUnitedLogo,
            team1Name: 'Crystal Palace',
            team2Logo: LeicesterCityLogo,
            team2Name: 'West Ham United',
            option1: 'CRY',
            option2: 'DRAW',
            option3: 'WHU',
        },
        {
            status: '9:00 AM AUG 8',
            team1Logo: ManUnitedLogo,
            team1Name: 'Crystal Palace',
            team2Logo: LeicesterCityLogo,
            team2Name: 'West Ham United',
            option1: 'CRY',
            option2: 'DRAW',
            option3: 'WHU',
        },
    ];

    return (
        // Removed rounded-[27px] as it's not in the image for the Top Games section
        <div className="w-full py-8 px-4 bg-[#011B47] mt-8"> 
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left tracking-tight pl-4">Top Games</h2>

            {/* Filter Buttons and Sport Icons */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-4">
                {/* Filter Buttons */}
                <div className="flex space-x-2 mb-4 sm:mb-0">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-6 py-2 text-base font-semibold transition-colors duration-200
                                // Styling to match image: Active is solid turquoise, Inactive is dark/transparent
                                ${activeFilter === filter 
                                    ? 'bg-vanta-neon-blue text-vanta-blue-dark' // Active style
                                    : 'bg-transparent text-vanta-text-light border border-vanta-blue-medium hover:bg-vanta-blue-medium/30' // Inactive style
                                }
                            `}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
                
                {/* Sport Icons */}
                <div className="flex space-x-4">
                    {sports.map((sport) => (
                        <div
                            key={sport.name}
                            onClick={() => setActiveSport(sport.name)}
                            className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 p-1
                                // Styling to match image: Active has distinct highlight/border
                                ${activeSport === sport.name 
                                    ? 'bg-vanta-neon-blue border-2 border-vanta-neon-blue shadow-lg shadow-vanta-neon-blue/50' // Active style
                                    : 'bg-vanta-blue-medium hover:bg-vanta-accent-dark-blue border-2 border-vanta-blue-medium' // Inactive style
                                }
                            `}
                        >
                            <img 
                                src={sport.icon} 
                                alt={sport.name} 
                                className="w-full h-full object-contain rounded-full 
                                // Invert inactive icon color to match dark background
                                ${activeSport !== sport.name ? 'filter invert' : ''}
                                " 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-vanta-blue-medium my-6"></div> {/* Separator line */}

            {/* Game Cards (Using the new GameRowCard component) */}
            <div className="flex flex-col gap-0 px-4"> {/* Removed gap-6, as the rows are nearly flush */}
                {games.map((game, index) => (
                    <GameRowCard
                        key={index}
                        status={game.status}
                        team1Logo={game.team1Logo}
                        team1Name={game.team1Name}
                        team2Logo={game.team2Logo}
                        team2Name={game.team2Name}
                        option1={game.option1}
                        option2={game.option2}
                        option3={game.option3}
                    />
                ))}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-8">
                <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90 px-8 py-3 rounded-[14px] text-base font-semibold">
                    Show More
                </Button>
            </div>
        </div>
    );
};

export default TopGamesSection;