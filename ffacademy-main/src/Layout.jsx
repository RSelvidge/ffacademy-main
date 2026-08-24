import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, 
  LayoutDashboard, 
  Settings, 
  Link as LinkIcon, 
  GraduationCap, 
  Gamepad2,
  Menu,
  X,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    color: "bg-blue-500"
  },
  {
    title: "Scoreboard",
    url: createPageUrl("Scoreboard"),
    icon: Trophy,
    color: "bg-red-500"
  },
  {
    title: "Training",
    url: createPageUrl("Training"),
    icon: GraduationCap,
    color: "bg-orange-500"
  },
  {
    title: "Simulator",
    url: createPageUrl("Simulator"),
    icon: Gamepad2,
    color: "bg-green-500"
  },
  {
    title: "Connections",
    url: createPageUrl("Connections"),
    icon: LinkIcon,
    color: "bg-pink-500"
  },
  {
    title: "Account",
    url: createPageUrl("Account"),
    icon: User,
    color: "bg-purple-500"
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
    color: "bg-yellow-500"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Skip layout for onboarding pages
  if (currentPageName === "Onboarding" || currentPageName === "SkillLevel" || currentPageName === "AccountLink") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <style>
        {`
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
          
          .neo-brutal-button:active {
            transform: translate(2px, 2px) !important;
            box-shadow: 2px 2px 0px #000000 !important;
          }
          
          .neo-brutal-card {
            border: 4px solid #000000;
            box-shadow: 8px 8px 0px #000000;
            background: #FFFFFF;
          }
          
          .neo-brutal-nav-item {
            border: 3px solid #000000;
            box-shadow: 4px 4px 0px #000000;
            transition: all 0.1s ease;
          }
          
          .neo-brutal-nav-item:hover {
            transform: translate(-1px, -1px);
            box-shadow: 5px 5px 0px #000000;
          }
          
          .neo-brutal-nav-item.active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000000;
          }
        `}
      </style>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r-4 border-black transition-transform duration-200 ease-in-out`}>
        
        {/* Header */}
        <div className="p-6 border-b-4 border-black bg-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">GRIDIRON GURU</h1>
              <p className="text-blue-100 font-bold text-sm">DOMINATE YOUR LEAGUE</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`neo-brutal-nav-item ${
                location.pathname === item.url ? 'active' : ''
              } flex items-center gap-4 p-4 rounded-none ${item.color} text-white font-black text-lg hover:bg-opacity-90 block`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-6 h-6" />
              {item.title.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="neo-brutal-card p-4 bg-yellow-300">
            <h3 className="font-black text-lg mb-2">YOUR PROGRESS</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">MODULES:</span>
                <span className="font-black">12/24</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">RANK:</span>
                <span className="font-black text-orange-600">ROOKIE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="neo-brutal-button bg-blue-500 text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-black">GRIDIRON GURU</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}