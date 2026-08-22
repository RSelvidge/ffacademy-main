import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trophy, Target, Zap } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser.onboarding_completed) {
        navigate(createPageUrl("Dashboard"));
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate(createPageUrl("SkillLevel"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="neo-brutal-card max-w-2xl w-full p-8 bg-white transform -rotate-1">
        <style>
          {`
            .neo-brutal-card {
              border: 6px solid #000000;
              box-shadow: 12px 12px 0px #000000;
            }
            
            .neo-brutal-button {
              border: 4px solid #000000 !important;
              box-shadow: 6px 6px 0px #000000 !important;
              transition: all 0.1s ease !important;
            }
            
            .neo-brutal-button:hover {
              transform: translate(-2px, -2px) !important;
              box-shadow: 8px 8px 0px #000000 !important;
            }
            
            .feature-card {
              border: 3px solid #000000;
              box-shadow: 4px 4px 0px #000000;
            }
          `}
        </style>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-black mb-4 transform rotate-1">
            FANTASY FOOTBALL
          </h1>
          <h2 className="text-3xl font-black text-orange-500 mb-4 transform -rotate-1">
            TRAINING ACADEMY
          </h2>
          <p className="text-xl font-bold text-gray-800 max-w-md mx-auto">
            DOMINATE YOUR LEAGUE WITH EXPERT TRAINING & SIMULATION
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="feature-card p-4 bg-yellow-300 text-center transform rotate-1">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-black text-lg">WIN MORE</h3>
            <p className="font-bold text-sm">Advanced strategies</p>
          </div>
          <div className="feature-card p-4 bg-green-300 text-center transform -rotate-1">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-black text-lg">TRAIN SMART</h3>
            <p className="font-bold text-sm">Interactive modules</p>
          </div>
          <div className="feature-card p-4 bg-pink-300 text-center transform rotate-1">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-black text-lg">SIMULATE</h3>
            <p className="font-bold text-sm">Real FF experience</p>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleGetStarted}
            className="neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-8 py-4 rounded-none transform rotate-1"
          >
            START DOMINATING NOW!
          </Button>
          <p className="text-sm font-bold text-gray-600 mt-4">
            Free forever • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}