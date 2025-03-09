import { useQuery, useMutation } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProjectsList() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the project.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(null);
    }
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setIsDeleting(id);
      await deleteMutation.mutateAsync(id);
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
        <button
          onClick={() => window.location.href = "/dashboard/projects/new"}
          className="text-sm text-primary hover:text-blue-700 font-medium"
        >
          <i className="fas fa-plus mr-1"></i> Add New
        </button>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="ml-4">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24 mt-1" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-5 w-16" /></td>
                  </tr>
                ))
              ) : projects?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No projects found. Add your first project!
                  </td>
                </tr>
              ) : (
                projects?.map((project) => (
                  <tr key={project.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          <i className={`fas ${project.type === 'web' ? 'fa-globe' : 
                                          project.type === 'mobile' ? 'fa-mobile-alt' : 
                                          project.type === 'design' ? 'fa-palette' : 
                                          'fa-code'}`}></i>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.type || 'Project'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {project.tags && project.tags.length > 0 ? (
                        project.tags.slice(0, 2).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No tags</span>
                      )}
                      {project.tags && project.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                        {project.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <a 
                          href={`/dashboard/projects/edit/${project.id}`} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          disabled={isDeleting === project.id}
                        >
                          {isDeleting === project.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {projects && projects.length > 0 && (
          <div className="mt-6 flex justify-center">
            <a href="/dashboard/projects" className="text-primary hover:text-blue-700 font-medium">
              View All Projects
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
