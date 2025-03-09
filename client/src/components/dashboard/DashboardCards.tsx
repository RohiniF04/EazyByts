import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Project, Message, Skill } from "@shared/schema";

export default function DashboardCards() {
  const { data: projects, isLoading: isProjectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  const { data: messages, isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const { data: skills, isLoading: isSkillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });
  
  // Mock visitor data - this would normally come from analytics
  const visitors = {
    count: 1295,
    change: 12,
    isIncrease: true
  };

  // Calculate new projects in current month
  const getCurrentMonthProjects = () => {
    if (!projects) return { count: 0, isIncrease: false, change: 0 };
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const newProjects = projects.filter(project => {
      const createdAt = new Date(project.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    });
    
    return {
      count: newProjects.length,
      isIncrease: newProjects.length > 0,
      change: newProjects.length
    };
  };

  // Calculate message changes
  const getMessageStats = () => {
    if (!messages) return { count: 0, isIncrease: false, change: 0 };
    
    // For demo purposes, we'll say there are 5 fewer messages than last month
    return {
      count: messages.length,
      isIncrease: false,
      change: 5
    };
  };

  const projectStats = getCurrentMonthProjects();
  const messageStats = getMessageStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Projects Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Projects</p>
            {isProjectsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-800">{projects?.length || 0}</h3>
            )}
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-primary">
            <i className="fas fa-project-diagram"></i>
          </div>
        </div>
        {isProjectsLoading ? (
          <Skeleton className="h-5 w-32 mt-4" />
        ) : (
          <p className={`${projectStats.isIncrease ? 'text-green-500' : 'text-gray-500'} text-sm mt-4`}>
            <i className={`fas ${projectStats.isIncrease ? 'fa-arrow-up' : 'fa-minus'} mr-1`}></i> 
            {projectStats.change > 0 ? `${projectStats.change} new this month` : 'No new projects this month'}
          </p>
        )}
      </div>
      
      {/* Messages Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Messages</p>
            {isMessagesLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-800">{messages?.length || 0}</h3>
            )}
          </div>
          <div className="p-3 rounded-full bg-green-100 text-secondary">
            <i className="fas fa-envelope"></i>
          </div>
        </div>
        {isMessagesLoading ? (
          <Skeleton className="h-5 w-40 mt-4" />
        ) : (
          <p className={`${messageStats.isIncrease ? 'text-green-500' : 'text-red-500'} text-sm mt-4`}>
            <i className={`fas ${messageStats.isIncrease ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
            {`${messageStats.change} ${messageStats.isIncrease ? 'more' : 'less'} than last month`}
          </p>
        )}
      </div>
      
      {/* Visitors Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Visitors</p>
            <h3 className="text-2xl font-bold text-gray-800">{visitors.count.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <i className="fas fa-users"></i>
          </div>
        </div>
        <p className={`${visitors.isIncrease ? 'text-green-500' : 'text-red-500'} text-sm mt-4`}>
          <i className={`fas ${visitors.isIncrease ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
          {`${visitors.change}% increase`}
        </p>
      </div>
      
      {/* Skills Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Skills</p>
            {isSkillsLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-gray-800">{skills?.length || 0}</h3>
            )}
          </div>
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="fas fa-code"></i>
          </div>
        </div>
        {isSkillsLoading ? (
          <Skeleton className="h-5 w-32 mt-4" />
        ) : (
          <p className="text-gray-500 text-sm mt-4">
            Updated {skills && skills.length > 0 ? '3 days ago' : 'never'}
          </p>
        )}
      </div>
    </div>
  );
}
