// Mock Data Store for Servly MVP
import homeCleaningImg from '@assets/stock_images/professional_home_cl_dde5b4d2.jpg';
import plumbingImg from '@assets/stock_images/plumber_fixing_a_sin_de17ac31.jpg';
import electricalImg from '@assets/stock_images/electrician_working__f2fb3e06.jpg';
import landscapingImg from '@assets/stock_images/landscaper_mowing_a__44e94b83.jpg';
import movingImg from '@assets/stock_images/professional_movers__56531fe2.jpg';
import automotiveImg from '@assets/stock_images/mechanic_working_on__0b2bfa93.jpg';
import snowRemovalImg from '@assets/stock_images/person_shoveling_sno_83d351ec.jpg';
import petServicesImg from '@assets/stock_images/dog_walker_walking_m_ff2b0b08.jpg';

export type Role = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  avatar?: string;
}

export interface Service {
  id: string;
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
  availability: string[]; // e.g., ["Mon", "Tue", "Wed"]
  imageUrl?: string;
  locationType: 'mobile' | 'location'; // 'mobile' = comes to you, 'location' = you go to them
  address?: string; // For 'location' type
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
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  image?: string;
}

export const categories: Category[] = [
  { id: 'cat_1', name: 'Home Cleaning', slug: 'cleaning', icon: 'Sparkles', image: homeCleaningImg },
  { id: 'cat_4', name: 'Lawn Care', slug: 'landscaping', icon: 'Trees', image: landscapingImg },
  { id: 'cat_6', name: 'Auto Detailing', slug: 'automotive', icon: 'Car', image: automotiveImg },
  { id: 'cat_7', name: 'Pet Services', slug: 'pets', icon: 'Dog', image: petServicesImg },
  { id: 'cat_8', name: 'Snow Removal', slug: 'snow', icon: 'Snowflake', image: snowRemovalImg },
  { id: 'cat_2', name: 'Plumbing', slug: 'plumbing', icon: 'Wrench', image: plumbingImg },
  { id: 'cat_3', name: 'Electrical', slug: 'electrical', icon: 'Zap', image: electricalImg },
  { id: 'cat_5', name: 'Moving', slug: 'moving', icon: 'Truck', image: movingImg },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Customer', email: 'alice@example.com', role: 'customer', createdAt: '2023-01-15' },
  { id: 'u2', name: 'Bob Provider', email: 'bob@sparkleclean.com', role: 'provider', createdAt: '2023-02-20' },
  { id: 'u3', name: 'Charlie Admin', email: 'admin@servly.com', role: 'admin', createdAt: '2023-01-01' },
  { id: 'u4', name: 'Dave Plumber', email: 'dave@pipes.com', role: 'provider', createdAt: '2023-03-10' },
  { id: 'u5', name: 'Eve Mechanic', email: 'eve@autoshop.com', role: 'provider', createdAt: '2023-04-15' },
];

export const mockProviders: ProviderProfile[] = [
  {
    id: 'p1',
    userId: 'u2',
    businessName: 'Sparkle & Shine Cleaning',
    description: 'Top-rated home cleaning service specializing in deep cleans and move-outs. We bring our own eco-friendly supplies.',
    phone: '555-0101',
    city: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 124,
    categories: ['cat_1'],
    services: [
      { id: 's1', title: 'Standard Clean (2 Bed / 1 Bath)', description: 'Regular maintenance cleaning', price: 120, priceUnit: 'visit', categoryId: 'cat_1' },
      { id: 's2', title: 'Deep Clean', description: 'Thorough cleaning of all surfaces, inside appliances', price: 250, priceUnit: 'visit', categoryId: 'cat_1' },
    ],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    imageUrl: homeCleaningImg,
    locationType: 'mobile'
  },
  {
    id: 'p2',
    userId: 'u4',
    businessName: 'Dave\'s Plumbing Pros',
    description: 'Licensed and insured plumbers ready for emergencies 24/7.',
    phone: '555-0202',
    city: 'Oakland, CA',
    rating: 4.9,
    reviewCount: 89,
    categories: ['cat_2'],
    services: [
      { id: 's3', title: 'Leak Repair', description: 'Fixing active leaks', price: 150, priceUnit: 'hour', categoryId: 'cat_2' },
      { id: 's4', title: 'Drain Unclogging', description: 'Clearing stopped drains', price: 100, priceUnit: 'visit', categoryId: 'cat_2' },
    ],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    imageUrl: plumbingImg,
    locationType: 'mobile'
  },
  {
    id: 'p3',
    userId: 'u5',
    businessName: 'Prestige Auto Detail Shop',
    description: 'Premium auto detailing studio. Bring your car to us for a showroom shine.',
    phone: '555-0303',
    city: 'San Jose, CA',
    address: '456 Car Lane, San Jose, CA',
    rating: 4.7,
    reviewCount: 45,
    categories: ['cat_6'],
    services: [
      { id: 's5', title: 'Full Interior Detail', description: 'Deep clean of all interior surfaces', price: 180, priceUnit: 'visit', categoryId: 'cat_6' },
      { id: 's6', title: 'Exterior Polish', description: 'Wash, clay bar, and machine polish', price: 200, priceUnit: 'visit', categoryId: 'cat_6' },
    ],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    imageUrl: automotiveImg,
    locationType: 'location'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    customerId: 'u1',
    providerId: 'p1',
    serviceId: 's1',
    categoryId: 'cat_1',
    dateTime: '2023-11-25T10:00:00',
    address: '123 Main St, Apt 4B',
    notes: 'Please be careful with the cat.',
    status: 'pending',
    createdAt: '2023-11-20T09:00:00'
  },
  {
    id: 'b2',
    customerId: 'u1',
    providerId: 'p2',
    serviceId: 's3',
    categoryId: 'cat_2',
    dateTime: '2023-11-22T14:00:00',
    address: '123 Main St, Apt 4B',
    notes: 'Kitchen sink is leaking under the cabinet.',
    status: 'accepted',
    createdAt: '2023-11-19T15:30:00'
  },
  {
    id: 'b3',
    customerId: 'u1',
    providerId: 'p1',
    serviceId: 's1',
    categoryId: 'cat_1',
    dateTime: '2023-10-15T09:00:00',
    address: '123 Main St, Apt 4B',
    notes: '',
    status: 'completed',
    createdAt: '2023-10-10T10:00:00'
  }
];
