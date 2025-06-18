
import { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Video, 
  Radio, 
  BarChart3, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

type AdminSection = 'dashboard' | 'articles' | 'categories' | 'videos' | 'live' | 'analytics';

interface AdminLayoutProps {
  children: ReactNode;
  user: User | null;
  userProfile: any;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onSignOut: () => void;
}

export const AdminLayout = ({
  children,
  user,
  userProfile,
  activeSection,
  onSectionChange,
  onSignOut
}: AdminLayoutProps) => {
  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles' as AdminSection, label: 'Articles', icon: FileText },
    { id: 'categories' as AdminSection, label: 'Categories', icon: Tags },
    { id: 'videos' as AdminSection, label: 'Videos', icon: Video },
    { id: 'live' as AdminSection, label: 'Live Streams', icon: Radio },
    { id: 'analytics' as AdminSection, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">Voice Of Bharat - Admin</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {userProfile?.full_name || user?.email}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {userProfile?.role}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="p-6 min-h-full">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
};
