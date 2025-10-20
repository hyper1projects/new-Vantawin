"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Trophy, Star, Zap, Shield, Users, Settings } from 'lucide-react';

const RightSidebar = ({ selectedMultiplier = 2.5 }) => {
  return (
    <div className="w-full md:w-1/4 bg-gray-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Your Stats</h3>
        <Card className="bg-gray-800 border-none text-white mb-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <Trophy className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#123</div>
            <p className="text-xs text-gray-400">Top 1% globally</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-gray-700 my-6" />

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Daily Streak</h3>
        <div className="flex items-center mb-4">
          <Zap className="h-6 w-6 text-orange-400 mr-2" />
          <span className="text-2xl font-bold">7 Days</span>
        </div>
        <Progress value={70} className="w-full bg-gray-700 h-2" indicatorClassName="bg-orange-500" />
        <p className="text-sm text-gray-400 mt-2">Keep it up for bonus points!</p>
      </div>

      <Separator className="bg-gray-700 my-6" />

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Upcoming Challenges</h3>
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-sm">Win 3 matches (2/3)</p>
        </div>
        <Progress value={66} className="w-full bg-gray-700 h-1" indicatorClassName="bg-green-500" />
        <div className="flex items-center mt-4 mb-2">
          <Users className="h-5 w-5 text-purple-400 mr-2" />
          <p className="text-sm">Invite a friend (0/1)</p>
        </div>
        <Progress value={0} className="w-full bg-gray-700 h-1" indicatorClassName="bg-purple-500" />
      </div>

      <div className="mt-auto">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View All Challenges
        </Button>
        <Button variant="ghost" className="w-full mt-2 text-gray-400 hover:text-white">
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
      </div>
    </div>
  );
};

export default RightSidebar;