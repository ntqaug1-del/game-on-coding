import { Button } from '@/components/ui/button';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Why Kids Should Learn to Code in 2024",
      summary: "Discover the top 5 reasons why coding is becoming an essential skill for the next generation and how it boosts creativity and problem-solving abilities.",
      thumbnail: "💡",
      category: "Education",
      readTime: "5 min read",
      date: "2024-01-15",
      author: "Sarah Johnson",
      featured: true
    },
    {
      id: 2,
      title: "Top 5 Coding Games That Make Learning Fun",
      summary: "From CodeCombat to Human Resource Machine, explore the best games that teach programming concepts while keeping kids entertained.",
      thumbnail: "🎮",
      category: "Games",
      readTime: "7 min read",
      date: "2024-01-10",
      author: "Mike Chen",
      featured: false
    },
    {
      id: 3,
      title: "How to Choose Your First Programming Language",
      summary: "A parent's guide to understanding different programming languages and picking the perfect starting point for your child's coding journey.",
      thumbnail: "🚀",
      category: "Getting Started",
      readTime: "6 min read",
      date: "2024-01-08",
      author: "Emily Rodriguez",
      featured: false
    },
    {
      id: 4,
      title: "Building Confidence Through Code",
      summary: "Learn how programming education helps shy kids build confidence, express creativity, and develop leadership skills in a supportive environment.",
      thumbnail: "💪",
      category: "Development",
      readTime: "4 min read",
      date: "2024-01-05",
      author: "David Kim",
      featured: false
    },
    {
      id: 5,
      title: "The Future of AI and Young Programmers",
      summary: "Explore how artificial intelligence is changing the programming landscape and what it means for the next generation of coders.",
      thumbnail: "🤖",
      category: "Technology",
      readTime: "8 min read",
      date: "2024-01-03",
      author: "Lisa Wang",
      featured: true
    },
    {
      id: 6,
      title: "Creating Your First Game: A Beginner's Story",
      summary: "Follow 12-year-old Alex's journey from complete beginner to game creator, including the challenges faced and victories achieved.",
      thumbnail: "🏆",
      category: "Success Stories",
      readTime: "6 min read",
      date: "2024-01-01",
      author: "Alex Chen (Student)",
      featured: false
    }
  ];

  const categories = ["All", "Education", "Games", "Getting Started", "Development", "Technology", "Success Stories"];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            CodeHeroes Blog
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest in coding education, tips for young programmers, and inspiring success stories.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={`text-xs ${category === "All" ? "pixel-button" : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-primary">Featured Posts</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="pixel-card hover:transform hover:scale-105 transition-all duration-300">
                {/* Thumbnail */}
                <div className="w-full h-48 bg-gradient-to-br from-pixel-blue to-pixel-purple border-2 border-border mb-4 flex items-center justify-center text-6xl">
                  {post.thumbnail}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-2 py-1 bg-pixel-green text-background font-bold text-xs">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground">{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold leading-tight">{post.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">{post.summary}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm">
                      <div className="font-bold text-primary">{post.author}</div>
                      <div className="text-muted-foreground">{post.date}</div>
                    </div>
                    <Button className="pixel-button text-sm px-4 py-2">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-primary">Recent Posts</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <div 
                key={post.id} 
                className="pixel-card hover:transform hover:scale-105 transition-all duration-300 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Thumbnail */}
                <div className="w-full h-32 bg-gradient-to-br from-card to-muted border-2 border-border mb-4 flex items-center justify-center text-4xl">
                  {post.thumbnail}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 bg-pixel-blue text-background font-bold">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground">{post.readTime}</span>
                  </div>

                  <h4 className="font-bold leading-tight">{post.title}</h4>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {post.author}<br/>{post.date}
                    </div>
                    <Button variant="outline" className="text-xs px-3 py-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Read
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 text-center">
          <div className="pixel-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-primary">Stay Updated!</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for weekly coding tips, new course announcements, and inspiring student stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 px-4 py-3 bg-input border-2 border-border text-foreground">
                Enter your email address
              </div>
              <Button className="pixel-button">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;