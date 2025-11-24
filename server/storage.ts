import { type User, type InsertUser, type Booking, type InsertBooking, type Service, type InsertService, type ProviderProfile, type InsertProviderProfile, type Category, type InsertCategory, type PlatformSettings, type InsertPlatformSettings, type Payment, type InsertPayment, type Payout, type InsertPayout, type Review, type InsertReview, type Message, type InsertMessage, type Document, type InsertDocument, type Notification, type InsertNotification, type NotificationPreferences, type InsertNotificationPreferences, users, sessions, bookings, services, providerProfiles, categories, platformSettings, payments, payouts, reviews, messages, documents, notifications, notificationPreferences } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, gte, lte } from "drizzle-orm";
import { hash, compare } from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: any): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  
  // Services
  getServicesByProviderId(providerId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  deleteService(id: string): Promise<void>;
  searchServices(filters: {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Array<Service & { provider: ProviderProfile; categoryName?: string }>>;

  // Provider Profiles
  getProviderProfile(userId: string): Promise<ProviderProfile | undefined>;
  getProviderById(id: string): Promise<ProviderProfile | undefined>;
  getAllProviders(): Promise<ProviderProfile[]>;
  createProviderProfile(profile: InsertProviderProfile): Promise<ProviderProfile>;
  updateProviderProfile(id: string, updates: Partial<ProviderProfile>): Promise<ProviderProfile | undefined>;

  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByCustomerId(customerId: string): Promise<Booking[]>;
  getBookingsByProviderId(providerId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  updateBookingPaymentStatus(id: string, paymentStatus: string, stripePaymentIntentId?: string): Promise<Booking | undefined>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByStripeIntentId(stripePaymentIntentId: string): Promise<Payment | undefined>;

  // Payouts
  createPayout(payout: InsertPayout): Promise<Payout>;
  getPayoutsByProviderId(providerId: string): Promise<Payout[]>;

  // Platform Settings
  getPlatformSettings(): Promise<PlatformSettings>;
  updatePlatformSettings(updates: Partial<InsertPlatformSettings>): Promise<PlatformSettings>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByProviderId(providerId: string): Promise<Review[]>;

  // Messages
  sendMessage(message: InsertMessage): Promise<Message>;
  getConversation(conversationId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<Array<{ conversationId: string; lastMessage: Message; unreadCount: number }>>;
  markAsRead(conversationId: string, receiverId: string): Promise<void>;

  // Documents & Verification
  uploadDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByProviderId(providerId: string): Promise<Document[]>;
  getPendingProviders(): Promise<Array<ProviderProfile & { documentCount: number }>>;
  approveProvider(providerId: string): Promise<ProviderProfile | undefined>;
  rejectProvider(providerId: string): Promise<ProviderProfile | undefined>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  upsertNotificationPreferences(userId: string, prefs: InsertNotificationPreferences): Promise<NotificationPreferences>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    let hashedPassword: string | null = null;
    if (user.password && typeof user.password === 'string') {
      hashedPassword = await hash(user.password, 10);
    }
    
    // Generate unique username - use email prefix + random number to ensure uniqueness
    let baseUsername = user.username || user.email?.split('@')[0] || 'user';
    let username = baseUsername;
    let counter = 1;
    
    // Check if username already exists and add suffix if needed
    while (await this.getUserByUsername(username)) {
      username = `${baseUsername}${Math.random().toString(36).substring(2, 8)}`;
    }
    
    const result = await db.insert(users).values({
      username,
      email: user.email,
      name: user.name || '',
      role: user.role || 'customer',
      password: hashedPassword,
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async upsertUser(userData: any): Promise<User> {
    // First check if user with this email already exists
    if (userData.email) {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        // Update existing user
        return await this.updateUser(existingUser.id, {
          firstName: userData.firstName || existingUser.firstName,
          lastName: userData.lastName || existingUser.lastName,
          profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
          name: userData.name || existingUser.name,
        }) || existingUser;
      }
    }

    // Create new user if doesn't exist
    const result = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        name: userData.name || '',
        role: userData.role || 'customer',
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    // Delete related records first to maintain referential integrity
    // Note: Sessions are managed by express-session and will naturally expire
    await db.delete(providerProfiles).where(eq(providerProfiles.userId, id));
    await db.delete(bookings).where(or(eq(bookings.customerId, id), eq(bookings.providerId, id)));
    await db.delete(services).where(eq(services.providerId, id));
    await db.delete(reviews).where(or(eq(reviews.providerId, id), eq(reviews.customerId, id)));
    await db.delete(messages).where(or(eq(messages.senderId, id), eq(messages.receiverId, id)));
    await db.delete(documents).where(eq(documents.providerId, id));
    await db.delete(notifications).where(eq(notifications.userId, id));
    await db.delete(notificationPreferences).where(eq(notificationPreferences.userId, id));
    await db.delete(payments).where(eq(payments.userId, id));
    await db.delete(payouts).where(eq(payouts.providerId, id));
    // Finally, delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getServicesByProviderId(providerId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.providerId, providerId));
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async searchServices(filters: {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Array<Service & { provider: ProviderProfile; categoryName?: string }>> {
    const conditions = [];

    if (filters.category) {
      conditions.push(eq(services.categoryId, filters.category));
    }

    if (filters.city) {
      conditions.push(like(providerProfiles.city, `%${filters.city}%`));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(services.price, filters.minPrice.toString()));
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(services.price, filters.maxPrice.toString()));
    }

    if (filters.search) {
      conditions.push(
        or(
          like(services.title, `%${filters.search}%`),
          like(services.description, `%${filters.search}%`),
          like(providerProfiles.businessName, `%${filters.search}%`)
        )
      );
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        service: services,
        provider: providerProfiles,
        category: categories,
      })
      .from(services)
      .innerJoin(providerProfiles, eq(services.providerId, providerProfiles.userId))
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .where(whereCondition);
    
    return results.map(result => ({
      ...result.service,
      provider: result.provider,
      categoryName: result.category?.name,
    }));
  }

  async getProviderProfile(userId: string): Promise<ProviderProfile | undefined> {
    const result = await db.select().from(providerProfiles).where(eq(providerProfiles.userId, userId));
    return result[0];
  }

  async getProviderById(id: string): Promise<ProviderProfile | undefined> {
    const result = await db.select().from(providerProfiles).where(eq(providerProfiles.id, id));
    return result[0];
  }

  async getAllProviders(): Promise<ProviderProfile[]> {
    return await db.select().from(providerProfiles);
  }

  async createProviderProfile(profile: InsertProviderProfile): Promise<ProviderProfile> {
    const result = await db.insert(providerProfiles).values(profile).returning();
    return result[0];
  }

  async updateProviderProfile(id: string, updates: Partial<ProviderProfile>): Promise<ProviderProfile | undefined> {
    const result = await db.update(providerProfiles).set(updates).where(eq(providerProfiles.id, id)).returning();
    return result[0];
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async getBookingsByProviderId(providerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.providerId, providerId));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const result = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async updateBookingPaymentStatus(id: string, paymentStatus: string, stripePaymentIntentId?: string): Promise<Booking | undefined> {
    const updates: any = { paymentStatus };
    if (stripePaymentIntentId) {
      updates.stripePaymentIntentId = stripePaymentIntentId;
    }
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async getPaymentByStripeIntentId(stripePaymentIntentId: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.stripePaymentIntentId, stripePaymentIntentId));
    return result[0];
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const result = await db.insert(payouts).values(payout).returning();
    return result[0];
  }

  async getPayoutsByProviderId(providerId: string): Promise<Payout[]> {
    return await db.select().from(payouts).where(eq(payouts.providerId, providerId));
  }

  async getPlatformSettings(): Promise<PlatformSettings> {
    const result = await db.select().from(platformSettings).where(eq(platformSettings.id, "main"));
    return result[0] || {
      id: "main",
      feePercentage: "15",
      basicMonthlyPrice: "9.99",
      proMonthlyPrice: "29.99",
      premiumMonthlyPrice: "99.99",
      updatedAt: new Date(),
    };
  }

  async updatePlatformSettings(updates: Partial<InsertPlatformSettings>): Promise<PlatformSettings> {
    const result = await db
      .update(platformSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(platformSettings.id, "main"))
      .returning();
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async getReviewsByProviderId(providerId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.providerId, providerId));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getConversation(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async getConversations(userId: string): Promise<Array<{ conversationId: string; lastMessage: Message; unreadCount: number }>> {
    const allMessages = await db.select().from(messages).where(
      or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
    );
    
    const conversationMap = new Map<string, Message[]>();
    allMessages.forEach(msg => {
      const msgs = conversationMap.get(msg.conversationId) || [];
      msgs.push(msg);
      conversationMap.set(msg.conversationId, msgs);
    });

    return Array.from(conversationMap.entries()).map(([conversationId, msgs]) => ({
      conversationId,
      lastMessage: msgs[msgs.length - 1],
      unreadCount: msgs.filter(m => m.receiverId === userId && !m.isRead).length,
    }));
  }

  async markAsRead(conversationId: string, receiverId: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.conversationId, conversationId), eq(messages.receiverId, receiverId)));
  }

  async uploadDocument(document: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }

  async getDocumentsByProviderId(providerId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.providerId, providerId));
  }

  async getPendingProviders(): Promise<Array<ProviderProfile & { documentCount: number }>> {
    const pending = await db.select().from(providerProfiles).where(eq(providerProfiles.verificationStatus, "pending"));
    
    const result = await Promise.all(
      pending.map(async (provider) => {
        const docs = await db.select().from(documents).where(eq(documents.providerId, provider.id));
        return { ...provider, documentCount: docs.length };
      })
    );
    
    return result;
  }

  async approveProvider(providerId: string): Promise<ProviderProfile | undefined> {
    const result = await db.update(providerProfiles)
      .set({ verificationStatus: "approved" })
      .where(eq(providerProfiles.id, providerId))
      .returning();
    return result[0];
  }

  async rejectProvider(providerId: string): Promise<ProviderProfile | undefined> {
    const result = await db.update(providerProfiles)
      .set({ verificationStatus: "rejected" })
      .where(eq(providerProfiles.id, providerId))
      .returning();
    return result[0];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(notifications.createdAt);
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    const result = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId));
    return result[0];
  }

  async upsertNotificationPreferences(userId: string, prefs: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const existing = await this.getNotificationPreferences(userId);
    if (existing) {
      const result = await db.update(notificationPreferences)
        .set({ 
          emailBookings: prefs.emailBookings,
          emailPayments: prefs.emailPayments,
          emailMessages: prefs.emailMessages,
          smsBookings: prefs.smsBookings,
          smsPayments: prefs.smsPayments,
          smsMessages: prefs.smsMessages,
          updatedAt: new Date() 
        })
        .where(eq(notificationPreferences.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(notificationPreferences).values({ 
        userId,
        emailBookings: prefs.emailBookings,
        emailPayments: prefs.emailPayments,
        emailMessages: prefs.emailMessages,
        smsBookings: prefs.smsBookings,
        smsPayments: prefs.smsPayments,
        smsMessages: prefs.smsMessages,
      }).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
