import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@shared/schema";
import { useState } from "react";

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  // State to track how many projects to show
  const [visibleCount, setVisibleCount] = useState(3);

  // Function to show more projects
  const showMoreProjects = () => {
    setVisibleCount(prev => prev + 3);
  };

  const visibleProjects = projects?.slice(0, visibleCount) || [];
  const hasMoreProjects = projects && visibleCount < projects.length;

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-accent text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A selection of my recent work, showcasing my skills in full-stack development, UI/UX design, and problem-solving.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading states
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))
          ) : projects?.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
            </div>
          ) : (
            // Display actual projects
            visibleProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <i className="fas fa-image text-4xl"></i>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    {project.primaryTag && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {project.primaryTag}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <a href={`#project-${project.id}`} className="text-primary font-medium hover:text-blue-700 transition-colors">
                      View Details
                    </a>
                    {project.liveLink && (
                      <a 
                        href={project.liveLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {hasMoreProjects && (
          <div className="mt-12 text-center">
            <button 
              onClick={showMoreProjects}
              className="bg-white border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-2 px-6 rounded-md transition-colors"
            >
              View More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
