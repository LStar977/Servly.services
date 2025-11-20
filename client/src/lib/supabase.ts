import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsthgysvjxeihxzudjjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGhneXN2anhlaWh4enVkampqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mjc5NzgsImV4cCI6MjA3OTEwMzk3OH0.4ZtbXDY4qHfWaeF_476ji7izOXYcdZZfj6wdp-cgNik';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
