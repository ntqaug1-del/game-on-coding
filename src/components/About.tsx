const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
              About CodeHeroes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Where programming meets adventure! We transform coding education into an epic quest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="pixel-card">
                <h3 className="text-2xl font-bold mb-4 text-pixel-green">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 2020 with a simple belief: learning to code should be as exciting as playing your favorite video game. 
                  We've revolutionized programming education by gamifying every aspect of the learning experience.
                </p>
              </div>

              <div className="pixel-card">
                <h3 className="text-2xl font-bold mb-4 text-pixel-blue">Game-Like Learning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform uses leveling systems, achievement badges, coding quests, and interactive challenges 
                  to keep students engaged and motivated throughout their coding journey.
                </p>
              </div>

              <div className="pixel-card">
                <h3 className="text-2xl font-bold mb-4 text-pixel-yellow">Expert Instructors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our team includes former game developers, software engineers, and education specialists 
                  who understand how to make complex concepts accessible and fun for young minds.
                </p>
              </div>
            </div>

            {/* Pixel Art Illustration */}
            <div className="relative">
              <div className="pixel-card h-96 bg-gradient-to-br from-card to-muted relative overflow-hidden">
                {/* Pixel art representation of students coding */}
                <div className="absolute inset-4">
                  {/* Computer screens */}
                  <div className="absolute top-0 left-0 w-16 h-12 bg-background border-2 border-border">
                    <div className="p-1">
                      <div className="w-full h-1 bg-pixel-green mb-1"></div>
                      <div className="w-3/4 h-1 bg-pixel-blue mb-1"></div>
                      <div className="w-1/2 h-1 bg-pixel-yellow"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-16 h-12 bg-background border-2 border-border">
                    <div className="p-1">
                      <div className="w-full h-1 bg-pixel-red mb-1"></div>
                      <div className="w-2/3 h-1 bg-pixel-purple mb-1"></div>
                      <div className="w-3/4 h-1 bg-pixel-orange"></div>
                    </div>
                  </div>

                  {/* Students (simplified pixel representation) */}
                  <div className="absolute bottom-4 left-2 w-8 h-16">
                    <div className="w-6 h-6 bg-pixel-yellow rounded-full mx-auto mb-1"></div>
                    <div className="w-4 h-8 bg-pixel-blue mx-auto mb-1"></div>
                    <div className="w-2 h-2 bg-pixel-green mx-auto"></div>
                  </div>

                  <div className="absolute bottom-4 right-2 w-8 h-16">
                    <div className="w-6 h-6 bg-pixel-red rounded-full mx-auto mb-1"></div>
                    <div className="w-4 h-8 bg-pixel-purple mx-auto mb-1"></div>
                    <div className="w-2 h-2 bg-pixel-orange mx-auto"></div>
                  </div>

                  {/* Floating code symbols */}
                  <div className="absolute top-8 left-8 text-pixel-green text-2xl font-bold float">&lt;/&gt;</div>
                  <div className="absolute top-12 right-8 text-pixel-blue text-2xl font-bold float" style={{animationDelay: '1s'}}>{ }</div>
                  <div className="absolute bottom-8 left-12 text-pixel-yellow text-2xl font-bold float" style={{animationDelay: '2s'}}>( )</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 text-primary">Our Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="pixel-card text-center">
                <div className="w-12 h-12 bg-pixel-green border-2 border-border mx-auto mb-2 flex items-center justify-center">
                  <span className="text-background font-bold">🏆</span>
                </div>
                <div className="text-sm font-bold">Best Ed-Tech 2023</div>
              </div>
              <div className="pixel-card text-center">
                <div className="w-12 h-12 bg-pixel-blue border-2 border-border mx-auto mb-2 flex items-center justify-center">
                  <span className="text-background font-bold">⭐</span>
                </div>
                <div className="text-sm font-bold">5-Star Rating</div>
              </div>
              <div className="pixel-card text-center">
                <div className="w-12 h-12 bg-pixel-yellow border-2 border-border mx-auto mb-2 flex items-center justify-center">
                  <span className="text-background font-bold">🎯</span>
                </div>
                <div className="text-sm font-bold">100% Satisfaction</div>
              </div>
              <div className="pixel-card text-center">
                <div className="w-12 h-12 bg-pixel-red border-2 border-border mx-auto mb-2 flex items-center justify-center">
                  <span className="text-background font-bold">🚀</span>
                </div>
                <div className="text-sm font-bold">Innovation Award</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;