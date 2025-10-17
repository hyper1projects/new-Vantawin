"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/Button"; // Using the custom Button component
import { cn } from "@/lib/utils";

const PredictionSlipCard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("predict");
  const [selectedAmount, setSelectedAmount] = React.useState<number>(0);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  return (
    <div className="w-[300px] bg-vanta-blue-medium rounded-2xl p-6 font-outfit text-vanta-text-light">
      <Tabs defaultValue="predict" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="predict"
            className={cn(
              "text-base font-medium py-1 transition-all duration-300 ease-in-out", // Changed py-2 to py-1
              activeTab === "predict"
                ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue"
                : "text-vanta-text-light hover:text-vanta-neon-blue"
            )}
          >
            Predict
          </TabsTrigger>
          <TabsTrigger
            value="redeem"
            className={cn(
              "text-base font-medium py-1 transition-all duration-300 ease-in-out", // Changed py-2 to py-1
              activeTab === "redeem"
                ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue"
                : "text-vanta-text-light hover:text-vanta-neon-blue"
            )}
          >
            Redeem
          </TabsTrigger>
        </TabsList>
        <TabsContent value="predict">
          <div className="flex flex-col gap-4">
            {/* Match Info */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Aston Villa Vs Crystal Palace</h3>
              <div className="flex items-center gap-2">
                {/* Placeholder images for team logos. Replace with actual logos when available. */}
                <img src="/placeholder.svg" alt="Team 1 Logo" className="w-6 h-6 rounded-full" />
                <img src="/placeholder.svg" alt="Team 2 Logo" className="w-6 h-6 rounded-full" />
              </div>
            </div>

            {/* Amount Section */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-base text-vanta-text-light opacity-80">Amount</span>
              <span className="text-2xl font-bold text-vanta-text-light">₦ {selectedAmount}</span>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-2">
              {[100, 200, 500].map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "primary" : "outline"}
                  onClick={() => handleAmountSelect(amount)}
                  className="px-4 py-2 text-sm"
                >
                  ₦ {amount}
                </Button>
              ))}
            </div>

            {/* To Win Section */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-base text-vanta-text-light opacity-80">To win</span>
              <span className="text-xl font-bold text-vanta-neon-blue">500 XP</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="redeem">
          <div className="text-center py-8 text-vanta-text-light opacity-70">
            Redeem content will go here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictionSlipCard;