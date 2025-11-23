import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
      
      // Establish session for email/password login
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

  // Get current authenticated user from session
  app.get("/api/auth/me", async (req, res) => {
    try {
      // Check if user is authenticated via OAuth session
      if (req.user && (req.user as any).claims) {
        const oauthUser = req.user as any;
        const dbUser = await storage.getUserByEmail(oauthUser.claims.email);
        if (dbUser) {
          // Construct name from firstName/lastName if name is not set
          const userName = dbUser.name || `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim();
          return res.json({ user: { ...dbUser, name: userName, password: undefined } });
        }
      }
      // Check if user is authenticated via email/password (check session cookie)
      if (req.user) {
        return res.json({ user: req.user });
      }
      res.status(401).json({ message: "Not authenticated" });
    } catch (error: any) {
      console.error("Get current user error:", error);
      res.status(400).json({ message: error.message || "Failed to fetch user" });
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

  app.get("/api/services/search", async (req, res) => {
    try {
      const { category, city, minPrice, maxPrice, search } = req.query;
      const filters = {
        category: category as string | undefined,
        city: city as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string | undefined,
      };
      const results = await storage.searchServices(filters);
      res.json({ services: results });
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
      const { customerId, providerId, serviceId, categoryId, dateTime, address, notes, totalAmount } = req.body;

      if (!customerId || !providerId || !serviceId || !totalAmount) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const settings = await storage.getPlatformSettings();
      const feePercentage = parseFloat(settings.feePercentage.toString()) / 100;
      const platformFee = parseFloat(totalAmount) * feePercentage;
      const providerEarnings = parseFloat(totalAmount) - platformFee;

      const bookingData = {
        customerId,
        providerId,
        serviceId,
        categoryId,
        dateTime: new Date(dateTime),
        address,
        notes: notes || "",
        status: "confirmed" as const,
        totalAmount: totalAmount.toString(),
        platformFee: platformFee.toFixed(2),
        providerEarnings: providerEarnings.toFixed(2),
        paymentStatus: "pending" as const,
        stripePaymentIntentId: undefined,
      };

      const booking = await storage.createBooking(bookingData as any);
      res.json({ booking });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Booking failed" });
    }
  });

  // Stripe payment intent creation
  app.post("/api/bookings/:bookingId/payment-intent", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      const stripe = await getStripeClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(booking.totalAmount) * 100),
        currency: "usd",
        metadata: {
          bookingId,
          customerId: booking.customerId,
          providerId: booking.providerId,
        },
      });

      await storage.updateBookingPaymentStatus(bookingId, "pending", paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Confirm payment
  app.post("/api/bookings/:bookingId/confirm-payment", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      if (!booking.stripePaymentIntentId) {
        res.status(400).json({ message: "No payment intent found" });
        return;
      }

      const stripe = await getStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripePaymentIntentId);

      if (paymentIntent.status === "succeeded") {
        await storage.updateBookingPaymentStatus(bookingId, "paid", paymentIntent.id);
        await storage.createPayment({
          bookingId,
          stripePaymentIntentId: paymentIntent.id,
          customerId: booking.customerId,
          amount: booking.totalAmount,
          platformFee: booking.platformFee,
          providerEarnings: booking.providerEarnings,
          status: "succeeded",
        });

        const updatedBooking = await storage.getBooking(bookingId);
        res.json({ booking: updatedBooking, message: "Payment successful" });
      } else {
        res.status(400).json({ message: `Payment ${paymentIntent.status}` });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Complete booking and initiate payout
  app.post("/api/bookings/:bookingId/complete", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      if (booking.paymentStatus !== "paid") {
        res.status(400).json({ message: "Payment not completed" });
        return;
      }

      await storage.updateBookingStatus(bookingId, "completed");
      
      const payout = await storage.createPayout({
        providerId: booking.providerId,
        bookingId,
        amount: booking.providerEarnings,
        status: "pending",
      });

      res.json({ booking: { ...booking, status: "completed" }, payout });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get provider payouts
  app.get("/api/providers/:providerId/payouts", async (req, res) => {
    try {
      const payouts = await storage.getPayoutsByProviderId(req.params.providerId);
      res.json({ payouts });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create review
  app.post("/api/reviews", async (req, res) => {
    try {
      const { providerId, customerId, bookingId, rating, comment } = req.body;
      if (!providerId || !customerId || !bookingId || rating === undefined) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const review = await storage.createReview({
        providerId,
        customerId,
        bookingId,
        rating,
        comment,
      });
      res.status(201).json({ review });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get reviews for provider
  app.get("/api/providers/:providerId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByProviderId(req.params.providerId);
      res.json({ reviews });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Send message
  app.post("/api/messages", async (req, res) => {
    try {
      const { conversationId, senderId, receiverId, bookingId, message: messageText } = req.body;
      if (!conversationId || !senderId || !receiverId || !messageText) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const message = await storage.sendMessage({
        conversationId,
        senderId,
        receiverId,
        bookingId,
        message: messageText,
        isRead: false,
      });
      res.status(201).json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get conversation messages
  app.get("/api/conversations/:conversationId", async (req, res) => {
    try {
      const messages = await storage.getConversation(req.params.conversationId);
      res.json({ messages });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all conversations for a user
  app.get("/api/users/:userId/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.params.userId);
      res.json({ conversations });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Mark conversation as read
  app.patch("/api/conversations/:conversationId/read", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: "Missing userId" });
        return;
      }
      await storage.markAsRead(req.params.conversationId, userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Upload provider document
  app.post("/api/documents", async (req, res) => {
    try {
      const { providerId, filename, documentType, fileUrl } = req.body;
      if (!providerId || !filename || !documentType || !fileUrl) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const document = await storage.uploadDocument({
        providerId,
        filename,
        documentType,
        fileUrl,
      });
      res.status(201).json({ document });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get documents for a provider
  app.get("/api/providers/:providerId/documents", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByProviderId(req.params.providerId);
      res.json({ documents });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get pending providers (admin only)
  app.get("/api/admin/pending-providers", async (req, res) => {
    try {
      const providers = await storage.getPendingProviders();
      res.json({ providers });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Approve provider (admin only)
  app.patch("/api/admin/providers/:providerId/approve", async (req, res) => {
    try {
      const provider = await storage.approveProvider(req.params.providerId);
      if (!provider) {
        res.status(404).json({ message: "Provider not found" });
        return;
      }
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reject provider (admin only)
  app.patch("/api/admin/providers/:providerId/reject", async (req, res) => {
    try {
      const provider = await storage.rejectProvider(req.params.providerId);
      if (!provider) {
        res.status(404).json({ message: "Provider not found" });
        return;
      }
      res.json({ provider });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get notifications for user
  app.get("/api/users/:userId/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUserId(req.params.userId);
      res.json({ notifications });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get notification preferences
  app.get("/api/users/:userId/notification-preferences", async (req, res) => {
    try {
      const prefs = await storage.getNotificationPreferences(req.params.userId);
      res.json({ preferences: prefs || {} });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update notification preferences
  app.patch("/api/users/:userId/notification-preferences", async (req, res) => {
    try {
      const { emailBookings, emailPayments, emailMessages, smsBookings, smsPayments, smsMessages } = req.body;
      const prefs = await storage.upsertNotificationPreferences(req.params.userId, {
        emailBookings: emailBookings !== undefined ? emailBookings : true,
        emailPayments: emailPayments !== undefined ? emailPayments : true,
        emailMessages: emailMessages !== undefined ? emailMessages : true,
        smsBookings: smsBookings !== undefined ? smsBookings : false,
        smsPayments: smsPayments !== undefined ? smsPayments : false,
        smsMessages: smsMessages !== undefined ? smsMessages : false,
      } as InsertNotificationPreferences);
      res.json({ preferences: prefs });
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

  // Claim Admin Route
  app.post("/api/auth/claim-admin", async (req, res) => {
    try {
      let userEmail: string | null = null;
      let userId: string | null = null;
      
      // Check if user is authenticated via OAuth session
      if (req.user && (req.user as any).claims) {
        const oauthUser = req.user as any;
        userEmail = oauthUser.claims.email;
        if (userEmail) {
          const dbUser = await storage.getUserByEmail(userEmail);
          if (dbUser) {
            userId = dbUser.id;
          }
        }
      }
      // Check if user is authenticated via email/password (check session)
      else if (req.user && (req.user as any).email) {
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
      // Check if user is admin
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
      // Check if user is admin
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
