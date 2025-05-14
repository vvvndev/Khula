/*
  # Version 2.4 Schema Updates

  1. New Tables
    - `ai_recommendations`
      - Stores AI-generated investment recommendations
    - `market_data`
      - Real-time market data and analytics
    - `social_interactions`
      - User interactions and social features
    - `compliance_logs`
      - Automated compliance tracking
    
  2. Updates
    - Added new columns to existing tables
    - Enhanced security policies
    
  3. Indexes
    - Optimized queries with new indexes
*/

-- AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  investment_type text NOT NULL,
  recommendation_data jsonb NOT NULL,
  risk_score decimal NOT NULL,
  confidence_score decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(user_id);
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendations"
  ON ai_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Market Data
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  data_type text NOT NULL,
  value jsonb NOT NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_data_symbol_timestamp ON market_data(symbol, timestamp);
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market data"
  ON market_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Social Interactions
CREATE TABLE IF NOT EXISTS social_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  target_id uuid REFERENCES auth.users(id),
  interaction_type text NOT NULL,
  interaction_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_interactions_user ON social_interactions(user_id);
ALTER TABLE social_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own interactions"
  ON social_interactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Compliance Logs
CREATE TABLE IF NOT EXISTS compliance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  action_data jsonb NOT NULL,
  compliance_status text NOT NULL,
  verification_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_logs_user ON compliance_logs(user_id);
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their compliance logs"
  ON compliance_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add new columns to existing tables
ALTER TABLE investments ADD COLUMN IF NOT EXISTS ai_analysis jsonb;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS social_score decimal;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS compliance_status text;

-- Create function for automated compliance checking
CREATE OR REPLACE FUNCTION check_investment_compliance()
RETURNS trigger AS $$
BEGIN
  INSERT INTO compliance_logs (
    user_id,
    action_type,
    action_data,
    compliance_status,
    verification_data
  ) VALUES (
    NEW.user_id,
    'investment_creation',
    jsonb_build_object('investment_id', NEW.id, 'amount', NEW.amount),
    'pending',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investment_compliance_check
  AFTER INSERT ON investments
  FOR EACH ROW
  EXECUTE FUNCTION check_investment_compliance();