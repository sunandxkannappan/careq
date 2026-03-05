import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // User Routes
  app.get(api.user.get.path, async (_req, res) => {
    const user = await storage.getUser();
    res.json(user);
  });

  app.patch(api.user.update.path, async (req, res) => {
    const user = await storage.updateUser(req.body);
    res.json(user);
  });

  // Appointments Routes
  app.get(api.appointments.list.path, async (_req, res) => {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.patch(api.appointments.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const appointment = await storage.updateAppointmentStatus(id, req.body.status);
    res.json(appointment);
  });

  // Tasks Routes
  app.get(api.tasks.list.path, async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.patch(api.tasks.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await storage.updateTaskStatus(id, req.body.status);
    res.json(task);
  });

  // Waitlist Route
  app.get(api.waitlist.get.path, async (_req, res) => {
    const status = await storage.getWaitlistStatus();
    res.json(status);
  });

  // Results Route
  app.get(api.results.list.path, async (_req, res) => {
    const results = await storage.getMedicalResults();
    res.json(results);
  });

  // Resources Route
  app.get(api.resources.list.path, async (_req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  return httpServer;
}
