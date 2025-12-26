import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchesContext } from '../context/MatchesContext';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { Game } from '../types/game';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import TeamLogo from './TeamLogo';

const GameSearch: React.FC = () => {
    const { games, loading } = useMatchesContext();
    const { setSelectedMatch } = useMatchSelection();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();
        const filtered = games.filter(game => {
            const team1Name = game.team1.name.toLowerCase();
            const team2Name = game.team2.name.toLowerCase();
            const league = game.league.toLowerCase();

            return team1Name.includes(lowerTerm) ||
                team2Name.includes(lowerTerm) ||
                league.includes(lowerTerm);
        });

        setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    }, [searchTerm, games]);

    const handleSelectGame = (game: Game) => {
        setSelectedMatch(game);
        navigate(`/games/${game.id}`); // Navigate to specific game details page
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleFocus = () => {
        if (searchTerm.trim()) {
            setIsOpen(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-64 md:w-80">
            <div className="relative bg-[#053256] rounded-[14px] h-10 items-center flex border transition-colors border-transparent focus-within:border-vanta-neon-blue/50">
                <Search className="absolute left-3 text-[#00EEEE]" size={18} />
                <Input
                    type="text"
                    placeholder="Search games, teams..."
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full pl-10 pr-8 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0 focus-visible:ring-0 text-sm"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && searchTerm.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#053256] border border-vanta-neon-blue/20 rounded-xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                    ) : searchResults.length > 0 ? (
                        <div className="py-2">
                            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Available Games
                            </div>
                            {searchResults.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => handleSelectGame(game)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex -space-x-2 shrink-0">
                                        <TeamLogo teamName={game.team1.name} className="w-8 h-8 rounded-full bg-gray-800 p-1 ring-2 ring-[#053256] z-10" />
                                        <TeamLogo teamName={game.team2.name} className="w-8 h-8 rounded-full bg-gray-800 p-1 ring-2 ring-[#053256]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white truncate">
                                            {game.team1.name} vs {game.team2.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <Trophy size={10} />
                                                {game.league}
                                            </span>
                                            <span className="text-gray-600">•</span>
                                            {format(new Date(game.start_time), 'MMM d, HH:mm')}
                                        </div>
                                    </div>
                                    {game.isLive && (
                                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 animate-pulse">
                                            LIVE
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-400">
                            <p className="text-sm">No games found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameSearch;
