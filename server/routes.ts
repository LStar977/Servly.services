import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertServiceSchema, insertProviderProfileSchema } from "@shared/schema";
import { compare } from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name, username, role, country, province, city } = req.body;
      
      if (!email || !password || !name) {
        res.status(400).json({ message: "Email, password, and name are required" });
        return;
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }
      
      const newUser = await storage.createUser({
        email,
        password,
        name,
        username: username || name.toLowerCase().replace(/\s+/g, ''),
        role: role || 'customer',
        country,
        province,
        city,
      });
      
      // Return user without password
      const safeUser = { ...newUser, password: undefined };
      res.status(201).json({ user: safeUser });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      
      // If user doesn't have a password set (OAuth only), they can't use email/password login
      if (!user.password) {
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
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
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

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
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

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok", message: "Servly API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
