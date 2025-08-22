-- Create visit counter table
CREATE TABLE IF NOT EXISTS visit_counter (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on page_name
ALTER TABLE visit_counter ADD CONSTRAINT visit_counter_page_name_key UNIQUE (page_name);

-- Insert initial record for home page
INSERT INTO visit_counter (page_name, count) 
VALUES ('home', 0) 
ON CONFLICT (page_name) DO NOTHING;

-- Create RLS policies
ALTER TABLE visit_counter ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the visit counter
CREATE POLICY "Visit counter is viewable by everyone" ON visit_counter
    FOR SELECT USING (true);

-- Only allow the service role to update the counter
CREATE POLICY "Only service role can update visit counter" ON visit_counter
    FOR UPDATE USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Only allow the service role to insert new counters
CREATE POLICY "Only service role can insert visit counter" ON visit_counter
    FOR INSERT USING (auth.role() = 'service_role' OR auth.role() = 'anon');
