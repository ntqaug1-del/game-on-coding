import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Courses = () => {
  const { t } = useLanguage();
  const courses = [
    {
      id: 1,
      title: t('courses.list.python.title'),
      description: t('courses.list.python.description'),
      ageRange: t('courses.list.python.ageRange'),
      level: t('courses.list.python.level'),
      duration: t('courses.list.python.duration'),
      icon: "🐍",
      color: "pixel-green",
      lessons: t('courses.list.python.lessons')
    },
    {
      id: 2,
      title: t('courses.list.scratch.title'),
      description: t('courses.list.scratch.description'),
      ageRange: t('courses.list.scratch.ageRange'),
      level: t('courses.list.scratch.level'),
      duration: t('courses.list.scratch.duration'),
      icon: "🎮",
      color: "pixel-blue",
      lessons: t('courses.list.scratch.lessons')
    },
    {
      id: 3,
      title: t('courses.list.web.title'),
      description: t('courses.list.web.description'),
      ageRange: t('courses.list.web.ageRange'),
      level: t('courses.list.web.level'),
      duration: t('courses.list.web.duration'),
      icon: "🌐",
      color: "pixel-purple",
      lessons: t('courses.list.web.lessons')
    },
    {
      id: 4,
      title: t('courses.list.minecraft.title'),
      description: t('courses.list.minecraft.description'),
      ageRange: t('courses.list.minecraft.ageRange'),
      level: t('courses.list.minecraft.level'),
      duration: t('courses.list.minecraft.duration'),
      icon: "⛏️",
      color: "pixel-orange",
      lessons: t('courses.list.minecraft.lessons')
    },
    {
      id: 5,
      title: t('courses.list.ai.title'),
      description: t('courses.list.ai.description'),
      ageRange: t('courses.list.ai.ageRange'),
      level: t('courses.list.ai.level'),
      duration: t('courses.list.ai.duration'),
      icon: "🤖",
      color: "pixel-red",
      lessons: t('courses.list.ai.lessons')
    },
    {
      id: 6,
      title: t('courses.list.mobile.title'),
      description: t('courses.list.mobile.description'),
      ageRange: t('courses.list.mobile.ageRange'),
      level: t('courses.list.mobile.level'),
      duration: t('courses.list.mobile.duration'),
      icon: "📱",
      color: "pixel-yellow",
      lessons: t('courses.list.mobile.lessons')
    }
  ];

  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            {t('courses.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('courses.subtitle')}
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
                  <div className="text-xs text-muted-foreground">{t('courses.duration')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{course.lessons}</div>
                  <div className="text-xs text-muted-foreground">{t('courses.lessons')}</div>
                </div>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('courses.courseProgress')}</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-muted h-2 border border-border">
                  <div className="bg-primary h-full w-0 transition-all duration-1000"></div>
                </div>
              </div>

              {/* Learn More Button */}
              <Button className="w-full pixel-button">
                {t('courses.learnMore')}
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
            <h3 className="text-xl font-bold mb-2">{t('courses.features.interactive.title')}</h3>
            <p className="text-muted-foreground">{t('courses.features.interactive.content')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pixel-blue border-2 border-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('courses.features.achievement.title')}</h3>
            <p className="text-muted-foreground">{t('courses.features.achievement.content')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pixel-yellow border-2 border-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('courses.features.community.title')}</h3>
            <p className="text-muted-foreground">{t('courses.features.community.content')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;