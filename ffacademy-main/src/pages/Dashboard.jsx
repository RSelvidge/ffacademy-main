import React, { useState, useEffect } from "react";
import { User, TrainingModule } from "@/api/aws";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Calendar,
  Star,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Users
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [currentUser, trainingModules] = await Promise.all([
        User.me(),
        TrainingModule.list()
      ]);
      setUser(currentUser);
      setModules(trainingModules);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  const getCompletedModulesCount = () => {
    return user?.completed_modules?.length || 0;
  };

  const getRecommendedModules = () => {
    if (!user || !modules.length) return [];
    const userLevel = user.skill_level || 'beginner';
    const completed = user.completed_modules || [];
    
    return modules
      .filter(module => 
        module.difficulty === userLevel && 
        !completed.includes(module.id)
      )
      .slice(0, 3);
  };

  const getSkillLevelDisplay = () => {
    const skillLevels = {
      beginner: { name: "ROOKIE", color: "text-green-500", icon: Star },
      intermediate: { name: "VETERAN", color: "text-orange-500", icon: TrendingUp },
      advanced: { name: "CHAMPION", color: "text-red-500", icon: Trophy }
    };
    return skillLevels[user?.skill_level] || skillLevels.beginner;
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const skillLevel = getSkillLevelDisplay();
  const recommendedModules = getRecommendedModules();

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
          
          .stat-card {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2 transform -rotate-1">
            WELCOME BACK, CHAMPION!
          </h1>
          <p className="text-xl font-bold text-gray-600">
            Ready to dominate your fantasy league today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <div className="stat-card p-6 bg-blue-500 text-white transform rotate-1">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8" />
              <span className="text-3xl font-black">{getCompletedModulesCount()}</span>
            </div>
            <h3 className="font-black text-lg">MODULES COMPLETE</h3>
            <p className="font-bold text-sm opacity-90">Keep learning!</p>
          </div>

          <div className="stat-card p-6 bg-orange-500 text-white transform -rotate-1">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-black">{user?.connected_accounts?.length || 0}</span>
            </div>
            <h3 className="font-black text-lg">CONNECTED LEAGUES</h3>
            <p className="font-bold text-sm opacity-90">Track progress</p>
          </div>

          <div className="stat-card p-6 bg-green-500 text-white transform rotate-1">
            <div className="flex items-center justify-between mb-4">
              <skillLevel.icon className="w-8 h-8" />
              <span className="text-lg font-black">{skillLevel.name}</span>
            </div>
            <h3 className="font-black text-lg">CURRENT RANK</h3>
            <p className="font-bold text-sm opacity-90">Level up!</p>
          </div>

          <div className="stat-card p-6 bg-purple-500 text-white transform -rotate-1">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8" />
              <span className="text-3xl font-black">7</span>
            </div>
            <h3 className="font-black text-lg">DAY STREAK</h3>
            <p className="font-bold text-sm opacity-90">On fire!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="neo-brutal-card bg-white p-6 mb-6 transform rotate-1">
              <h2 className="text-2xl font-black mb-6">QUICK ACTIONS</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link to={createPageUrl("Training")}>
                  <div className="stat-card p-6 bg-yellow-300 hover:bg-yellow-400 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <BookOpen className="w-8 h-8" />
                      <div>
                        <h3 className="font-black text-lg">START TRAINING</h3>
                        <p className="font-bold text-sm">Learn new strategies</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("Simulator")}>
                  <div className="stat-card p-6 bg-pink-300 hover:bg-pink-400 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <PlayCircle className="w-8 h-8" />
                      <div>
                        <h3 className="font-black text-lg">OPEN SIMULATOR</h3>
                        <p className="font-bold text-sm">Practice decisions</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("Connections")}>
                  <div className="stat-card p-6 bg-blue-300 hover:bg-blue-400 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Users className="w-8 h-8" />
                      <div>
                        <h3 className="font-black text-lg">MANAGE LEAGUES</h3>
                        <p className="font-bold text-sm">Connect accounts</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="stat-card p-6 bg-green-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Zap className="w-8 h-8" />
                    <div>
                      <h3 className="font-black text-lg">WEEKLY TIPS</h3>
                      <p className="font-bold text-sm">Get insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Modules */}
            <div className="neo-brutal-card bg-white p-6 transform -rotate-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">RECOMMENDED FOR YOU</h2>
                <Link to={createPageUrl("Training")}>
                  <Button className="neo-brutal-button bg-orange-500 hover:bg-orange-600 text-white font-black">
                    VIEW ALL
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {recommendedModules.length > 0 ? (
                <div className="space-y-4">
                  {recommendedModules.map((module) => (
                    <div key={module.id} className="stat-card p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-black text-lg">{module.title}</h3>
                          <p className="font-bold text-sm text-gray-600">{module.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-black bg-black text-white px-2 py-1">
                              {module.estimated_time || 10} MIN
                            </span>
                            <span className="text-xs font-black bg-blue-500 text-white px-2 py-1">
                              {module.difficulty?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-bold text-gray-600">You're all caught up!</p>
                  <p className="font-bold text-sm text-gray-500">Check back for new modules</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="neo-brutal-card bg-yellow-300 p-6 transform rotate-1">
              <h3 className="text-xl font-black mb-4">YOUR PROGRESS</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Training Progress</span>
                    <span className="font-black">{getCompletedModulesCount()}/24</span>
                  </div>
                  <div className="w-full bg-black h-3 border-2 border-black">
                    <div 
                      className="h-full bg-orange-500"
                      style={{ width: `${(getCompletedModulesCount() / 24) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-black text-2xl text-orange-600">{Math.round((getCompletedModulesCount() / 24) * 100)}%</p>
                  <p className="font-bold text-sm">COMPLETE</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="neo-brutal-card bg-white p-6 transform -rotate-1">
              <h3 className="text-xl font-black mb-4">RECENT ACTIVITY</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-sm">Completed "Player Analysis 101"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-bold text-sm">Connected ESPN account</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-bold text-sm">Started simulator training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}