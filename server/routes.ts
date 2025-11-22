import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertServiceSchema, insertProviderProfileSchema } from "@shared/schema";
import { compare } from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }
      const user = await storage.createUser(data);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      const isValid = await compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Categories Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const cats = await storage.getCategories();
      res.json({ categories: cats });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Providers Routes
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getAllProviders();
      res.json({ providers });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getProviderById(req.params.id);
      if (!provider) {
        res.status(404).json({ message: "Provider not found" });
        return;
      }
      const providerServices = await storage.getServicesByProviderId(req.params.id);
      res.json({ provider: { ...provider, services: providerServices } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/providers", async (req, res) => {
    try {
      const data = insertProviderProfileSchema.parse(req.body);
      const provider = await storage.createProviderProfile(data);
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.updateProviderProfile(req.params.id, req.body);
      if (!provider) {
        res.status(404).json({ message: "Provider not found" });
        return;
      }
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Services Routes
  app.get("/api/providers/:providerId/services", async (req, res) => {
    try {
      const services = await storage.getServicesByProviderId(req.params.providerId);
      res.json({ services });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.json({ service });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ message: "Service deleted" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bookings Routes
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const userBookings = await storage.getBookingsByCustomerId(req.params.userId);
      res.json({ bookings: userBookings });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/providers/:providerId/bookings", async (req, res) => {
    try {
      const providerBookings = await storage.getBookingsByProviderId(req.params.providerId);
      res.json({ bookings: providerBookings });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
