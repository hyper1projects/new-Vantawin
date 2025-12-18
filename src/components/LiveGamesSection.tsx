"use client";

import React from "react";
import Oddscard from "./Oddscard";
import CollapsibleSection from "./CollapsibleSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMatchesContext } from "../context/MatchesContext"; // Import useMatchesContext

const LiveGamesSection: React.FC = () => {
  const navigate = useNavigate();
  const { games, loading } = useMatchesContext(); // Get games and loading state from context

  // Filter games to show only live games
  const liveGames = games.filter(game => game.isLive);

  const handleShowMoreClick = () => {
    navigate("/games/live-games");
  };

  const liveGamesCount = liveGames.length;

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      <CollapsibleSection title="Live Predictions" count={liveGamesCount} defaultOpen={true}>
        <div className="w-full flex flex-col space-y-4 px-4 pt-4">

          {loading && <p className="text-center text-vanta-text-light">Loading...</p>}

          {!loading && liveGames.length === 0 && (
            <p className="text-center text-vanta-text-light">No live games available.</p>
          )}

          {liveGames.map((game) => (
            <Oddscard key={game.id} game={game} />
          ))}
        </div>

        <div className="w-full flex justify-end px-4 pt-4">
          <Button
            className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
            onClick={handleShowMoreClick}
          >
            Show More
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default LiveGamesSection;