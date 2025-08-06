import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Alex Chen",
      age: 14,
      course: "Python Programming",
      avatar: "👦",
      quote: "CodeHeroes made programming so much fun! I went from knowing nothing about coding to building my own games. The teachers are amazing and the lessons feel like playing video games!",
      rating: 5,
      achievement: "Built 5 Python Games"
    },
    {
      id: 2,
      name: "Maya Patel",
      age: 12,
      course: "Scratch Game Development",
      avatar: "👧",
      quote: "I love how everything is explained with cool animations and characters. My parents are so proud that I created my own platformer game in just 6 weeks!",
      rating: 5,
      achievement: "Created First Game"
    },
    {
      id: 3,
      name: "Jordan Smith",
      age: 16,
      course: "Web Development",
      avatar: "🧑",
      quote: "The web development course helped me build my own portfolio website. Now I'm helping my friends create websites for their school projects!",
      rating: 5,
      achievement: "Full-Stack Developer"
    },
    {
      id: 4,
      name: "Sarah Kim",
      age: 13,
      course: "Minecraft Modding",
      avatar: "👩",
      quote: "Being able to code my own Minecraft mods was a dream come true! The course was challenging but so rewarding. I can't wait to start the AI course next!",
      rating: 5,
      achievement: "Published 3 Mods"
    }
  ];

  const parentTestimonials = [
    {
      id: 1,
      name: "Jennifer Chen",
      relation: "Alex's Mom",
      quote: "I was skeptical about online coding classes, but CodeHeroes exceeded all expectations. Alex is now more focused, problem-solving oriented, and genuinely excited about learning!"
    },
    {
      id: 2,
      name: "David Patel",
      relation: "Maya's Dad",
      quote: "The gamified approach really works! Maya looks forward to her coding sessions every day. It's incredible to see her logical thinking skills develop so rapidly."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Hero Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from our coding heroes and their families about their amazing journeys!
          </p>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="pixel-card relative min-h-[300px] overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 p-8 transition-all duration-500 ${
                  index === currentTestimonial 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-full'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-pixel-blue border-4 border-border flex items-center justify-center text-4xl relative">
                      {testimonial.avatar}
                      {/* Achievement Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-pixel-yellow border-2 border-border flex items-center justify-center text-xs">
                        🏆
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <div className="flex justify-center md:justify-start mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-pixel-yellow text-xl">⭐</span>
                        ))}
                      </div>
                      <p className="text-lg italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="font-bold text-primary text-lg">{testimonial.name}, {testimonial.age}</div>
                      <div className="text-muted-foreground">{testimonial.course}</div>
                      <div className="text-sm text-pixel-green font-bold mt-1">
                        Achievement: {testimonial.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 border-2 border-border transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-transparent'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Parent Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">What Parents Say</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {parentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="pixel-card">
                <p className="text-muted-foreground italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="font-bold text-primary">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.relation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pixel-green mb-2">98%</div>
            <div className="text-muted-foreground text-sm">Course Completion</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pixel-blue mb-2">4.9/5</div>
            <div className="text-muted-foreground text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pixel-yellow mb-2">250+</div>
            <div className="text-muted-foreground text-sm">Projects Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pixel-red mb-2">100%</div>
            <div className="text-muted-foreground text-sm">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;