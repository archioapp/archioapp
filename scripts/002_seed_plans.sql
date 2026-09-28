-- =====================================================
-- Phase 1 / Step 1: Seed Data for Plans
-- =====================================================

-- Insert default plans
INSERT INTO public.plans (name, slug, description, price_monthly, price_yearly, features, limits, is_active)
VALUES
  (
    'Free',
    'free',
    'Perfect for getting started with basic features',
    0.00,
    0.00,
    '["Access to public rooms", "Basic chart analysis", "Community support", "Limited AI forecasts (5/day)"]'::jsonb,
    '{"max_organizations": 1, "max_rooms": 3, "max_ai_forecasts_per_day": 5, "max_storage_mb": 100}'::jsonb,
    true
  ),
  (
    'Pro',
    'pro',
    'Advanced features for serious traders',
    29.99,
    299.99,
    '["Unlimited public & private rooms", "Advanced chart analysis", "Priority support", "Unlimited AI forecasts", "Custom indicators", "Export data", "API access"]'::jsonb,
    '{"max_organizations": 5, "max_rooms": 50, "max_ai_forecasts_per_day": -1, "max_storage_mb": 5000}'::jsonb,
    true
  ),
  (
    'Live',
    'live',
    'Real-time trading with live market data',
    79.99,
    799.99,
    '["Everything in Pro", "Real-time market data", "Live trading signals", "Advanced AI predictions", "Backtesting tools", "Custom alerts", "Dedicated support"]'::jsonb,
    '{"max_organizations": 10, "max_rooms": 100, "max_ai_forecasts_per_day": -1, "max_storage_mb": 20000, "live_data_access": true}'::jsonb,
    true
  ),
  (
    'Mentor Elite',
    'mentor-elite',
    'Premium mentorship and exclusive features',
    199.99,
    1999.99,
    '["Everything in Live", "1-on-1 mentorship sessions", "Exclusive trading strategies", "Private community access", "Custom AI model training", "White-label options", "24/7 VIP support"]'::jsonb,
    '{"max_organizations": -1, "max_rooms": -1, "max_ai_forecasts_per_day": -1, "max_storage_mb": -1, "live_data_access": true, "mentorship_hours_per_month": 4}'::jsonb,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
