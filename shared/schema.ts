import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sessions table (for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password"), // Optional for OAuth users
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("customer"), // 'customer', 'provider', 'admin'
  avatar: text("avatar"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  bio: text("bio"),
  country: text("country"),
  province: text("province"), // province/state
  city: text("city"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6).optional(),
  username: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  image: text("image"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  priceUnit: text("price_unit").notNull(), // 'hour', 'job', 'visit'
  categoryId: varchar("category_id").notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Provider Profiles table
export const providerProfiles = pgTable("provider_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  businessName: text("business_name").notNull(),
  description: text("description"),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  categories: text("categories").array(),
  imageUrl: text("image_url"),
  locationType: text("location_type").default("mobile"), // 'mobile' or 'location'
  address: text("address"),
  hoursOfOperation: jsonb("hours_of_operation"),
  availableSlots: jsonb("available_slots"),
  appointmentIntervalMinutes: integer("appointment_interval_minutes").default(60), // 30, 60, 90, etc
  verificationStatus: text("verification_status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  verificationEmailSent: boolean("verification_email_sent").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProviderProfileSchema = createInsertSchema(providerProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertProviderProfile = z.infer<typeof insertProviderProfileSchema>;
export type ProviderProfile = typeof providerProfiles.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  providerId: varchar("provider_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  dateTime: timestamp("date_time").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("confirmed"), // 'confirmed', 'accepted', 'declined', 'completed', 'cancelled'
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  providerEarnings: numeric("provider_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Platform Settings table
export const platformSettings = pgTable("platform_settings", {
  id: varchar("id").primaryKey().default("main"),
  feePercentage: numeric("fee_percentage", { precision: 5, scale: 2 }).notNull().default("15"), // Fee percentage platform takes from jobs
  basicMonthlyPrice: numeric("basic_monthly_price", { precision: 10, scale: 2 }).notNull().default("9.99"),
  proMonthlyPrice: numeric("pro_monthly_price", { precision: 10, scale: 2 }).notNull().default("29.99"),
  premiumMonthlyPrice: numeric("premium_monthly_price", { precision: 10, scale: 2 }).notNull().default("99.99"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlatformSettingsSchema = createInsertSchema(platformSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertPlatformSettings = z.infer<typeof insertPlatformSettingsSchema>;
export type PlatformSettings = typeof platformSettings.$inferSelect;

// Payments table - tracks all payment transactions
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").notNull().unique(),
  customerId: varchar("customer_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }).notNull(),
  providerEarnings: numeric("provider_earnings", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'succeeded', 'failed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Payouts table - tracks provider payouts after job completion
export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull(),
  bookingId: varchar("booking_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'failed'
  stripeTransferId: varchar("stripe_transfer_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type Payout = typeof payouts.$inferSelect;

// Reviews table - stores customer reviews and ratings for providers
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull(),
  customerId: varchar("customer_id").notNull(),
  bookingId: varchar("booking_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Messages table - stores in-app chat messages between customers and providers
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(), // Format: "customer_id-provider_id" (sorted)
  senderId: varchar("sender_id").notNull(), // User ID
  receiverId: varchar("receiver_id").notNull(), // User ID
  bookingId: varchar("booking_id"), // Optional: related booking
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Documents table - stores uploaded provider documents for verification
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull(), // Provider profile ID
  filename: text("filename").notNull(),
  documentType: text("document_type").notNull(), // 'license', 'insurance', 'id', 'other'
  fileUrl: text("file_url").notNull(), // Base64 encoded file data
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
