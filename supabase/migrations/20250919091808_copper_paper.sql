/*
  # AgriSmart Complete Database Schema

  1. New Tables
    - `users` - User profiles with farming details
    - `farms` - Farm information and location data
    - `crops` - Crop management and tracking
    - `soil_data` - Soil analysis and sensor data
    - `weather_data` - Weather information and forecasts
    - `iot_devices` - IoT sensor management
    - `chat_sessions` - AI chatbot conversations
    - `market_prices` - Real-time market price data
    - `predictions` - AI predictions and recommendations
    - `community_posts` - Farmer community discussions
    - `expert_consultations` - Expert consultation bookings
    - `financial_records` - Farm financial tracking
    - `government_schemes` - Available schemes and subsidies

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Users table with comprehensive farmer profile
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  location jsonb,
  farm_size decimal,
  farming_experience integer,
  preferred_language text DEFAULT 'en',
  profile_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Farms table for multiple farm management
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location jsonb NOT NULL,
  area decimal NOT NULL,
  soil_type text,
  irrigation_type text,
  coordinates point,
  created_at timestamptz DEFAULT now()
);

-- Crops table for crop management
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  variety text,
  planting_date date,
  expected_harvest_date date,
  current_stage text,
  area_planted decimal,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Soil data from sensors and analysis
CREATE TABLE IF NOT EXISTS soil_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  ph_level decimal,
  nitrogen decimal,
  phosphorus decimal,
  potassium decimal,
  organic_carbon decimal,
  moisture decimal,
  temperature decimal,
  recorded_at timestamptz DEFAULT now()
);

-- Weather data and forecasts
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location jsonb NOT NULL,
  temperature decimal,
  humidity decimal,
  rainfall decimal,
  wind_speed decimal,
  pressure decimal,
  weather_condition text,
  forecast_date date,
  recorded_at timestamptz DEFAULT now()
);

-- IoT devices management
CREATE TABLE IF NOT EXISTS iot_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  device_type text NOT NULL,
  device_name text NOT NULL,
  status text DEFAULT 'active',
  last_reading jsonb,
  battery_level integer,
  installed_at timestamptz DEFAULT now()
);

-- Chat sessions for AI conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_name text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message text NOT NULL,
  sender text NOT NULL, -- 'user' or 'ai'
  message_type text DEFAULT 'text', -- 'text', 'image', 'audio'
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Market prices
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  market_location text NOT NULL,
  price_per_unit decimal NOT NULL,
  unit text NOT NULL,
  price_date date NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);

-- AI predictions and recommendations
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prediction_type text NOT NULL, -- 'crop', 'yield', 'disease', 'weather'
  input_data jsonb NOT NULL,
  prediction_result jsonb NOT NULL,
  confidence_score decimal,
  created_at timestamptz DEFAULT now()
);

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  images text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Expert consultations
CREATE TABLE IF NOT EXISTS expert_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  expert_name text NOT NULL,
  consultation_type text NOT NULL, -- 'video', 'voice', 'chat'
  topic text NOT NULL,
  scheduled_at timestamptz,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Financial records
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
  transaction_type text NOT NULL, -- 'income', 'expense'
  category text NOT NULL,
  amount decimal NOT NULL,
  description text,
  transaction_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Government schemes
CREATE TABLE IF NOT EXISTS government_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name text NOT NULL,
  description text NOT NULL,
  eligibility_criteria text[],
  benefits text[],
  application_process text,
  deadline date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can manage own farms" ON farms FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own crops" ON crops FOR ALL TO authenticated USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own soil data" ON soil_data FOR ALL TO authenticated USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

CREATE POLICY "Weather data is public" ON weather_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Market prices are public" ON market_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Government schemes are public" ON government_schemes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own IoT devices" ON iot_devices FOR ALL TO authenticated USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own chat sessions" ON chat_sessions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own chat messages" ON chat_messages FOR ALL TO authenticated USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own predictions" ON predictions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Community posts are public for read" ON community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own posts" ON community_posts FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Comments are public for read" ON post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own comments" ON post_comments FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can manage own consultations" ON expert_consultations FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own financial records" ON financial_records FOR ALL TO authenticated USING (user_id = auth.uid());