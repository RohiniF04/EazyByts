import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Skill } from "@shared/schema";

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  // Organize skills by category
  const frontendSkills = skills?.filter(skill => skill.category === 'frontend') || [];
  const backendSkills = skills?.filter(skill => skill.category === 'backend') || [];
  const databaseSkills = skills?.filter(skill => skill.category === 'database') || [];
  const toolingSkills = skills?.filter(skill => skill.category === 'tooling') || [];

  // Function to render skill items with loading state
  const renderSkillItems = (categorySkills: Skill[], isLoading: boolean, icon: string, title: string, colorClass: string) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className={`${colorClass} mb-4`}>
        <i className={`fas ${icon} text-3xl`}></i>
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-3">
        {isLoading ? (
          // Skeleton loading states
          Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center">
              <Skeleton className="w-full h-2.5 rounded-full" />
              <Skeleton className="ml-3 w-20 h-5" />
            </li>
          ))
        ) : categorySkills.length > 0 ? (
          // Display actual skills
          categorySkills.map((skill) => (
            <li key={skill.id} className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${title === 'Frontend' ? 'bg-primary' : 
                                title === 'Backend' ? 'bg-secondary' : 
                                title === 'Database' ? 'bg-blue-600' : 
                                'bg-gray-700'} h-2.5 rounded-full`} 
                  style={{ width: `${skill.percentage}%` }}
                ></div>
              </div>
              <span className="ml-3 text-gray-700 font-medium w-20">{skill.name}</span>
            </li>
          ))
        ) : (
          // Empty state
          <li className="text-gray-500 text-sm">No {title.toLowerCase()} skills added yet.</li>
        )}
      </ul>
    </div>
  );

  return (
    <section id="skills" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-accent text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The technologies, frameworks, and tools I specialize in for building modern web applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderSkillItems(frontendSkills, isLoading, 'fa-code', 'Frontend', 'text-primary')}
          {renderSkillItems(backendSkills, isLoading, 'fa-server', 'Backend', 'text-secondary')}
          {renderSkillItems(databaseSkills, isLoading, 'fa-database', 'Database', 'text-blue-600')}
          {renderSkillItems(toolingSkills, isLoading, 'fa-tools', 'Tooling', 'text-gray-700')}
        </div>
      </div>
    </section>
  );
}
