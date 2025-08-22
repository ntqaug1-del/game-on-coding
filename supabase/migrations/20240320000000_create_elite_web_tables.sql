-- Create categories table
CREATE TABLE IF NOT EXISTS elite_web_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create websites table
CREATE TABLE IF NOT EXISTS elite_web_websites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES elite_web_categories(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    views_count INTEGER DEFAULT 0,
    votes_count INTEGER DEFAULT 0,
    submitted_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS elite_web_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    website_id UUID REFERENCES elite_web_websites(id),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(website_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS elite_web_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    website_id UUID REFERENCES elite_web_websites(id),
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS elite_web_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    website_id UUID REFERENCES elite_web_websites(id),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(website_id, user_id)
);

-- Create RLS policies
ALTER TABLE elite_web_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE elite_web_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE elite_web_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE elite_web_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE elite_web_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON elite_web_categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON elite_web_categories
    FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    ));

-- Policies for websites
CREATE POLICY "Websites are viewable by everyone" ON elite_web_websites
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can submit websites" ON elite_web_websites
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage websites" ON elite_web_websites
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    ));

-- Policies for votes
CREATE POLICY "Votes are viewable by everyone" ON elite_web_votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON elite_web_votes
    FOR ALL USING (auth.role() = 'authenticated');

-- Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON elite_web_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON elite_web_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON elite_web_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for favorites
CREATE POLICY "Users can view their own favorites" ON elite_web_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage favorites" ON elite_web_favorites
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some default categories
INSERT INTO elite_web_categories (name, description) VALUES
    ('Technology', 'Websites related to technology, programming, and software'),
    ('Education', 'Educational resources and learning platforms'),
    ('Entertainment', 'Entertainment and media websites'),
    ('News', 'News and information websites'),
    ('Health', 'Health and wellness resources'),
    ('Travel', 'Travel planning and information'),
    ('Online Tools', 'Useful online tools and utilities'),
    ('Finance', 'Financial resources and tools'); 