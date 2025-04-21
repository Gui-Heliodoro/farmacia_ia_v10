import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  
  const handleSignOut = async () => {
    await signOut();
    toast.success('You have been signed out');
  };
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            {profile?.role === 'vendor' && 'Vendor Dashboard'}
            {profile?.role === 'pharmacist' && 'Pharmacist Dashboard'}
            {profile?.role === 'admin' && 'Admin Dashboard'}
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1.5 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {profile?.full_name || 'User'}
                </span>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;