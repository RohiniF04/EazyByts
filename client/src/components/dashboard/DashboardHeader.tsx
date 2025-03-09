import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation, Link } from "wouter";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-4">Welcome, {user?.name || 'User'}</span>
          <div className="relative">
            <button 
              className="flex items-center focus:outline-none"
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img 
                src={user?.profileImage || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"} 
                alt="User avatar" 
                className="w-8 h-8 rounded-full mr-2" 
              />
              <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link href="/dashboard/profile">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fas fa-user mr-2"></i> Profile
                  </a>
                </Link>
                <Link href="/dashboard/settings">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fas fa-cog mr-2"></i> Settings
                  </a>
                </Link>
                <Link href="/">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fas fa-home mr-2"></i> View Site
                  </a>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
