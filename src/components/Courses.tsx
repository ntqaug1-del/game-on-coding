import { Button } from '@/components/ui/button';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Intro to Python",
      description: "Start your coding journey with Python! Learn variables, loops, and functions through fun mini-games.",
      ageRange: "Ages 10-14",
      level: "Beginner",
      duration: "8 weeks",
      icon: "🐍",
      color: "pixel-green",
      lessons: 24
    },
    {
      id: 2,
      title: "Game Development with Scratch",
      description: "Create your own games using Scratch's drag-and-drop interface. No prior experience needed!",
      ageRange: "Ages 8-12",
      level: "Beginner",
      duration: "6 weeks",
      icon: "🎮",
      color: "pixel-blue",
      lessons: 18
    },
    {
      id: 3,
      title: "Web Design Basics",
      description: "Build amazing websites with HTML, CSS, and JavaScript. Create your own portfolio!",
      ageRange: "Ages 12-16",
      level: "Intermediate",
      duration: "10 weeks",
      icon: "🌐",
      color: "pixel-purple",
      lessons: 30
    },
    {
      id: 4,
      title: "Minecraft Modding",
      description: "Code your own Minecraft mods using Java. Bring your wildest game ideas to life!",
      ageRange: "Ages 13-18",
      level: "Intermediate",
      duration: "12 weeks",
      icon: "⛏️",
      color: "pixel-orange",
      lessons: 36
    },
    {
      id: 5,
      title: "AI & Machine Learning",
      description: "Discover the magic of AI! Build smart programs that can learn and make decisions.",
      ageRange: "Ages 15-18",
      level: "Advanced",
      duration: "14 weeks",
      icon: "🤖",
      color: "pixel-red",
      lessons: 42
    },
    {
      id: 6,
      title: "Mobile App Development",
      description: "Create your own mobile apps! Learn to build apps for Android and iOS.",
      ageRange: "Ages 14-18",
      level: "Advanced",
      duration: "16 weeks",
      icon: "📱",
      color: "pixel-yellow",
      lessons: 48
    }
  ];

  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Epic Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your coding adventure! Each course is designed to be engaging, interactive, and fun.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="pixel-card hover:transform hover:scale-105 transition-all duration-300 animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Course Icon & Title */}
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 bg-${course.color} border-2 border-border flex items-center justify-center text-2xl`}>
                  {course.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className={`px-2 py-1 bg-${course.color} text-background text-xs font-bold`}>
                      {course.level}
                    </span>
                    <span>{course.ageRange}</span>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{course.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{course.lessons}</div>
                  <div className="text-xs text-muted-foreground">Lessons</div>
                </div>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-muted h-2 border border-border">
                  <div className="bg-primary h-full w-0 transition-all duration-1000"></div>
                </div>
              </div>

              {/* Learn More Button */}
              <Button className="w-full pixel-button">
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Course Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pixel-green border-2 border-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Lessons</h3>
            <p className="text-muted-foreground">Learn by doing with hands-on coding exercises and real-time feedback.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pixel-blue border-2 border-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Achievement System</h3>
            <p className="text-muted-foreground">Earn badges, unlock levels, and track your progress as you master new skills.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pixel-yellow border-2 border-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Community Support</h3>
            <p className="text-muted-foreground">Join a community of young coders and get help from instructors and peers.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;