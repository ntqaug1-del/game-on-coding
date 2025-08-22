-- Create visit logs table to track unique visits by IP and date
CREATE TABLE IF NOT EXISTS visit_logs (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_name, ip_address, visit_date)
);

-- Create RLS policies
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the visit logs
CREATE POLICY "Visit logs are viewable by everyone" ON visit_logs
    FOR SELECT USING (true);

-- Only allow the service role to insert new logs
CREATE POLICY "Only service role can insert visit logs" ON visit_logs
    FOR INSERT USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Create function to count unique visits
CREATE OR REPLACE FUNCTION count_unique_visits(page VARCHAR)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visit_logs WHERE page_name = page);
END;
$$ LANGUAGE plpgsql;

-- Create function to count unique visits by date
CREATE OR REPLACE FUNCTION count_unique_visits_by_date(page VARCHAR, date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visit_logs WHERE page_name = page AND visit_date = date);
END;
$$ LANGUAGE plpgsql;
