import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, insertUserSchema, InsertMessage, Message, Project, Skill } from "@shared/schema";

import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import ProjectsList from "@/components/dashboard/ProjectsList";
import AddProject from "@/components/dashboard/AddProject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const params = useParams<{ section?: string }>();
  const section = params.section || "dashboard";
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Select the right component based on the section parameter
  const renderDashboardSection = () => {
    switch (section) {
      case "dashboard":
        return <DashboardOverview />;
      case "profile":
        return <ProfileSection />;
      case "projects":
        return <ProjectsSection />;
      case "skills":
        return <SkillsSection />;
      case "messages":
        return <MessagesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={section} />
      
      <div className="flex-1 overflow-y-auto ml-64">
        <DashboardHeader title={section.charAt(0).toUpperCase() + section.slice(1)} />
        <main className="p-6">
          {renderDashboardSection()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Overview section
function DashboardOverview() {
  return (
    <>
      <DashboardCards />
      <ProjectsList />
      <AddProject />
    </>
  );
}

// Profile Section
function ProfileSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extended schema with validation for profile updates
  const profileSchema = insertUserSchema.omit({
    username: true,
    password: true,
  }).partial();
  
  type ProfileFormValues = z.infer<typeof profileSchema>;
  
  const { data: profile, isLoading } = useQuery<User>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      title: profile?.title || "",
      shortBio: profile?.shortBio || "",
      bio: profile?.bio || "",
      profileImage: profile?.profileImage || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      github: profile?.github || "",
      linkedin: profile?.linkedin || "",
      twitter: profile?.twitter || "",
      medium: profile?.medium || "",
    },
  });
  
  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name,
        title: profile.title,
        shortBio: profile.shortBio,
        bio: profile.bio,
        profileImage: profile.profileImage,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        medium: profile.medium,
      });
    }
  }, [profile, profileForm]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    await updateProfileMutation.mutateAsync(data);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="shortBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio (for hero section)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief description of who you are and what you do" 
                        {...field} 
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Bio (HTML supported)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed information about your background, experience, and interests" 
                        {...field} 
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-semibold pt-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-semibold pt-4">Social Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://medium.com/@yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Projects Section
function ProjectsSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </div>
      
      <ProjectsList />
    </div>
  );
}

// Skills Section
function SkillsSection() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("frontend");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Schema for adding new skills
  const skillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    percentage: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100"),
    category: z.string(),
  });
  
  type SkillFormValues = z.infer<typeof skillSchema>;
  
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });
  
  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      percentage: 80,
      category: activeCategory,
    },
  });
  
  // Update category field when tab changes
  useEffect(() => {
    skillForm.setValue("category", activeCategory);
  }, [activeCategory, skillForm]);
  
  const skillMutation = useMutation({
    mutationFn: async (data: SkillFormValues) => {
      const res = await apiRequest("POST", "/api/skills", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill added",
        description: "The skill has been successfully added.",
      });
      skillForm.reset({
        name: "",
        percentage: 80,
        category: activeCategory,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add skill",
        description: error.message || "There was an error adding the skill.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill deleted",
        description: "The skill has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete skill",
        description: error.message || "There was an error deleting the skill.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (data: SkillFormValues) => {
    setIsSubmitting(true);
    await skillMutation.mutateAsync(data);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteMutation.mutateAsync(id);
    }
  };
  
  const getCategorySkills = (category: string) => {
    return skills?.filter(skill => skill.category === category) || [];
  };
  
  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs 
                value={activeCategory} 
                onValueChange={setActiveCategory} 
                className="mb-4"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="tooling">Tooling</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={skillForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={skillForm.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency (0-100%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Skill"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Tabs defaultValue="frontend">
          <TabsList className="mb-6">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="tooling">Tooling</TabsTrigger>
          </TabsList>
          
          {["frontend", "backend", "database", "tooling"].map((category) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle>{category.charAt(0).toUpperCase() + category.slice(1)} Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : getCategorySkills(category).length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No {category} skills added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {getCategorySkills(category).map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-500">{skill.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`${
                                  category === 'frontend' ? 'bg-primary' : 
                                  category === 'backend' ? 'bg-secondary' : 
                                  category === 'database' ? 'bg-blue-600' : 'bg-gray-700'
                                } h-2.5 rounded-full`} 
                                style={{ width: `${skill.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Messages Section
function MessagesSection() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/messages/${id}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message marked as read",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update message",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message deleted",
      });
      setSelectedMessage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.read) {
      await markAsReadMutation.mutateAsync(message.id);
    }
  };
  
  const handleDeleteMessage = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMutation.mutateAsync(id);
    }
  };
  
  // Format date
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const unreadCount = messages?.filter(msg => !msg.read).length || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !messages || messages.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No messages received yet.</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedMessage?.id === message.id 
                        ? 'bg-primary/10' 
                        : message.read 
                          ? 'hover:bg-gray-100' 
                          : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${!message.read ? 'font-semibold' : ''}`}>
                        {message.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedMessage ? (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{selectedMessage.subject}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Received: {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>
              
              <div className="mt-6">
                <Button asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    Reply via Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <i className="fas fa-envelope-open text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Message Selected</h3>
              <p className="text-gray-500">Select a message from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 py-6 text-center">
          Settings functionality will be implemented in a future update.
        </p>
      </CardContent>
    </Card>
  );
}
