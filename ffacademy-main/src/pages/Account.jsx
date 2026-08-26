import React, { useState, useEffect } from "react";
import { User } from "@/api/aws";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  Mail, 
  Crown,
  Star,
  TrendingUp,
  Trophy,
  Save,
  Edit,
  Award,
  Target
} from "lucide-react";

const skillLevelInfo = {
  beginner: { name: "ROOKIE", icon: Star, color: "bg-green-500", description: "Learning the basics" },
  intermediate: { name: "VETERAN", icon: TrendingUp, color: "bg-orange-500", description: "Building experience" },
  advanced: { name: "CHAMPION", icon: Crown, color: "bg-red-500", description: "Master strategist" }
};

export default function Account() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEditData({
        full_name: currentUser.full_name || "",
        skill_level: currentUser.skill_level || "beginner"
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(editData);
      await loadUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    setIsSaving(false);
  };

  const getCompletedModulesCount = () => {
    return user?.completed_modules?.length || 0;
  };

  const getConnectedAccountsCount = () => {
    return user?.connected_accounts?.length || 0;
  };

  const getMemberSince = () => {
    if (!user?.created_date) return "Recently";
    const date = new Date(user.created_date);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const skillLevel = skillLevelInfo[user?.skill_level] || skillLevelInfo.beginner;

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <style>
        {`
          .neo-brutal-card {
            border: 4px solid #000000;
            box-shadow: 6px 6px 0px #000000;
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
          
          .stat-card {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
          }
          
          .skill-badge {
            border: 3px solid #000000;
            box-shadow: 3px 3px 0px #000000;
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2 transform rotate-1">
            YOUR ACCOUNT
          </h1>
          <p className="text-xl font-bold text-gray-600">
            Manage your profile and track your fantasy football journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="neo-brutal-card bg-white p-6 mb-6 transform -rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">PROFILE INFORMATION</h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="neo-brutal-button bg-blue-500 hover:bg-blue-600 text-white font-black"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    EDIT
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'SAVING...' : 'SAVE'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          full_name: user.full_name || "",
                          skill_level: user.skill_level || "beginner"
                        });
                      }}
                      variant="outline"
                      className="neo-brutal-button bg-white text-black font-black"
                    >
                      CANCEL
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-sm mb-2">FULL NAME</label>
                    {isEditing ? (
                      <Input
                        value={editData.full_name}
                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                        className="neo-brutal-input font-bold"
                      />
                    ) : (
                      <div className="stat-card p-3 bg-gray-50">
                        <span className="font-bold text-lg">{user?.full_name || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-black text-sm mb-2">EMAIL ADDRESS</label>
                    <div className="stat-card p-3 bg-gray-100">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="font-bold">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-sm mb-2">SKILL LEVEL</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {Object.entries(skillLevelInfo).map(([key, info]) => (
                          <div
                            key={key}
                            onClick={() => setEditData({...editData, skill_level: key})}
                            className={`skill-badge p-3 cursor-pointer ${info.color} ${
                              editData.skill_level === key ? 'text-white' : 'text-white opacity-70'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <info.icon className="w-5 h-5" />
                              <div>
                                <span className="font-black">{info.name}</span>
                                <p className="text-sm font-bold opacity-90">{info.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`skill-badge p-4 ${skillLevel.color} text-white`}>
                        <div className="flex items-center gap-3">
                          <skillLevel.icon className="w-6 h-6" />
                          <div>
                            <h3 className="font-black text-lg">{skillLevel.name}</h3>
                            <p className="font-bold text-sm opacity-90">{skillLevel.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-black text-sm mb-2">ACCOUNT ROLE</label>
                    <div className="stat-card p-3 bg-blue-100">
                      <Badge className="bg-blue-500 text-white font-bold">
                        <UserIcon className="w-3 h-3 mr-1" />
                        {user?.role?.toUpperCase() || 'USER'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="neo-brutal-card bg-white p-6 transform rotate-1">
              <h2 className="text-2xl font-black mb-6">RECENT ACTIVITY</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 border-3 border-black">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black">Completed Training Module</h3>
                    <p className="font-bold text-sm text-gray-600">Fantasy Football Basics</p>
                  </div>
                  <span className="ml-auto font-bold text-sm text-gray-500">2 days ago</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 border-3 border-black">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black">Connected ESPN Account</h3>
                    <p className="font-bold text-sm text-gray-600">League: Championship Dreams</p>
                  </div>
                  <span className="ml-auto font-bold text-sm text-gray-500">1 week ago</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-yellow-50 border-3 border-black">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-black">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black">Account Created</h3>
                    <p className="font-bold text-sm text-gray-600">Welcome to FFAcademy!</p>
                  </div>
                  <span className="ml-auto font-bold text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="neo-brutal-card bg-yellow-300 p-6 transform -rotate-1">
              <h3 className="text-xl font-black mb-4">ACCOUNT STATS</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Member Since:</span>
                  <span className="font-black">{getMemberSince()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Modules Completed:</span>
                  <span className="font-black">{getCompletedModulesCount()}/24</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Connected Accounts:</span>
                  <span className="font-black">{getConnectedAccountsCount()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Current Streak:</span>
                  <span className="font-black text-orange-600">7 days</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="neo-brutal-card bg-white p-6">
              <h3 className="text-xl font-black mb-4">TRAINING PROGRESS</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Overall Progress</span>
                    <span className="font-black">{Math.round((getCompletedModulesCount() / 24) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 border-3 border-black">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(getCompletedModulesCount() / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center">
                    <div className="font-black text-2xl text-blue-600">{getCompletedModulesCount()}</div>
                    <div className="font-bold text-sm text-gray-600">COMPLETED</div>
                  </div>
                  <div className="text-center">
                    <div className="font-black text-2xl text-orange-600">{24 - getCompletedModulesCount()}</div>
                    <div className="font-bold text-sm text-gray-600">REMAINING</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="neo-brutal-card bg-purple-100 p-6 transform rotate-1">
              <h3 className="text-xl font-black mb-4">ACHIEVEMENTS</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">FIRST STEPS</h4>
                    <p className="font-bold text-xs text-gray-600">Completed first module</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">CONNECTED</h4>
                    <p className="font-bold text-xs text-gray-600">Linked fantasy account</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-black">
                    <Award className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">STREAK MASTER</h4>
                    <p className="font-bold text-xs text-gray-600">7 day training streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}