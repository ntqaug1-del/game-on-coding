const Footer = () => {
  return (
    <footer className="bg-background border-t-2 border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pixel-green to-pixel-blue border-2 border-border relative">
                {/* Pixel art computer icon */}
                <div className="absolute inset-1 bg-background">
                  <div className="w-full h-1 bg-pixel-green mt-1"></div>
                  <div className="w-4 h-1 bg-pixel-blue mx-auto mt-1"></div>
                  <div className="w-full h-1 bg-pixel-yellow mt-1"></div>
                  <div className="w-2 h-2 bg-pixel-red mx-auto mt-1 rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold glow-text">CodeHeroes</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Transforming young minds through gamified programming education. 
              Join thousands of students on their coding adventures!
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-pixel-blue border border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                🐦
              </div>
              <div className="w-8 h-8 bg-pixel-purple border border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                📸
              </div>
              <div className="w-8 h-8 bg-pixel-red border border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                📺
              </div>
              <div className="w-8 h-8 bg-pixel-green border border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                💼
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-pixel-green">📍</span>
                <div className="text-muted-foreground">
                  123 Innovation Drive<br/>
                  Tech Valley, CA 94025
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pixel-blue">📞</span>
                <span className="text-muted-foreground">+1 (555) 123-CODE</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pixel-yellow">✉️</span>
                <span className="text-muted-foreground">hello@codeheroes.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Courses */}
            <div>
              <h4 className="font-bold mb-3 text-primary">Popular Courses</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Python for Beginners</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Scratch Game Development</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Web Design Basics</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Minecraft Modding</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-3 text-primary">Resources</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Student Portal</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Parent Dashboard</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Coding Challenges</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Project Showcase</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-3 text-primary">Support</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Technical Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="max-w-md">
            <h4 className="font-bold mb-3 text-primary">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly coding tips and course updates delivered to your inbox!
            </p>
            <div className="flex space-x-2">
              <div className="flex-1 px-3 py-2 bg-input border border-border text-sm text-foreground">
                Enter your email
              </div>
              <div className="px-4 py-2 bg-primary text-primary-foreground border border-border cursor-pointer hover:bg-primary/90 transition-colors text-sm font-bold">
                Subscribe
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 CodeHeroes. All rights reserved. | Building future programmers since 2020.
            </div>
            
            {/* Achievement Badges */}
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-pixel-green border border-border flex items-center justify-center text-xs">
                🏆
              </div>
              <div className="w-6 h-6 bg-pixel-blue border border-border flex items-center justify-center text-xs">
                ⭐
              </div>
              <div className="w-6 h-6 bg-pixel-yellow border border-border flex items-center justify-center text-xs">
                🎯
              </div>
              <div className="w-6 h-6 bg-pixel-red border border-border flex items-center justify-center text-xs">
                🚀
              </div>
            </div>
          </div>
          
          {/* Powered by message */}
          <div className="text-center mt-4">
            <div className="text-xs text-muted-foreground">
              Powered by passion for coding education and the next generation of programmers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;