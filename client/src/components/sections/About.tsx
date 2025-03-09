import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-accent text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">My journey, experience, and philosophy as a developer.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="md:w-1/3 mb-6 md:mb-0">
              {isLoading ? (
                <Skeleton className="rounded-lg shadow-lg w-full h-80" />
              ) : (
                <img 
                  src={user?.profileImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"} 
                  alt={`${user?.name || 'Developer'} working`} 
                  className="rounded-lg shadow-lg w-full" 
                />
              )}
              
              <div className="mt-6 flex justify-center gap-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-full" />
                  ))
                ) : (
                  <>
                    {user?.github && (
                      <a 
                        href={user.github} 
                        className="text-gray-600 hover:text-primary transition-colors" 
                        aria-label="GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-github text-2xl"></i>
                      </a>
                    )}
                    
                    {user?.linkedin && (
                      <a 
                        href={user.linkedin} 
                        className="text-gray-600 hover:text-primary transition-colors" 
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-linkedin text-2xl"></i>
                      </a>
                    )}
                    
                    {user?.twitter && (
                      <a 
                        href={user.twitter} 
                        className="text-gray-600 hover:text-primary transition-colors" 
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-twitter text-2xl"></i>
                      </a>
                    )}
                    
                    {user?.medium && (
                      <a 
                        href={user.medium} 
                        className="text-gray-600 hover:text-primary transition-colors" 
                        aria-label="Medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-medium text-2xl"></i>
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <div className="h-4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <div className="mt-6">
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: user?.bio || 
                    `<p class="mb-4">
                      Hello! I'm a <strong>Full Stack Developer</strong> with experience building web applications.
                      I specialize in JavaScript technologies, particularly the React and Node.js ecosystems.
                    </p>
                    <p class="mb-4">
                      My approach to development focuses on writing clean, maintainable code that solves real problems for users.
                      I believe in continuous learning and regularly experiment with new technologies to expand my skill set.
                    </p>`
                  }} />
                  
                  <div className="mt-6">
                    <a href="#" className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">
                      <i className="fas fa-file-alt mr-2"></i> Download Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
