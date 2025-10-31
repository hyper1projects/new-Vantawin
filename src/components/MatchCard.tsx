const MatchCard: React.FC<MatchCardProps> = ({ game }) => {
  return (
    // Outer Link: Has the gradient background and the "border" padding
    <Link 
      to={`/games/${game.id}`} 
      className="relative p-[3px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[280px] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      {/* Inner Div: Has the solid background that "masks" the gradient into a border */}
      {/* The key change: rounded-[25px] is slightly smaller than rounded-[27px] 
        on the parent Link to ensure the gradient shows on the corners.
      */}
      <div className="bg-[#011B47] rounded-[25px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row */}
        <p className="text-base font-semibold text-center mt-2">{game.date} - {game.time}</p> 
        
        {/* Team Logos and Names Row */}
        <div className="flex items-center justify-between w-full px-2"> 
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team1.logoIdentifier)} alt={game.team1.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team1.name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span>
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team2.logoIdentifier)} alt={game.team2.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team2.name}</span>
          </div>
        </div>
        
      </div>
    </Link>
  );
};