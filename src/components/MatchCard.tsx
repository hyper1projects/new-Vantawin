import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming this Button component is styled similarly to the image

interface MatchCardProps {
  date: string;
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  option1: string;
  option2: string;
  option3: string;
  // Optional: Add a prop for active selection if you want to highlight a button
  // activeOption?: string | null;
  // onOptionSelect?: (option: string) => void;
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
  // activeOption, // uncomment if using active selection
  // onOptionSelect, // uncomment if using active selection
}) => {
  return (
    // FIX APPLIED HERE:
    // Changed bg-gradient-to-br from-vanta-neon-blue to-vanta-purple
    // TO: bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE]
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[230px] flex-shrink-0">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white"> {/* Changed p-3 to p-4, added justify-between */}
        <p className="text-base font-semibold text-center mt-2">{date}</p> {/* Added mt-2 for top spacing */}
        <div className="flex items-center justify-between w-full px-2"> {/* Added px-2 for horizontal spacing */}
          <div className="flex flex-col items-center w-1/3"> {/* Added w-1/3 */}
            <img src={team1Logo} alt={team1Name} className="w-10 h-10 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team1Name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span> {/* Added VS text */}
          <div className="flex flex-col items-center w-1/3"> {/* Added w-1/3 */}
            <img src={team2Logo} alt={team2Name} className="w-10 h-10 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team2Name}</span>
          </div>
        </div>
        <div className="flex justify-center space-x-2 w-full mb-2"> {/* Added mb-2 for bottom spacing */}
          <Button
            // onClick={() => onOptionSelect?.(option1)} // uncomment if using active selection
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold ${
              // activeOption === option1 ? 'bg-[#015071] text-white' : 'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'
              'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]' // Default styling to match image for now
            }`}
          >
            {option1}
          </Button>
          <Button
            // onClick={() => onOptionSelect?.(option2)} // uncomment if using active selection
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold ${
              // activeOption === option2 ? 'bg-[#015071] text-white' : 'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'
              'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]' // Default styling to match image for now
            }`}
          >
            {option2}
          </Button>
          <Button
            // onClick={() => onOptionSelect?.(option3)} // uncomment if using active selection
            className={`flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold ${
              // activeOption === option3 ? 'bg-[#015071] text-white' : 'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]'
              'bg-[#01112D] text-gray-300 hover:bg-[#012A5E]' // Default styling to match image for now
            }`}
          >
            {option3}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;