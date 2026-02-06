// Types shared with the web app (adapted from shared/schema.ts and client/src/lib/data.ts)

export type Role = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  bio?: string;
  city?: string;
  province?: string;
  country?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
}

export interface Service {
  id: string;
  providerId?: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'hour' | 'job' | 'visit';
  categoryId: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  phone: string;
  city: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  services: Service[];
  availability: string[];
  imageUrl?: string;
  locationType: 'mobile' | 'location';
  address?: string;
  hoursOfOperation: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  availableSlots: { [dateTime: string]: boolean };
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  categoryId: string;
  dateTime: string;
  address: string;
  notes: string;
  status: 'confirmed' | 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// Navigation param types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  RoleSelection: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  BookingsTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProviderDetail: { providerId: string };
  CategoryProviders: { categoryId: string; categoryName: string };
};

export type SearchStackParamList = {
  Search: undefined;
  ProviderDetail: { providerId: string };
};

export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetail: { bookingId: string };
  NewBooking: { providerId: string; serviceId: string };
};

export type MessagesStackParamList = {
  ConversationsList: undefined;
  Chat: { conversationId: string; participantName: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
};
