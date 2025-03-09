import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertProjectSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Extended schema with validation
const projectFormSchema = insertProjectSchema.omit({
  userId: true,
  // These fields will be handled separately
  tags: true,
}).extend({
  // Handle tags as a comma-separated string
  tagsInput: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function AddProject() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      primaryTag: "",
      tagsInput: "",
      type: "",
      status: "draft",
      liveLink: "",
      githubLink: "",
      featured: false
    }
  });

  const projectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      // Process tags from comma-separated string
      const { tagsInput, ...projectData } = data;
      const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      const finalData = {
        ...projectData,
        tags
      };
      
      const res = await apiRequest("POST", "/api/projects", finalData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project added",
        description: "The project has been successfully added.",
      });
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add project",
        description: error.message || "There was an error adding the project. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    await projectMutation.mutateAsync(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Add New Project</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input 
                type="text" 
                id="title"
                {...register("title")}
                className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
                placeholder="Enter project name"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select 
                id="type"
                {...register("type")}
                className={`w-full px-4 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
              >
                <option value="" disabled>Select a type</option>
                <option value="web">Web Application</option>
                <option value="mobile">Mobile App</option>
                <option value="design">UI/UX Design</option>
                <option value="other">Other</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="description"
              {...register("description")}
              rows={4} 
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
              placeholder="Describe your project"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="primaryTag" className="block text-sm font-medium text-gray-700 mb-1">Primary Technology</label>
              <input 
                type="text" 
                id="primaryTag"
                {...register("primaryTag")}
                className={`w-full px-4 py-2 border ${errors.primaryTag ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
                placeholder="e.g. React, Node.js, etc."
              />
              {errors.primaryTag && (
                <p className="mt-1 text-sm text-red-500">{errors.primaryTag.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="tagsInput" className="block text-sm font-medium text-gray-700 mb-1">Other Technologies (comma-separated)</label>
              <input 
                type="text" 
                id="tagsInput"
                {...register("tagsInput")}
                className={`w-full px-4 py-2 border ${errors.tagsInput ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
                placeholder="e.g. MongoDB, Express, TypeScript"
              />
              {errors.tagsInput && (
                <p className="mt-1 text-sm text-red-500">{errors.tagsInput.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 mb-1">Live Link</label>
              <input 
                type="url" 
                id="liveLink"
                {...register("liveLink")}
                className={`w-full px-4 py-2 border ${errors.liveLink ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
                placeholder="https://your-project.com"
              />
              {errors.liveLink && (
                <p className="mt-1 text-sm text-red-500">{errors.liveLink.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository</label>
              <input 
                type="url" 
                id="githubLink"
                {...register("githubLink")}
                className={`w-full px-4 py-2 border ${errors.githubLink ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`} 
                placeholder="https://github.com/username/repo"
              />
              {errors.githubLink && (
                <p className="mt-1 text-sm text-red-500">{errors.githubLink.message}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              id="status"
              {...register("status")}
              className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
            >
              <option value="draft">Draft</option>
              <option value="in progress">In Progress</option>
              <option value="live">Live</option>
              <option value="archived">Archived</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Feature this project on your portfolio</label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input 
                      id="image"
                      {...register("image")}
                      type="text" // Changed to text for now - image upload would require a file handling implementation
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or paste image URL</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors mr-4"
              onClick={() => reset()}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
