CREATE TABLE IF NOT EXISTS public.email_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id) NOT NULL,
    email_address text NOT NULL,
    provider text NOT NULL CHECK (provider IN ('gmail', 'outlook')),
    is_connected boolean DEFAULT false,
    access_token text,
    refresh_token text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, email_address)
);

CREATE TABLE IF NOT EXISTS public.brand_deals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id) NOT NULL,
    email_account_id uuid REFERENCES public.email_accounts(id) NOT NULL,
    brand_name text NOT NULL,
    campaign_name text,
    offer_amount numeric(10,2),
    currency text DEFAULT 'USD',
    deadline date,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'accepted', 'rejected', 'archived')),
    email_subject text,
    email_body text,
    email_id text,
    sender_email text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS email_accounts_user_id_idx ON public.email_accounts(user_id);
CREATE INDEX IF NOT EXISTS brand_deals_user_id_idx ON public.brand_deals(user_id);
CREATE INDEX IF NOT EXISTS brand_deals_email_account_id_idx ON public.brand_deals(email_account_id);
CREATE INDEX IF NOT EXISTS brand_deals_status_idx ON public.brand_deals(status);

ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own email accounts" ON public.email_accounts;
CREATE POLICY "Users can manage own email accounts"
ON public.email_accounts FOR ALL
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own brand deals" ON public.brand_deals;
CREATE POLICY "Users can manage own brand deals"
ON public.brand_deals FOR ALL
USING (auth.uid()::text = user_id);

