// Demo mode API - returns mock data with realistic delays
import {
  categories,
  mockProviders,
  mockBookings,
  mockReviews,
  mockConversations,
  mockMessages,
  mockUsers,
  demoCustomer,
} from './data';
import { Booking, Message, User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const FAKE_LATENCY = 300;

// In-memory state for demo mode mutations
let _bookings = [...mockBookings];
let _messages = [...mockMessages];
let _nextBookingId = 10;
let _nextMessageId = 20;

export const demoAPI = {
  // Auth
  auth: {
    login: async (_email: string, _password: string): Promise<User> => {
      await delay(FAKE_LATENCY);
      return demoCustomer;
    },
    signup: async (_data: Partial<User>): Promise<User> => {
      await delay(FAKE_LATENCY);
      return demoCustomer;
    },
    getUser: async (): Promise<User> => {
      await delay(100);
      return demoCustomer;
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      await delay(FAKE_LATENCY);
      return categories;
    },
  },

  // Providers
  providers: {
    getAll: async () => {
      await delay(FAKE_LATENCY);
      return mockProviders;
    },
    getById: async (id: string) => {
      await delay(FAKE_LATENCY);
      return mockProviders.find(p => p.id === id) ?? null;
    },
    getByCategory: async (categoryId: string) => {
      await delay(FAKE_LATENCY);
      return mockProviders.filter(p => p.categories.includes(categoryId));
    },
    search: async (query: string) => {
      await delay(FAKE_LATENCY);
      const q = query.toLowerCase();
      return mockProviders.filter(
        p =>
          p.businessName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.services.some(s => s.title.toLowerCase().includes(q)),
      );
    },
  },

  // Bookings
  bookings: {
    getByCustomer: async (customerId: string) => {
      await delay(FAKE_LATENCY);
      return _bookings.filter(b => b.customerId === customerId);
    },
    getById: async (id: string) => {
      await delay(FAKE_LATENCY);
      return _bookings.find(b => b.id === id) ?? null;
    },
    create: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
      await delay(FAKE_LATENCY);
      const newBooking: Booking = {
        ...booking,
        id: `b${_nextBookingId++}`,
        createdAt: new Date().toISOString(),
      };
      _bookings = [newBooking, ..._bookings];
      return newBooking;
    },
    updateStatus: async (id: string, status: Booking['status']) => {
      await delay(FAKE_LATENCY);
      _bookings = _bookings.map(b => (b.id === id ? { ...b, status } : b));
      return _bookings.find(b => b.id === id) ?? null;
    },
  },

  // Reviews
  reviews: {
    getByProvider: async (providerId: string) => {
      await delay(FAKE_LATENCY);
      return mockReviews.filter(r => r.providerId === providerId);
    },
  },

  // Messages
  messages: {
    getConversations: async (_userId: string) => {
      await delay(FAKE_LATENCY);
      return mockConversations;
    },
    getMessages: async (conversationId: string) => {
      await delay(FAKE_LATENCY);
      return _messages.filter(m => m.conversationId === conversationId);
    },
    send: async (message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> => {
      await delay(FAKE_LATENCY);
      const newMessage: Message = {
        ...message,
        id: `m${_nextMessageId++}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      _messages = [..._messages, newMessage];
      return newMessage;
    },
  },

  // Users
  users: {
    getById: async (id: string) => {
      await delay(FAKE_LATENCY);
      return mockUsers.find(u => u.id === id) ?? null;
    },
  },
};
