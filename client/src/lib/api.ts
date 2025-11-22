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
};
