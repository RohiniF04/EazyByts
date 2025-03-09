import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hero() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  return (
    <section id="hero" className="py-16 md:py-24 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-8 w-1/2 mb-6" />
                <Skeleton className="h-20 w-full mb-8" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </>
            ) : (
              <>
                <h1 className="font-accent text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {user?.name || "Web Developer"}
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-600 mb-6">
                  {user?.title || "Full Stack Developer"}
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-lg">
                  {user?.shortBio || "Passionate about creating beautiful, functional web applications with modern technologies."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#contact" className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
                    Get in Touch
                  </a>
                  <a href="#projects" className="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-3 px-6 rounded-md transition-colors">
                    View Projects
                  </a>
                </div>
              </>
            )}
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary rounded-lg opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-lg opacity-20"></div>
              {isLoading ? (
                <Skeleton className="w-72 h-72 md:w-80 md:h-80 rounded-lg relative z-10" />
              ) : (
                <img 
                  src={user?.profileImage || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"} 
                  alt={`Profile picture of ${user?.name || 'Developer'}`} 
                  className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-lg shadow-lg relative z-10" 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
