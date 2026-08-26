import React, { useState, useEffect } from "react";
import { User } from "@/api/aws";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Trash2,
  LogOut,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      email_updates: true,
      training_reminders: true,
      league_alerts: false,
      weekly_summary: true
    },
    privacy: {
      profile_visible: false,
      share_progress: true,
      analytics_tracking: true
    },
    preferences: {
      theme: 'neo-brutal',
      difficulty_level: 'adaptive',
      auto_save: true
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Load user settings if they exist
      if (currentUser.settings) {
        setSettings({...settings, ...currentUser.settings});
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const updateSetting = async (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    
    setSettings(newSettings);
    
    try {
      await User.updateMyUserData({ settings: newSettings });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleExportData = () => {
    const exportData = {
      profile: user,
      settings: settings,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ff-master-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you'd call a delete endpoint
        alert('Account deletion would be processed. This is a demo.');
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          
          .setting-row {
            border-bottom: 2px solid #000000;
            padding: 1rem 0;
          }
          
          .setting-row:last-child {
            border-bottom: none;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2 transform -rotate-1">
            SETTINGS
          </h1>
          <p className="text-xl font-bold text-gray-600">
            Customize your FFAcademy experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="neo-brutal-card bg-white p-6 transform rotate-1">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6" />
              <h2 className="text-2xl font-black">NOTIFICATIONS</h2>
            </div>

            <div className="space-y-4">
              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">EMAIL UPDATES</h3>
                  <p className="font-bold text-sm text-gray-600">Receive product updates and news</p>
                </div>
                <Switch
                  checked={settings.notifications.email_updates}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email_updates', checked)}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">TRAINING REMINDERS</h3>
                  <p className="font-bold text-sm text-gray-600">Daily reminders to complete modules</p>
                </div>
                <Switch
                  checked={settings.notifications.training_reminders}
                  onCheckedChange={(checked) => updateSetting('notifications', 'training_reminders', checked)}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">LEAGUE ALERTS</h3>
                  <p className="font-bold text-sm text-gray-600">Notifications about your connected leagues</p>
                </div>
                <Switch
                  checked={settings.notifications.league_alerts}
                  onCheckedChange={(checked) => updateSetting('notifications', 'league_alerts', checked)}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">WEEKLY SUMMARY</h3>
                  <p className="font-bold text-sm text-gray-600">Weekly progress and performance summary</p>
                </div>
                <Switch
                  checked={settings.notifications.weekly_summary}
                  onCheckedChange={(checked) => updateSetting('notifications', 'weekly_summary', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="neo-brutal-card bg-white p-6 transform -rotate-1">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6" />
              <h2 className="text-2xl font-black">PRIVACY & SECURITY</h2>
            </div>

            <div className="space-y-4">
              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">PUBLIC PROFILE</h3>
                  <p className="font-bold text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={settings.privacy.profile_visible}
                  onCheckedChange={(checked) => updateSetting('privacy', 'profile_visible', checked)}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">SHARE PROGRESS</h3>
                  <p className="font-bold text-sm text-gray-600">Allow sharing of your training progress</p>
                </div>
                <Switch
                  checked={settings.privacy.share_progress}
                  onCheckedChange={(checked) => updateSetting('privacy', 'share_progress', checked)}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">ANALYTICS TRACKING</h3>
                  <p className="font-bold text-sm text-gray-600">Help improve the app with usage analytics</p>
                </div>
                <Switch
                  checked={settings.privacy.analytics_tracking}
                  onCheckedChange={(checked) => updateSetting('privacy', 'analytics_tracking', checked)}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="neo-brutal-card bg-white p-6 transform rotate-1">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6" />
              <h2 className="text-2xl font-black">PREFERENCES</h2>
            </div>

            <div className="space-y-4">
              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">THEME</h3>
                  <p className="font-bold text-sm text-gray-600">Visual theme (Neo-Brutal is default)</p>
                </div>
                <div className="neo-brutal-card bg-yellow-300 px-4 py-2">
                  <span className="font-black text-sm">NEO-BRUTAL</span>
                </div>
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">DIFFICULTY ADAPTATION</h3>
                  <p className="font-bold text-sm text-gray-600">Automatically adjust content difficulty</p>
                </div>
                <Switch
                  checked={settings.preferences.difficulty_level === 'adaptive'}
                  onCheckedChange={(checked) => updateSetting('preferences', 'difficulty_level', checked ? 'adaptive' : 'manual')}
                />
              </div>

              <div className="setting-row flex items-center justify-between">
                <div>
                  <h3 className="font-black">AUTO-SAVE PROGRESS</h3>
                  <p className="font-bold text-sm text-gray-600">Automatically save your progress</p>
                </div>
                <Switch
                  checked={settings.preferences.auto_save}
                  onCheckedChange={(checked) => updateSetting('preferences', 'auto_save', checked)}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="neo-brutal-card bg-blue-100 p-6 transform -rotate-1">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6" />
              <h2 className="text-2xl font-black">DATA MANAGEMENT</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black">EXPORT YOUR DATA</h3>
                  <p className="font-bold text-sm text-gray-600">Download all your account data</p>
                </div>
                <Button
                  onClick={handleExportData}
                  className="neo-brutal-button bg-green-500 hover:bg-green-600 text-white font-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  EXPORT
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="neo-brutal-card bg-red-100 p-6 transform rotate-1">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-black text-red-800">DANGER ZONE</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-red-800">LOGOUT</h3>
                  <p className="font-bold text-sm text-red-600">Sign out of your account</p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="neo-brutal-button bg-yellow-500 hover:bg-yellow-600 text-black font-black"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  LOGOUT
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-red-800">DELETE ACCOUNT</h3>
                  <p className="font-bold text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  className="neo-brutal-button bg-red-500 hover:bg-red-600 text-white font-black"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  DELETE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}