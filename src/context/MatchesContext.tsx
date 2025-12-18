import { createContext, useContext, ReactNode } from 'react';
import { useMatches } from '../hooks/useMatches';
import { Game } from '../types/game';

interface MatchesContextType {
    games: Game[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
    const { games, loading, error, refetch } = useMatches();

    if (!loading) {
        console.log("MatchesContext: Loaded games count:", games.length);
        if (games.length > 0) {
            console.log("MatchesContext: First game league:", games[0].league);
            console.log("MatchesContext: Unique Leagues:", Array.from(new Set(games.map(g => g.league))));
        }
    }

    return (
        <MatchesContext.Provider value={{ games, loading, error, refetch }}>
            {children}
        </MatchesContext.Provider>
    );
};

export const useMatchesContext = () => {
    const context = useContext(MatchesContext);
    if (context === undefined) {
        throw new Error('useMatchesContext must be used within a MatchesProvider');
    }
    return context;
};
