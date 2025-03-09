import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Extended schema with validation
const contactFormSchema = insertMessageSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/profile"],
  });
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const messageMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. I'll get back to you soon!",
      });
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    await messageMutation.mutateAsync(data);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-accent text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a project in mind or want to discuss a collaboration? I'd love to hear from you!
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <p className="text-gray-600 mb-6">Feel free to reach out through the form or via the contact details below.</p>
                  
                  <ul className="space-y-4">
                    {isUserLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="flex items-start">
                          <Skeleton className="h-5 w-5 mt-1.5" />
                          <Skeleton className="ml-4 h-5 w-full" />
                        </li>
                      ))
                    ) : (
                      <>
                        {user?.email && (
                          <li className="flex items-start">
                            <i className="fas fa-envelope mt-1.5 text-primary"></i>
                            <a href={`mailto:${user.email}`} className="ml-4 text-gray-700 hover:text-primary transition-colors">
                              {user.email}
                            </a>
                          </li>
                        )}
                        
                        {user?.phone && (
                          <li className="flex items-start">
                            <i className="fas fa-phone-alt mt-1.5 text-primary"></i>
                            <a href={`tel:${user.phone}`} className="ml-4 text-gray-700 hover:text-primary transition-colors">
                              {user.phone}
                            </a>
                          </li>
                        )}
                        
                        {user?.location && (
                          <li className="flex items-start">
                            <i className="fas fa-map-marker-alt mt-1.5 text-primary"></i>
                            <span className="ml-4 text-gray-700">{user.location}</span>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Availability</h3>
                  <p className="text-gray-600 mb-2">Currently available for:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <i className="fas fa-check text-secondary mr-2"></i>
                      Freelance projects
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-secondary mr-2"></i>
                      Contract work
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-secondary mr-2"></i>
                      Technical consulting
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-secondary mr-2"></i>
                      Speaking engagements
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
                      placeholder="Your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    {...register("subject")}
                    className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
                    placeholder="Your message"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
