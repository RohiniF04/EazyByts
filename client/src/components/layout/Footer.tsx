import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function Footer() {
  // Use safer query options
  const { data: user } = useQuery<User | undefined>({
    queryKey: ["/api/profile"],
    retry: false,
    enabled: true,
    refetchOnWindowFocus: false
  });

  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-accent font-bold text-white">
              Dev<span className="text-secondary">Portfolio</span>
            </Link>
            <p className="mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            {user?.github && (
              <a 
                href={user.github}
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="GitHub"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
            )}
            
            {user?.linkedin && (
              <a 
                href={user.linkedin}
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="LinkedIn"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            )}
            
            {user?.twitter && (
              <a 
                href={user.twitter}
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="Twitter"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
            )}
            
            {user?.medium && (
              <a 
                href={user.medium}
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="Medium"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <i className="fab fa-medium text-xl"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
