-- RELIEFCHAIN DATABASE SETUP
-- Run this in Supabase SQL Editor

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  role TEXT NOT NULL DEFAULT 'donor',
  account_status TEXT NOT NULL DEFAULT 'approved',
  rejection_reason TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  organization_name TEXT,
  organization_type TEXT,
  organization_reg_number TEXT,
  registration_number TEXT,
  document_url TEXT,
  id_document_url TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  driving_license TEXT,
  carrying_capacity INTEGER,
  can_access_flooded BOOLEAN DEFAULT false,
  availability TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-set account_status based on role
CREATE OR REPLACE FUNCTION set_default_account_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IN ('ngo', 'coordinator', 'driver') THEN
    NEW.account_status := 'pending';
  ELSE
    NEW.account_status := 'approved';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_account_status ON profiles;
CREATE TRIGGER trg_set_account_status
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION set_default_account_status();

-- 2. Camps
CREATE TABLE IF NOT EXISTS camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT DEFAULT 'Ernakulam',
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  total_capacity INTEGER NOT NULL DEFAULT 500,
  current_population INTEGER DEFAULT 0,
  children_count INTEGER DEFAULT 0,
  elderly_count INTEGER DEFAULT 0,
  pregnant_count INTEGER DEFAULT 0,
  injured_count INTEGER DEFAULT 0,
  road_accessibility INTEGER DEFAULT 5,
  coordinator_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active',
  last_report_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resources
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kits',
  daily_consumption DECIMAL NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Requests
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  quantity_needed DECIMAL NOT NULL DEFAULT 0,
  priority_score DECIMAL NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Donations
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES profiles(id),
  donor_name TEXT,
  amount DECIMAL NOT NULL,
  preferred_resource TEXT DEFAULT 'any',
  allocated_camp_id UUID REFERENCES camps(id),
  resource_type TEXT,
  resource_quantity DECIMAL,
  status TEXT DEFAULT 'donated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Item Donations
CREATE TABLE IF NOT EXISTS item_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES profiles(id),
  donor_name TEXT,
  item_category TEXT NOT NULL,
  item_subcategory TEXT,
  quantity INTEGER NOT NULL,
  condition TEXT DEFAULT 'new',
  description TEXT,
  handover_method TEXT DEFAULT 'drop_off',
  pickup_address TEXT,
  allocated_camp_id UUID REFERENCES camps(id),
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_camp_id UUID REFERENCES camps(id),
  target_camp_id UUID REFERENCES camps(id),
  resource_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  priority_score DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  estimated_delivery_hours DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Transfers
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_camp_id UUID REFERENCES camps(id),
  to_camp_id UUID REFERENCES camps(id),
  resource_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  driver_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'assigned',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- Policies: Drop existing then recreate
DO $$ BEGIN
  -- Drop all existing policies to make this idempotent
  DROP POLICY IF EXISTS "read_all" ON profiles;
  DROP POLICY IF EXISTS "read_all" ON camps;
  DROP POLICY IF EXISTS "read_all" ON resources;
  DROP POLICY IF EXISTS "read_all" ON requests;
  DROP POLICY IF EXISTS "read_all" ON donations;
  DROP POLICY IF EXISTS "read_all" ON item_donations;
  DROP POLICY IF EXISTS "read_all" ON recommendations;
  DROP POLICY IF EXISTS "read_all" ON transfers;
  DROP POLICY IF EXISTS "insert_own" ON profiles;
  DROP POLICY IF EXISTS "update_own" ON profiles;
  DROP POLICY IF EXISTS "update_any" ON profiles;
  DROP POLICY IF EXISTS "delete_any" ON profiles;
  DROP POLICY IF EXISTS "auth_insert" ON camps;
  DROP POLICY IF EXISTS "auth_update" ON camps;
  DROP POLICY IF EXISTS "auth_delete" ON camps;
  DROP POLICY IF EXISTS "auth_insert" ON resources;
  DROP POLICY IF EXISTS "auth_update" ON resources;
  DROP POLICY IF EXISTS "auth_insert" ON requests;
  DROP POLICY IF EXISTS "auth_insert" ON donations;
  DROP POLICY IF EXISTS "auth_update" ON donations;
  DROP POLICY IF EXISTS "auth_insert" ON item_donations;
  DROP POLICY IF EXISTS "auth_update" ON item_donations;
  DROP POLICY IF EXISTS "auth_insert" ON recommendations;
  DROP POLICY IF EXISTS "auth_update" ON recommendations;
  DROP POLICY IF EXISTS "auth_insert" ON transfers;
  DROP POLICY IF EXISTS "auth_update" ON transfers;
END $$;

-- Everyone can read
CREATE POLICY "read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "read_all" ON camps FOR SELECT USING (true);
CREATE POLICY "read_all" ON resources FOR SELECT USING (true);
CREATE POLICY "read_all" ON requests FOR SELECT USING (true);
CREATE POLICY "read_all" ON donations FOR SELECT USING (true);
CREATE POLICY "read_all" ON item_donations FOR SELECT USING (true);
CREATE POLICY "read_all" ON recommendations FOR SELECT USING (true);
CREATE POLICY "read_all" ON transfers FOR SELECT USING (true);

-- Profiles: insert own, update own, admin can update/delete any
CREATE POLICY "insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own" ON profiles FOR UPDATE USING (true);
CREATE POLICY "delete_any" ON profiles FOR DELETE USING (true);

-- Authenticated can insert/update other tables
CREATE POLICY "auth_insert" ON camps FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON camps FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete" ON camps FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON resources FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON donations FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON item_donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON item_donations FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON recommendations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON recommendations FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert" ON transfers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update" ON transfers FOR UPDATE USING (auth.uid() IS NOT NULL);

