// API client for Servly backend
const API_BASE = '/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data.user;
  },

  signup: async (userData: { username?: string; email: string; password: string; name: string; role: 'customer' | 'provider' | 'admin'; country?: string; province?: string; city?: string }) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data.user;
  },

  getUser: async (id: string) => {
    const res = await fetch(`${API_BASE}/users/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },

  updateUser: async (id: string, updates: any) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user');
    return data.user;
  },

  claimAdmin: async () => {
    const res = await fetch(`${API_BASE}/auth/claim-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to claim admin');
    return data.user;
  },
};

// Categories
export const categoryAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
    return data.categories || [];
  },
};

// Providers
export const providerAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/providers`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch providers');
    return data.providers || [];
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/providers/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Provider not found');
    return data.provider;
  },

  create: async (profile: any) => {
    const res = await fetch(`${API_BASE}/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create provider');
    return data.provider;
  },

  update: async (id: string, updates: any) => {
    const res = await fetch(`${API_BASE}/providers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update provider');
    return data.provider;
  },

  getServices: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/providers/${providerId}/services`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch services');
    return data.services || [];
  },

  getBookings: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/providers/${providerId}/bookings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
    return data.bookings || [];
  },

  getPayouts: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/providers/${providerId}/payouts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch payouts');
    return data.payouts || [];
  },
};

// Admin
export const adminAPI = {
  getPlatformSettings: async () => {
    const res = await fetch(`${API_BASE}/admin/settings`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch settings');
    return data.settings;
  },

  updatePlatformSettings: async (settings: any) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data.settings;
  },
};

// Services
export const serviceAPI = {
  create: async (service: any) => {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create service');
    return data.service;
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete service');
    return data;
  },
};

// Bookings
export const bookingAPI = {
  create: async (booking: any) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create booking');
    return data.booking;
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Booking not found');
    return data.booking;
  },

  getByCustomer: async (userId: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}/bookings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
    return data.bookings || [];
  },

  updateStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update booking');
    return data.booking;
  },

  createPaymentIntent: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create payment intent');
    return data;
  },

  confirmPayment: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to confirm payment');
    return data.booking;
  },

  completeBooking: async (bookingId: string) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete booking');
    return data;
  },

  getPayouts: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/providers/${providerId}/payouts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch payouts');
    return data.payouts || [];
  },
};

// Reviews
export const reviewAPI = {
  create: async (review: any) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create review');
    return data.review;
  },

  getByProviderId: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/providers/${providerId}/reviews`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews');
    return data.reviews || [];
  },
};

// Messages
export const messageAPI = {
  send: async (message: any) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data.message;
  },

  getConversation: async (conversationId: string) => {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch conversation');
    return data.messages || [];
  },

  getUserConversations: async (userId: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}/conversations`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch conversations');
    return data.conversations || [];
  },

  markAsRead: async (conversationId: string, userId: string) => {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to mark as read');
    return data;
  },
};

// Documents & Verification
export const documentAPI = {
  upload: async (document: any) => {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(document),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload document');
    return data.document;
  },

  getByProviderId: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/documents?providerId=${providerId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch documents');
    return data.documents || [];
  },

  getPendingProviders: async () => {
    const res = await fetch(`${API_BASE}/admin/verification/pending`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch pending providers');
    return data.providers || [];
  },

  approveProvider: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/admin/verification/approve/${providerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to approve provider');
    return data.provider;
  },

  rejectProvider: async (providerId: string) => {
    const res = await fetch(`${API_BASE}/admin/verification/reject/${providerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reject provider');
    return data.provider;
  },
};

// Notifications
export const notificationAPI = {
  getNotifications: async (userId: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}/notifications`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
    return data.notifications || [];
  },

  getPreferences: async (userId: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}/notification-preferences`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch preferences');
    return data.preferences || {};
  },

  updatePreferences: async (userId: string, preferences: any) => {
    const res = await fetch(`${API_BASE}/users/${userId}/notification-preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update preferences');
    return data.preferences;
  },
};
