import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  activePage?: string;
}

export default function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-accent font-bold">Portfolio CMS</h2>
      </div>
      
      <nav className="mt-6">
        <Link href="/dashboard">
          <a className={`flex items-center py-3 px-4 ${activePage === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-tachometer-alt mr-3"></i>
            Dashboard
          </a>
        </Link>
        
        <Link href="/dashboard/profile">
          <a className={`flex items-center py-3 px-4 ${activePage === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-user mr-3"></i>
            Profile
          </a>
        </Link>
        
        <Link href="/dashboard/projects">
          <a className={`flex items-center py-3 px-4 ${activePage === 'projects' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-project-diagram mr-3"></i>
            Projects
          </a>
        </Link>
        
        <Link href="/dashboard/skills">
          <a className={`flex items-center py-3 px-4 ${activePage === 'skills' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-code mr-3"></i>
            Skills
          </a>
        </Link>
        
        <Link href="/dashboard/messages">
          <a className={`flex items-center py-3 px-4 ${activePage === 'messages' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-envelope mr-3"></i>
            Messages
          </a>
        </Link>
        
        <Link href="/dashboard/settings">
          <a className={`flex items-center py-3 px-4 ${activePage === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} transition-colors`}>
            <i className="fas fa-cog mr-3"></i>
            Settings
          </a>
        </Link>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Logout
        </button>
      </div>
    </div>
  );
}
