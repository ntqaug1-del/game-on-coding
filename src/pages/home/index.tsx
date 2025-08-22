import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FileText, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UtilityGrid from '@/components/UtilityGrid';
import UniqueVisitCounter from '@/components/UniqueVisitCounter';
import Footer from '@/components/Footer';

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Image options for hero section
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      alt: "AI Generated Letter A",
      description: "Computer generated image of the letter A"
    },
    {
      url: "https://images.unsplash.com/photo-1694903089438-bf28d4697d9a",
      alt: "Human and Robot Hands Touching",
      description: "Two hands touching each other in front of a blue background"
    },
    {
      url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01",
      alt: "AI Brain Circuit Board",
      description: "A computer circuit board with a brain on it"
    },
    {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      alt: "Coding on Laptop",
      description: "A MacBook with lines of code on its screen"
    }
  ];

  // Selected hero image (change index to use different image: 0-3)
  const selectedHeroImage = heroImages[1];

  // Featured utilities
  const featuredUtilities = [
    {
      icon: <FileText className="h-6 w-6 text-teal-500" />,
      title: "My Resume",
      description: "Professional resume displaying skills, work experience, and educational background",
      path: "/resume"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      title: "Text to Speech",
      description: "Convert text to natural-sounding speech with AI voices",
      path: "/text-to-speech"
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Elite Web",
      description: "Discover and share the best websites across the internet",
      path: "/elite-web"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Football Formation",
      description: "Build and customize football team formations",
      path: "/football-formation-builder"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 tracking-tight leading-tight">
                NTQ's <span className="text-blue-600">AI-Powered</span> Utilities
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Discover a collection of powerful web applications, meticulously crafted through AI collaboration.
                Enhance your productivity and solve real-world challenges with our easy-to-use tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg flex items-center gap-2 text-base"
                  onClick={() => document.getElementById('all-utilities')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Utilities
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/visit-counter-demo">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-6 rounded-lg flex items-center gap-2 text-base w-full">
                    View Counter Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <UniqueVisitCounter
                  pageName="home"
                  variant="pill"
                  className="mx-auto sm:mx-0"
                  showAnimation={true}
                />
              </div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src={`${selectedHeroImage.url}?q=80&w=1200&auto=format&fit=crop`}
                  alt={selectedHeroImage.alt}
                  className="max-w-full h-auto rounded-lg shadow-lg object-cover"
                  style={{ maxHeight: '500px' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  AI-Powered Tools
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  Photo from Unsplash
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Utilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Utilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular tools designed to make your life easier
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuredUtilities.map((utility, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group"
                variants={itemVariants}
                onClick={() => window.location.href = utility.path}
              >
                <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-50 transition-colors duration-300">
                  {utility.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{utility.title}</h3>
                <p className="text-gray-600">{utility.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Explore
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Personal Welcome Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to NTQ's Utilities</h2>
            <p className="text-gray-600 mb-6">
              I've created these tools to help solve everyday problems and boost productivity.
              Each utility is designed with simplicity and effectiveness in mind.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-700 italic">
                "The best way to predict the future is to create it. These tools represent my vision for
                making technology more accessible and useful for everyone."
              </p>
              <p className="text-blue-600 font-medium mt-2">— NTQ</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Utilities Grid */}
      <section id="all-utilities" className="py-16 scroll-mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">All Utilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of powerful tools
            </p>
          </div>

          <UtilityGrid activeFilter="All" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
