import React from 'react';
import { Button } from '@/components/ui/button'; 

interface MatchCardProps {
  date: string;
  // Note: time and multiplier props were used in the parent component 
  // but are missing here, so I've added them for completeness.
  time?: string;
  multiplier?: string; 
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  option1: string;
  option2: string;
  option3: string;
  // activeOption?: string | null; 
  // onOptionSelect?: (option: string) => void; 
}

const MatchCard: React.FC<MatchCardProps> = ({
  date,
  // time, // uncomment if used in the card's display
  // multiplier, // uncomment if used in the card's display
  team1Logo,
  team1Name,
  team2Logo,
  team2Name,
  option1,
  option2,
  option3,
  // activeOption, 
  // onOptionSelect, 
}) => {
  return (
    // Outer container optimized for horizontal scrolling with fixed size and flex-shrink-0
    // Includes the gradient border fix: bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE]
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[230px] flex-shrink-0">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row */}
        <p className="text-base font-semibold text-center mt-2">{date}</p> 
        
        {/* Team Logos and Names Row */}
        <div className="flex items-center justify-between w-full px-2"> 
          <div className="flex flex-col items-center w-1/3"> 
            <img src={team1Logo} alt={team1Name} className="w-10 h-10 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team1Name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span>
          <div className="flex flex-col items-center w-1/3"> 
            <img src={team2Logo} alt={team2Name} className="w-10 h-10 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team2Name}</span>
          </div>
        </div>
        
        {/* Prediction Buttons Row */}
        <div className="flex justify-center space-x-2 w-full mb-2">
          {/* Button 1 */}
          <Button
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold 
              ${'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'} 
            `}
          >
            {option1}
          </Button>
          {/* Button 2 */}
          <Button
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold 
              ${'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'} 
            `}
          >
            {option2}
          </Button>
          {/* Button 3 */}
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