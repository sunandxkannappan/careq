import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../lib/mockData";
import { User, Appointment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      await delay(300);
      return db.get().user;
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      await delay(500);
      const data = db.get();
      const updatedUser = { ...data.user, ...updates };
      db.save({ user: updatedUser });
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({ title: "Account updated", description: "Your changes have been saved." });
    }
  });
}

export function useWaitlist() {
  return useQuery({
    queryKey: ['waitlist'],
    queryFn: async () => {
      await delay(400);
      return db.get().waitlist;
    }
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      await delay(500);
      return db.get().appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newAppt: Omit<Appointment, "id" | "status">) => {
      await delay(600);
      const data = db.get();
      const appt: Appointment = {
        ...newAppt,
        id: Math.max(0, ...data.appointments.map(a => a.id)) + 1,
        status: "Scheduled"
      };
      db.save({ appointments: [...data.appointments, appt] });
      return appt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: "Appointment Requested", description: "Your request has been sent to the clinic." });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: Partial<Appointment> & { id: number }) => {
      await delay(400);
      const data = db.get();
      const updatedAppts = data.appointments.map(a => 
        a.id === updates.id ? { ...a, ...updates } : a
      );
      db.save({ appointments: updatedAppts });
      return updatedAppts.find(a => a.id === updates.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      if (variables.status === 'Cancelled') {
        toast({ title: "Appointment Cancelled", description: "The appointment has been cancelled." });
      } else {
        toast({ title: "Appointment Updated", description: "Your changes have been saved." });
      }
    }
  });
}

export function useMyResults() {
  return useQuery({
    queryKey: ['myResults'],
    queryFn: async () => {
      await delay(400);
      return db.get().myResults;
    }
  });
}

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      await delay(400);
      return db.get().tasks;
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await delay(300);
      const data = db.get();
      const updatedTasks = data.tasks.map(t => t.id === id ? { ...t, status } : t);
      db.save({ tasks: updatedTasks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      await delay(500);
      return db.get().resources;
    }
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      await delay(300);
      return db.get().faqs;
    }
  });
}
