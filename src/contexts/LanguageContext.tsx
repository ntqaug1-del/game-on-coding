import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'vi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      courses: 'Courses',
      testimonials: 'Testimonials',
      blog: 'Blog',
      contact: 'Contact',
      joinNow: 'Join Now'
    },
    hero: {
      title: 'Learn to Code Like a',
      titleHighlight: 'Game Hero!',
      subtitle: 'Join thousands of young coders on an epic programming adventure. Master the art of coding through interactive lessons, fun projects, and game-like challenges!',
      enrollNow: '🎮 Enroll Now',
      watchDemo: 'Watch Demo',
      stats: {
        youngCoders: 'Young Coders',
        courses: 'Interactive Courses',
        successRate: 'Success Rate'
      }
    },
    about: {
      title: 'About CodeTrio',
      subtitle: 'Where programming meets adventure! We transform coding education into an epic quest.',
      mission: {
        title: 'Our Mission',
        content: 'Founded in 2020 with a simple belief: learning to code should be as exciting as playing your favorite video game. We have revolutionized programming education by gamifying every aspect of the learning experience.'
      },
      gameLike: {
        title: 'Game-Like Learning',
        content: 'Our platform uses leveling systems, achievement badges, coding quests, and interactive challenges to keep students engaged and motivated throughout their coding journey.'
      },
      experts: {
        title: 'Expert Instructors',
        content: 'Our team includes former game developers, software engineers, and education specialists who understand how to make complex concepts accessible and fun for young minds.'
      },
      achievements: {
        title: 'Our Achievements',
        bestEdTech: 'Best Ed-Tech 2023',
        fiveStars: '5-Star Rating',
        satisfaction: '100% Satisfaction',
        innovation: 'Innovation Award'
      }
    },
    courses: {
      title: 'Epic Courses',
      subtitle: 'Choose your coding adventure! Each course is designed to be engaging, interactive, and fun.',
      learnMore: 'Learn More',
      duration: 'Duration',
      lessons: 'Lessons',
      courseProgress: 'Course Progress',
      features: {
        interactive: {
          title: 'Interactive Lessons',
          content: 'Learn by doing with hands-on coding exercises and real-time feedback.'
        },
        achievement: {
          title: 'Achievement System',
          content: 'Earn badges, unlock levels, and track your progress as you master new skills.'
        },
        community: {
          title: 'Community Support',
          content: 'Join a community of young coders and get help from instructors and peers.'
        }
      },
      list: {
        python: {
          title: 'Intro to Python',
          description: 'Start your coding journey with Python! Learn variables, loops, and functions through fun mini-games.',
          ageRange: 'Ages 10-14',
          level: 'Beginner',
          duration: '8 weeks',
          lessons: 24
        },
        scratch: {
          title: 'Game Development with Scratch',
          description: 'Create your own games using Scratch\'s drag-and-drop interface. No prior experience needed!',
          ageRange: 'Ages 8-12',
          level: 'Beginner',
          duration: '6 weeks',
          lessons: 18
        },
        web: {
          title: 'Web Design Basics',
          description: 'Build amazing websites with HTML, CSS, and JavaScript. Create your own portfolio!',
          ageRange: 'Ages 12-16',
          level: 'Intermediate',
          duration: '10 weeks',
          lessons: 30
        },
        minecraft: {
          title: 'Minecraft Modding',
          description: 'Code your own Minecraft mods using Java. Bring your wildest game ideas to life!',
          ageRange: 'Ages 13-18',
          level: 'Intermediate',
          duration: '12 weeks',
          lessons: 36
        },
        ai: {
          title: 'AI & Machine Learning',
          description: 'Discover the magic of AI! Build smart programs that can learn and make decisions.',
          ageRange: 'Ages 15-18',
          level: 'Advanced',
          duration: '14 weeks',
          lessons: 42
        },
        mobile: {
          title: 'Mobile App Development',
          description: 'Create your own mobile apps! Learn to build apps for Android and iOS.',
          ageRange: 'Ages 14-18',
          level: 'Advanced',
          duration: '16 weeks',
          lessons: 48
        }
      }
    },
    testimonials: {
      title: 'Hero Testimonials',
      subtitle: 'Hear from our coding heroes and their families about their amazing journeys!',
      parentsSay: 'What Parents Say',
      stats: {
        completion: 'Course Completion',
        rating: 'Average Rating',
        projects: 'Projects Created',
        recommend: 'Would Recommend'
      }
    },
    blog: {
      title: 'CodeTrio Blog',
      subtitle: 'Stay updated with the latest in coding education, tips for young programmers, and inspiring success stories.',
      categories: {
        all: 'All',
        education: 'Education',
        games: 'Games',
        gettingStarted: 'Getting Started',
        development: 'Development',
        technology: 'Technology',
        successStories: 'Success Stories'
      },
      featured: 'Featured Posts',
      recent: 'Recent Posts',
      readMore: 'Read More',
      read: 'Read',
      newsletter: {
        title: 'Stay Updated!',
        content: 'Subscribe to our newsletter for weekly coding tips, new course announcements, and inspiring student stories.',
        placeholder: 'Enter your email address',
        subscribe: 'Subscribe'
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to start your coding adventure? Get in touch with our team of coding educators!',
      form: {
        title: 'Send us a Message',
        studentName: 'Student\'s Name',
        parentEmail: 'Parent\'s Email',
        studentAge: 'Student\'s Age',
        courseInterest: 'Course Interest',
        message: 'Message',
        send: '🚀 Send Message',
        features: {
          quickResponse: 'Quick Response (24hrs)',
          freeConsultation: 'Free Consultation',
          courseRecommendations: 'Course Recommendations',
          flexibleScheduling: 'Flexible Scheduling'
        }
      },
      info: {
        title: 'Get in Touch',
        location: 'Our Location',
        phone: 'Phone',
        email: 'Email',
        findUs: 'Find Us',
        followUs: 'Follow Us',
        officeHours: 'Office Hours'
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: {
          question: 'What age groups do you teach?',
          answer: 'We offer courses for kids and teens aged 8-18, with age-appropriate content and teaching methods.'
        },
        q2: {
          question: 'Do you offer trial classes?',
          answer: 'Yes! We offer a free 1-hour trial class so your child can experience our teaching style before enrolling.'
        },
        q3: {
          question: 'What equipment is needed?',
          answer: 'Just a computer or tablet with internet access. We provide all software and learning materials for free.'
        },
        q4: {
          question: 'Can parents track progress?',
          answer: 'Absolutely! Our parent dashboard shows real-time progress, completed projects, and skill development.'
        }
      }
    },
    footer: {
      description: 'Transforming young minds through gamified programming education. Join thousands of students on their coding adventures!',
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Info',
      popularCourses: 'Popular Courses',
      resources: 'Resources',
      support: 'Support',
      stayUpdated: 'Stay Updated',
      emailPlaceholder: 'Enter your email',
      copyright: '© 2024 CodeTrio. All rights reserved. | Building future programmers since 2020.',
      poweredBy: 'Powered by passion for coding education and the next generation of programmers'
    }
  },
  vi: {
    nav: {
      home: 'Trang Chủ',
      about: 'Giới Thiệu',
      courses: 'Khóa Học',
      testimonials: 'Đánh Giá',
      blog: 'Blog',
      contact: 'Liên Hệ',
      joinNow: 'Tham Gia Ngay'
    },
    hero: {
      title: 'Học Lập Trình Như Một',
      titleHighlight: 'Siêu Anh Hùng!',
      subtitle: 'Tham gia cùng hàng nghìn bạn trẻ trong cuộc phiêu lưu lập trình tuyệt vời. Làm chủ nghệ thuật lập trình thông qua các bài học tương tác, dự án thú vị và thử thách như game!',
      enrollNow: '🎮 Đăng Ký Ngay',
      watchDemo: 'Xem Demo',
      stats: {
        youngCoders: 'Lập Trình Viên Trẻ',
        courses: 'Khóa Học Tương Tác',
        successRate: 'Tỷ Lệ Thành Công'
      }
    },
    about: {
      title: 'Về CodeTrio',
      subtitle: 'Nơi lập trình gặp gỡ phiêu lưu! Chúng tôi biến đổi việc học lập trình thành một cuộc phiêu lưu tuyệt vời.',
      mission: {
        title: 'Sứ Mệnh Của Chúng Tôi',
        content: 'Thành lập năm 2020 với một niềm tin đơn giản: học lập trình nên thú vị như chơi game yêu thích. Chúng tôi đã cách mạng hóa giáo dục lập trình bằng cách game hóa mọi khía cạnh của trải nghiệm học tập.'
      },
      gameLike: {
        title: 'Học Tập Như Game',
        content: 'Nền tảng của chúng tôi sử dụng hệ thống cấp độ, huy hiệu thành tích, nhiệm vụ lập trình và thử thách tương tác để giữ học sinh hứng thú và có động lực trong suốt hành trình học lập trình.'
      },
      experts: {
        title: 'Giảng Viên Chuyên Nghiệp',
        content: 'Đội ngũ của chúng tôi bao gồm các cựu nhà phát triển game, kỹ sư phần mềm và chuyên gia giáo dục, những người hiểu cách làm cho các khái niệm phức tạp trở nên dễ tiếp cận và thú vị cho những tâm hồn trẻ.'
      },
      achievements: {
        title: 'Thành Tích Của Chúng Tôi',
        bestEdTech: 'Ed-Tech Tốt Nhất 2023',
        fiveStars: 'Đánh Giá 5 Sao',
        satisfaction: '100% Hài Lòng',
        innovation: 'Giải Thưởng Sáng Tạo'
      }
    },
    courses: {
      title: 'Khóa Học Tuyệt Vời',
      subtitle: 'Chọn cuộc phiêu lưu lập trình của bạn! Mỗi khóa học được thiết kế để hấp dẫn, tương tác và thú vị.',
      learnMore: 'Tìm Hiểu Thêm',
      duration: 'Thời Lượng',
      lessons: 'Bài Học',
      courseProgress: 'Tiến Độ Khóa Học',
      features: {
        interactive: {
          title: 'Bài Học Tương Tác',
          content: 'Học bằng cách thực hành với các bài tập lập trình thực tế và phản hồi thời gian thực.'
        },
        achievement: {
          title: 'Hệ Thống Thành Tích',
          content: 'Kiếm huy hiệu, mở khóa cấp độ và theo dõi tiến trình khi bạn thành thạo các kỹ năng mới.'
        },
        community: {
          title: 'Hỗ Trợ Cộng Đồng',
          content: 'Tham gia cộng đồng các lập trình viên trẻ và nhận được sự giúp đỡ từ giảng viên và bạn bè.'
        }
      },
      list: {
        python: {
          title: 'Nhập Môn Python',
          description: 'Bắt đầu hành trình lập trình với Python! Học biến, vòng lặp và hàm thông qua các mini-game thú vị.',
          ageRange: 'Độ tuổi 10-14',
          level: 'Cơ Bản',
          duration: '8 tuần',
          lessons: 24
        },
        scratch: {
          title: 'Phát Triển Game với Scratch',
          description: 'Tạo ra game của riêng bạn bằng giao diện kéo-thả của Scratch. Không cần kinh nghiệm trước đó!',
          ageRange: 'Độ tuổi 8-12',
          level: 'Cơ Bản',
          duration: '6 tuần',
          lessons: 18
        },
        web: {
          title: 'Cơ Bản Thiết Kế Web',
          description: 'Xây dựng những website tuyệt vời với HTML, CSS và JavaScript. Tạo portfolio của riêng bạn!',
          ageRange: 'Độ tuổi 12-16',
          level: 'Trung Cấp',
          duration: '10 tuần',
          lessons: 30
        },
        minecraft: {
          title: 'Minecraft Modding',
          description: 'Lập trình mod Minecraft của riêng bạn bằng Java. Biến những ý tưởng game điên rồ thành hiện thực!',
          ageRange: 'Độ tuổi 13-18',
          level: 'Trung Cấp',
          duration: '12 tuần',
          lessons: 36
        },
        ai: {
          title: 'AI & Học Máy',
          description: 'Khám phá phép màu của AI! Xây dựng các chương trình thông minh có thể học hỏi và đưa ra quyết định.',
          ageRange: 'Độ tuổi 15-18',
          level: 'Nâng Cao',
          duration: '14 tuần',
          lessons: 42
        },
        mobile: {
          title: 'Phát Triển Ứng Dụng Di Động',
          description: 'Tạo ra ứng dụng di động của riêng bạn! Học cách xây dựng ứng dụng cho Android và iOS.',
          ageRange: 'Độ tuổi 14-18',
          level: 'Nâng Cao',
          duration: '16 tuần',
          lessons: 48
        }
      }
    },
    testimonials: {
      title: 'Lời Chứng Thực Từ Anh Hùng',
      subtitle: 'Nghe từ các anh hùng lập trình và gia đình của họ về những hành trình tuyệt vời!',
      parentsSay: 'Phụ Huynh Nói Gì',
      stats: {
        completion: 'Hoàn Thành Khóa Học',
        rating: 'Đánh Giá Trung Bình',
        projects: 'Dự Án Đã Tạo',
        recommend: 'Sẽ Giới Thiệu'
      }
    },
    blog: {
      title: 'Blog CodeTrio',
      subtitle: 'Cập nhật những tin tức mới nhất về giáo dục lập trình, mẹo cho lập trình viên trẻ và những câu chuyện thành công đầy cảm hứng.',
      categories: {
        all: 'Tất Cả',
        education: 'Giáo Dục',
        games: 'Game',
        gettingStarted: 'Bắt Đầu',
        development: 'Phát Triển',
        technology: 'Công Nghệ',
        successStories: 'Câu Chuyện Thành Công'
      },
      featured: 'Bài Viết Nổi Bật',
      recent: 'Bài Viết Gần Đây',
      readMore: 'Đọc Thêm',
      read: 'Đọc',
      newsletter: {
        title: 'Luôn Cập Nhật!',
        content: 'Đăng ký nhận bản tin để nhận mẹo lập trình hàng tuần, thông báo khóa học mới và câu chuyện học sinh đầy cảm hứng.',
        placeholder: 'Nhập địa chỉ email của bạn',
        subscribe: 'Đăng Ký'
      }
    },
    contact: {
      title: 'Liên Hệ Với Chúng Tôi',
      subtitle: 'Sẵn sàng bắt đầu cuộc phiêu lưu lập trình? Hãy liên hệ với đội ngũ giáo viên lập trình của chúng tôi!',
      form: {
        title: 'Gửi Tin Nhắn Cho Chúng Tôi',
        studentName: 'Tên Học Sinh',
        parentEmail: 'Email Phụ Huynh',
        studentAge: 'Tuổi Học Sinh',
        courseInterest: 'Khóa Học Quan Tâm',
        message: 'Tin Nhắn',
        send: '🚀 Gửi Tin Nhắn',
        features: {
          quickResponse: 'Phản Hồi Nhanh (24h)',
          freeConsultation: 'Tư Vấn Miễn Phí',
          courseRecommendations: 'Gợi Ý Khóa Học',
          flexibleScheduling: 'Lịch Học Linh Hoạt'
        }
      },
      info: {
        title: 'Thông Tin Liên Hệ',
        location: 'Địa Chỉ Của Chúng Tôi',
        phone: 'Điện Thoại',
        email: 'Email',
        findUs: 'Tìm Chúng Tôi',
        followUs: 'Theo Dõi Chúng Tôi',
        officeHours: 'Giờ Làm Việc'
      },
      faq: {
        title: 'Câu Hỏi Thường Gặp',
        q1: {
          question: 'Các bạn dạy cho độ tuổi nào?',
          answer: 'Chúng tôi cung cấp khóa học cho trẻ em và thanh thiếu niên từ 8-18 tuổi, với nội dung và phương pháp giảng dạy phù hợp với từng độ tuổi.'
        },
        q2: {
          question: 'Có cung cấp lớp học thử không?',
          answer: 'Có! Chúng tôi cung cấp lớp học thử miễn phí 1 tiếng để con bạn có thể trải nghiệm phong cách giảng dạy trước khi đăng ký.'
        },
        q3: {
          question: 'Cần thiết bị gì?',
          answer: 'Chỉ cần máy tính hoặc tablet có kết nối internet. Chúng tôi cung cấp miễn phí tất cả phần mềm và tài liệu học tập.'
        },
        q4: {
          question: 'Phụ huynh có thể theo dõi tiến độ không?',
          answer: 'Hoàn toàn có thể! Bảng điều khiển phụ huynh cho phép xem tiến độ thời gian thực, dự án đã hoàn thành và sự phát triển kỹ năng.'
        }
      }
    },
    footer: {
      description: 'Biến đổi tâm hồn trẻ thông qua giáo dục lập trình được game hóa. Tham gia cùng hàng nghìn học sinh trong cuộc phiêu lưu lập trình!',
      quickLinks: 'Liên Kết Nhanh',
      contactInfo: 'Thông Tin Liên Hệ',
      popularCourses: 'Khóa Học Phổ Biến',
      resources: 'Tài Nguyên',
      support: 'Hỗ Trợ',
      stayUpdated: 'Luôn Cập Nhật',
      emailPlaceholder: 'Nhập email của bạn',
      copyright: '© 2024 CodeTrio. Bảo lưu mọi quyền. | Xây dựng lập trình viên tương lai từ năm 2020.',
      poweredBy: 'Được tạo ra bởi niềm đam mê giáo dục lập trình và thế hệ lập trình viên tương lai'
    }
  }
};