import React, { useState } from "react";
import { User } from "@/api/aws";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Plus, X } from "lucide-react";

const platforms = [
  { id: "espn", name: "ESPN", color: "bg-red-500", logo: "🏈" },
  { id: "yahoo", name: "Yahoo Fantasy", color: "bg-purple-500", logo: "🟣" },
  { id: "sleeper", name: "Sleeper", color: "bg-blue-500", logo: "💤" },
  { id: "nfl", name: "NFL.com", color: "bg-blue-600", logo: "🏆" }
];

export default function AccountLink() {
  const navigate = useNavigate();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentForm, setCurrentForm] = useState({
    platform: "",
    username: "",
    league_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAccount = () => {
    if (!currentForm.platform || !currentForm.username || !currentForm.league_name) return;
    
    setConnectedAccounts([...connectedAccounts, { ...currentForm }]);
    setCurrentForm({ platform: "", username: "", league_name: "" });
    setShowAddForm(false);
  };

  const removeAccount = (index) => {
    setConnectedAccounts(connectedAccounts.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({
        connected_accounts: connectedAccounts,
        onboarding_completed: true,
        completed_modules: []
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
    setIsLoading(false);
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({
        connected_accounts: [],
        onboarding_completed: true,
        completed_modules: []
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-500 p-4">
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
          
          .neo-brutal-input {
            border: 3px solid #000000 !important;
            box-shadow: 3px 3px 0px #000000 !important;
          }
          
          .platform-button {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
          }
          
          .platform-button:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }
          
          .platform-button.selected {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px #000000;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("SkillLevel"))}
            className="neo-brutal-button bg-white text-black font-black mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4 transform rotate-1">
              CONNECT YOUR ACCOUNTS
            </h1>
            <p className="text-xl font-bold text-green-100 transform -rotate-1">
              Link your fantasy accounts for personalized training (optional)
            </p>
          </div>
        </div>

        <div className="neo-brutal-card bg-white p-8 mb-8 transform -rotate-1">
          <h3 className="text-2xl font-black mb-6">CONNECTED ACCOUNTS</h3>
          
          {connectedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg font-bold text-gray-600 mb-4">No accounts connected yet</p>
              <p className="text-base font-bold text-gray-500">Connect your accounts to get personalized insights!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-100 border-3 border-black">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${platforms.find(p => p.id === account.platform)?.color} rounded-full flex items-center justify-center border-3 border-black`}>
                      <span className="text-2xl">{platforms.find(p => p.id === account.platform)?.logo}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{platforms.find(p => p.id === account.platform)?.name}</h4>
                      <p className="font-bold text-gray-600">{account.username} • {account.league_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAccount(index)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD ACCOUNT
            </Button>
          ) : (
            <div className="neo-brutal-card bg-yellow-300 p-6">
              <h4 className="text-xl font-black mb-4">ADD FANTASY ACCOUNT</h4>
              
              <div className="mb-4">
                <label className="block font-black text-sm mb-2">PLATFORM</label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setCurrentForm({...currentForm, platform: platform.id})}
                      className={`platform-button ${currentForm.platform === platform.id ? 'selected' : ''} p-3 ${platform.color} text-white font-bold flex items-center gap-2`}
                    >
                      <span className="text-xl">{platform.logo}</span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-black text-sm mb-2">USERNAME</label>
                <Input
                  value={currentForm.username}
                  onChange={(e) => setCurrentForm({...currentForm, username: e.target.value})}
                  placeholder="Your username"
                  className="neo-brutal-input font-bold"
                />
              </div>

              <div className="mb-6">
                <label className="block font-black text-sm mb-2">LEAGUE NAME</label>
                <Input
                  value={currentForm.league_name}
                  onChange={(e) => setCurrentForm({...currentForm, league_name: e.target.value})}
                  placeholder="Your league name"
                  className="neo-brutal-input font-bold"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddAccount}
                  disabled={!currentForm.platform || !currentForm.username || !currentForm.league_name}
                  className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                >
                  ADD ACCOUNT
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  className="neo-brutal-button bg-white text-black font-black"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={handleFinish}
            disabled={isLoading}
            className="neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-8 py-4 rounded-none transform rotate-1"
          >
            {isLoading ? 'SETTING UP...' : 'START TRAINING!'}
          </Button>
          
          <div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              disabled={isLoading}
              className="neo-brutal-button bg-white text-black font-black"
            >
              SKIP FOR NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}