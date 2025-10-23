import React from 'react';
import { Button } from '@/components/ui/button'; 

interface MatchCardProps {
  date: string;
  time?: string;
  multiplier?: string; 
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  option1: string;
  option2: string;
  option3: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  date,
  team1Logo,
  team1Name,
  team2Logo,
  team2Name,
  option1,
  option2,
  option3,
}) => {
  return (
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[230px] flex-shrink-0">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row */}
        <p className="text-base font-semibold text-center mt-2">{date}</p> 
        
        {/* Team Logos and Names Row */}
        <div className="flex items-center justify-between w-full px-2"> 
          <div className="flex flex-col items-center w-1/3"> 
            <img src={team1Logo} alt={team1Name} className="w-12 h-12 object-contain mb-1" /> {/* Increased size to w-12 h-12 */}
            <span className="text-[10px] font-medium text-center">{team1Name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span>
          <div className="flex flex-col items-center w-1/3"> 
            <img src={team2Logo} alt={team2Name} className="w-12 h-12 object-contain mb-1" /> {/* Increased size to w-12 h-12 */}
            <span className="text-[10px] font-medium text-center">{team2Name}</span>
          </div>
        </div>
        
        {/* Prediction Buttons Row */}
        <div className="flex justify-center space-x-2 w-full mb-2">
          <Button
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold 
              ${'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'} 
            `}
          >
            {option1}
          </Button>
          <Button
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold 
              ${'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'} 
            `}
          >
            {option2}
          </Button>
          <Button
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold 
              ${'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'} 
            `}
          >
            {option3}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;