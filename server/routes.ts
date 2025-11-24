import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertBookingSchema, insertServiceSchema, insertProviderProfileSchema, type InsertNotificationPreferences } from "@shared/schema";
import { compare } from "bcryptjs";
import Stripe from "stripe";

// Initialize Stripe client
const getStripeClient = async () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(secretKey, { apiVersion: "2024-12-18" as any });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current authenticated user
  app.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      
      const user = req.user as any;
      if (user.claims) {
        // OAuth user
        const dbUser = await storage.getUser(user.claims.sub);
        if (dbUser) {
          return res.json({ ...dbUser, password: undefined });
        }
      }
      
      // Session user
      res.json(user);
    } catch (error: any) {
      console.error("Get auth user error:", error);
      res.status(400).json({ message: error.message || "Failed to fetch user" });
    }
  });

  // Legacy email/password signup (for backwards compatibility)
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
      
      // Establish session for new user
      req.login(newUser, (err) => {
        if (err) {
          console.error("Session error:", err);
          res.status(400).json({ message: "Account created but session failed" });
          return;
        }
        const safeUser = { ...newUser, password: undefined };
        res.status(201).json({ user: safeUser });
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  // Legacy email/password login (for backwards compatibility)
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
      
      if (!user.password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      
      const isValid = await compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          res.status(400).json({ message: "Failed to establish session" });
          return;
        }
        res.json({ user: { ...user, password: undefined } });
      });
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

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json({ providers });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getProviderProfile(req.params.id);
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/providers/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const profile = await storage.createOrUpdateProviderProfile({
        providerId: userId,
        ...req.body,
      });
      res.json({ profile });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Services
  app.post("/api/services", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService({
        ...validatedData,
        providerId: userId,
      });
      res.status(201).json({ service });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json({ services });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bookings
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const validatedData = insertBookingSchema.parse({
        ...req.body,
        customerId: userId,
      });
      const booking = await storage.createBooking(validatedData);
      res.status(201).json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const bookings = await storage.getBookingsByUser(userId);
      res.json({ bookings });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews
  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const review = await storage.createReview({
        ...req.body,
        reviewerId: userId,
      });
      res.status(201).json({ review });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/reviews/:providerId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByProvider(req.params.providerId);
      res.json({ reviews });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Messages
  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const message = await storage.createMessage({
        ...req.body,
        senderId: userId,
      });
      res.status(201).json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/messages/:conversationId", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getConversationMessages(req.params.conversationId);
      res.json({ messages });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Verification
  app.post("/api/documents/upload", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const document = await storage.uploadDocument({
        providerId: userId,
        ...req.body,
      });
      res.status(201).json({ document });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/verification/pending", isAuthenticated, async (req, res) => {
    try {
      if ((req.user as any).role !== 'admin') {
        res.status(403).json({ message: "Admin access required" });
        return;
      }
      const providers = await storage.getPendingVerifications();
      res.json({ providers });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/verification/approve/:providerId", isAuthenticated, async (req, res) => {
    try {
      if ((req.user as any).role !== 'admin') {
        res.status(403).json({ message: "Admin access required" });
        return;
      }
      const provider = await storage.approveProvider(req.params.providerId);
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/verification/reject/:providerId", isAuthenticated, async (req, res) => {
    try {
      if ((req.user as any).role !== 'admin') {
        res.status(403).json({ message: "Admin access required" });
        return;
      }
      const provider = await storage.rejectProvider(req.params.providerId, req.body.reason);
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notifications
  app.get("/api/notifications/preferences", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const preferences = await storage.getNotificationPreferences(userId);
      res.json({ preferences });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/preferences", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const preferences = await storage.updateNotificationPreferences(userId, req.body as InsertNotificationPreferences);
      res.json({ preferences });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
      const notifications = await storage.getNotifications(userId);
      res.json({ notifications });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe Payment Routes
  app.post("/api/payments/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      const stripe = await getStripeClient();
      const { amount, bookingId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        metadata: { bookingId },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Payment failed" });
    }
  });

  app.post("/api/payments/confirm", isAuthenticated, async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await storage.updateBooking(bookingId, { paymentStatus: 'completed' });
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Claim admin
  app.post("/api/auth/claim-admin", async (req, res) => {
    try {
      let userEmail = null;
      let userId = null;

      if ((req.user as any)?.claims?.email) {
        userEmail = (req.user as any).claims.email;
        userId = (req.user as any).claims.sub;
      } else if ((req.user as any)?.email) {
        userEmail = (req.user as any).email;
        userId = (req.user as any).id;
      }
      
      if (!userEmail || !userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      
      const adminEmail = "sservly@gmail.com";
      if (userEmail !== adminEmail) {
        res.status(403).json({ message: "Only the admin email can claim admin access" });
        return;
      }
      
      const updatedUser = await storage.updateUser(userId, { role: 'admin' });
      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error: any) {
      console.error("Claim admin error:", error);
      res.status(400).json({ message: error.message || "Failed to claim admin" });
    }
  });

  // Admin Settings Routes
  app.get("/api/admin/settings", async (req, res) => {
    try {
      if (!req.user || (req.user as any).role !== 'admin') {
        res.status(403).json({ message: "Unauthorized: Admin access required" });
        return;
      }
      const settings = await storage.getPlatformSettings();
      res.json({ settings });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/settings", async (req, res) => {
    try {
      if (!req.user || (req.user as any).role !== 'admin') {
        res.status(403).json({ message: "Unauthorized: Admin access required" });
        return;
      }
      const { feePercentage, basicMonthlyPrice, proMonthlyPrice, premiumMonthlyPrice } = req.body;
      const settings = await storage.updatePlatformSettings({
        feePercentage,
        basicMonthlyPrice,
        proMonthlyPrice,
        premiumMonthlyPrice,
      });
      res.json({ settings });
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
