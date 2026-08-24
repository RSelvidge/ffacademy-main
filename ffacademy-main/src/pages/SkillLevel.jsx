import React, { useState } from "react";
import { User } from "@/api/aws";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Star, TrendingUp, Crown } from "lucide-react";

const skillLevels = [
  {
    id: "beginner",
    title: "ROOKIE",
    subtitle: "New to Fantasy Football",
    description: "Perfect for first-timers who want to learn the basics and start winning",
    icon: Star,
    color: "bg-green-500",
    features: ["Basic rules & scoring", "Player selection tips", "Waiver wire basics"]
  },
  {
    id: "intermediate", 
    title: "VETERAN",
    subtitle: "Some Fantasy Experience",
    description: "You know the basics but want to take your game to the next level",
    icon: TrendingUp,
    color: "bg-orange-500",
    features: ["Advanced analytics", "Trade strategies", "Injury management"]
  },
  {
    id: "advanced",
    title: "CHAMPION",
    subtitle: "Fantasy Football Pro",
    description: "You're experienced and want cutting-edge strategies to dominate",
    icon: Crown,
    color: "bg-red-500",
    features: ["Expert trading", "Advanced metrics", "League psychology"]
  }
];

export default function SkillLevel() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedLevel) return;
    
    setIsLoading(true);
    try {
      await User.updateMyUserData({ skill_level: selectedLevel });
      navigate(createPageUrl("AccountLink"));
    } catch (error) {
      console.error("Error updating skill level:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-500 p-4">
      <style>
        {`
          .neo-brutal-card {
            border: 4px solid #000000;
            box-shadow: 8px 8px 0px #000000;
          }
          
          .neo-brutal-button {
            border: 3px solid #000000 !important;
            box-shadow: 4px 4px 0px #000000 !important;
            transition: all 0.1s ease !important;
          }
          
          .neo-brutal-button:hover {
            transform: translate(-1px, -1px) !important;
            box-shadow: 5px 5px 0px #000000 !important;
          }
          
          .skill-card {
            border: 4px solid #000000;
            box-shadow: 6px 6px 0px #000000;
            transition: all 0.1s ease;
            cursor: pointer;
          }
          
          .skill-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #000000;
          }
          
          .skill-card.selected {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000000;
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Onboarding"))}
            className="neo-brutal-button bg-white text-black font-black mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4 transform -rotate-1">
              WHAT'S YOUR SKILL LEVEL?
            </h1>
            <p className="text-xl font-bold text-blue-100 transform rotate-1">
              We'll customize your training experience
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {skillLevels.map((level) => (
            <div
              key={level.id}
              className={`skill-card ${selectedLevel === level.id ? 'selected' : ''} p-6 bg-white transform ${
                level.id === 'intermediate' ? 'rotate-1' : level.id === 'advanced' ? '-rotate-1' : ''
              }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <div className={`w-16 h-16 ${level.color} rounded-full flex items-center justify-center mb-4 border-3 border-black`}>
                <level.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-black text-black mb-2">{level.title}</h3>
              <p className="text-lg font-bold text-gray-600 mb-3">{level.subtitle}</p>
              <p className="text-base font-bold text-gray-800 mb-4">{level.description}</p>
              
              <div className="space-y-2">
                {level.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <span className="font-bold text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedLevel || isLoading}
            className={`neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-8 py-4 rounded-none transform rotate-1 ${
              !selectedLevel ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'SETTING UP...' : 'CONTINUE TO SETUP'}
          </Button>
        </div>
      </div>
    </div>
  );
}