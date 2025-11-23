import { type User, type InsertUser, type Booking, type InsertBooking, type Service, type InsertService, type ProviderProfile, type InsertProviderProfile, type Category, type InsertCategory, type PlatformSettings, type InsertPlatformSettings, type Payment, type InsertPayment, type Payout, type InsertPayout, users, bookings, services, providerProfiles, categories, platformSettings, payments, payouts } from "@shared/schema";
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
    const username = user.username || user.email?.split('@')[0] || 'user' + Date.now();
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
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        role: userData.role || 'customer',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return result[0];
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

    let query = db
      .select({
        service: services,
        provider: providerProfiles,
        category: categories,
      })
      .from(services)
      .innerJoin(providerProfiles, eq(services.providerId, providerProfiles.userId))
      .leftJoin(categories, eq(services.categoryId, categories.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    
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
}

export const storage = new DatabaseStorage();
