"use client";

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Index = () => {
  return (
    <div className="relative w-full h-full"> {/* Make this div relative */}
      <Link to="/leaderboard" className="absolute top-0 right-0"> {/* Position leaderboard image absolutely */}
        <img
          src="/images/Group 1000005755.png"
          alt="Leaderboard"
          className="w-[400px] h-[300px] object-contain" {/* Set fixed width and height */}
        />
      </Link>
      <div className="pt-28 flex flex-col items-center justify-center gap-4"> {/* Add padding-top to push other content down, adjust as needed */}
        <img
          src="/images/Group 1000005756.png"
          alt="Prediction Card"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Index;