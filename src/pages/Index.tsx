"use client";

import React from 'react';
import Oddscard from '../components/Oddscard';

const Index: React.FC = () => {
  // In a real application, you would import your actual logo files like this:
  // import team1Logo from '../components/assets/logo/team1_logo.png';
  // import team2Logo from '../components/assets/logo/team2_logo.png';
  // For demonstration, we'll use placeholder image URLs.
  const arsenalLogo = "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg";
  const manCityLogo = "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_logo.svg";
  const liverpoolLogo = "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg";
  const chelseaLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png";

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Matches & Live Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        <Oddscard
          team1={{ name: "Arsenal", logo: arsenalLogo }}
          team2={{ name: "Man City", logo: manCityLogo }}
          odds={{ team1: 2.50, draw: 3.40, team2: 2.80 }}
          time="19:30"
          date="27 Oct"
          league="Premier League"
          isLive={false}
        />
        <Oddscard
          team1={{ name: "Liverpool", logo: liverpoolLogo }}
          team2={{ name: "Chelsea", logo: chelseaLogo }}
          odds={{ team1: 1.90, draw: 3.60, team2: 4.00 }}
          time="20:00"
          date="27 Oct"
          league="Champions League"
          isLive={true} // This match is live
        />
        <Oddscard
          team1={{ name: "Man City", logo: manCityLogo }}
          team2={{ name: "Arsenal", logo: arsenalLogo }}
          odds={{ team1: 1.75, draw: 3.50, team2: 4.50 }}
          time="21:00"
          date="28 Oct"
          league="FA Cup"
          isLive={false}
        />
        <Oddscard
          team1={{ name: "Chelsea", logo: chelseaLogo }}
          team2={{ name: "Liverpool", logo: liverpoolLogo }}
          odds={{ team1: 3.00, draw: 3.20, team2: 2.20 }}
          time="22:00"
          date="28 Oct"
          league="Premier League"
          isLive={true} // This match is live
        />
      </div>
    </div>
  );
};

export default Index;