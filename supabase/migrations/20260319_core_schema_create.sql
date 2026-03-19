-- Rollback first for clean deployment
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.create_order(UUID, NUMERIC, JSONB, JSONB);
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles (linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Products
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  stock_count INTEGER DEFAULT 0 NOT NULL,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Orders (One rule: only authenticated users can add orders)
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  delivery_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Order Items
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time NUMERIC(10, 2) NOT NULL
);

-- 5. Explicitly Grant Postgres Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;

-- 6. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Profiles: Users can see all, but only edit own
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Only authenticated users can insert, and see their own
CREATE POLICY "Authenticated users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Order Items: Link to orders RLS
CREATE POLICY "Authenticated users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);

-- 7. RPC to create profile manually
CREATE OR REPLACE FUNCTION public.create_profile(
  profile_id UUID,
  profile_email TEXT,
  profile_full_name TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (profile_id, profile_email, profile_full_name)
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email, full_name = EXCLUDED.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC to create order and order items in a single transaction
CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id UUID,
  p_total_price NUMERIC,
  p_delivery_info JSONB, -- {email, address, phone}
  p_items JSONB -- Array of {product_id, quantity, price_at_time}
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_item RECORD;
BEGIN
  -- Insert Order
  INSERT INTO public.orders (
    user_id, 
    total_price, 
    delivery_email, 
    delivery_address, 
    delivery_phone,
    status
  )
  VALUES (
    p_user_id, 
    p_total_price, 
    p_delivery_info->>'email', 
    p_delivery_info->>'address', 
    p_delivery_info->>'phone',
    'new'
  )
  RETURNING id INTO v_order_id;

  -- Insert Order Items from JSON array
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INTEGER, price_at_time NUMERIC)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price_at_time)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_item.price_at_time);
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.create_order(UUID, NUMERIC, JSONB, JSONB) TO authenticated;
