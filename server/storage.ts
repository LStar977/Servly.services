import { type User, type InsertUser, type Booking, type InsertBooking, type Service, type InsertService, type ProviderProfile, type InsertProviderProfile, type Category, type InsertCategory, users, bookings, services, providerProfiles, categories } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
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
}

export const storage = new DatabaseStorage();
