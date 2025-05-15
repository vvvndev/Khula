/*
  # Version 2.8 Database Schema Updates
  
  1. New Tables
    - investments: Core table for investment tracking
    - analytics_metrics: Advanced analytics data
    - user_preferences: Enhanced user settings
    - notifications: Push notification system
    - performance_metrics: Investment performance tracking
    - user_connections: Social features
  
  2. Changes
    - Added performance tracking
    - Enhanced user preferences
    - Added notification system
    - Added social features
    
  3. Security
    - RLS enabled on all tables
    - Appropriate policies for data access
*/

-- Core Investment Table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  amount decimal NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  performance_score decimal,
  risk_indicators jsonb DEFAULT '{}',
  social_metrics jsonb DEFAULT '{}'
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their investments"
  ON investments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Advanced Analytics
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  metric_type text NOT NULL,
  metric_value jsonb NOT NULL,
  calculated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_user_type ON analytics_metrics(user_id, metric_type);
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their analytics"
  ON analytics_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Enhanced User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  theme text DEFAULT 'light',
  notification_settings jsonb DEFAULT '{"email": true, "push": true, "sms": false}',
  investment_preferences jsonb DEFAULT '{"risk_tolerance": "moderate", "preferred_sectors": []}',
  ui_settings jsonb DEFAULT '{"compact_view": false, "show_tooltips": true}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Notification System
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Investment Performance Tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id uuid REFERENCES investments(id),
  metric_type text NOT NULL,
  value decimal NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_performance_investment ON performance_metrics(investment_id);
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view investment performance"
  ON performance_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM investments
      WHERE id = performance_metrics.investment_id
      AND user_id = auth.uid()
    )
  );

-- Social Features
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  connected_user_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their connections"
  ON user_connections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Create function for calculating performance score
CREATE OR REPLACE FUNCTION calculate_performance_score()
RETURNS trigger AS $$
BEGIN
  NEW.performance_score = (
    SELECT COALESCE(AVG(value), 0)
    FROM performance_metrics
    WHERE investment_id = NEW.id
    AND metric_type = 'return_rate'
    AND period_end > NOW() - INTERVAL '30 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_performance_score
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_performance_score();