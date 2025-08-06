import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="pixel-card">
            <h3 className="text-2xl font-bold mb-6 text-primary">Send us a Message</h3>
            
            {/* Using divs instead of form elements due to sandbox restrictions */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  Student's Name *
                </label>
                <div className="w-full px-4 py-3 bg-input border-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors">
                  Enter student's full name
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  Parent's Email *
                </label>
                <div className="w-full px-4 py-3 bg-input border-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors">
                  parent@example.com
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  Student's Age
                </label>
                <div className="w-full px-4 py-3 bg-input border-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors">
                  Select age range
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  Course Interest
                </label>
                <div className="w-full px-4 py-3 bg-input border-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors">
                  Which course are you interested in?
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  Message
                </label>
                <div className="w-full px-4 py-3 h-32 bg-input border-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors resize-none">
                  Tell us about your child's coding interests and goals...
                </div>
              </div>

              <Button className="w-full pixel-button text-lg py-4">
                🚀 Send Message
              </Button>
            </div>

            {/* Form Features */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-pixel-green border border-border mr-2"></span>
                Quick Response (24hrs)
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-pixel-blue border border-border mr-2"></span>
                Free Consultation
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-pixel-yellow border border-border mr-2"></span>
                Course Recommendations
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-pixel-red border border-border mr-2"></span>
                Flexible Scheduling
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="pixel-card">
              <h3 className="text-2xl font-bold mb-6 text-primary">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pixel-green border-2 border-border flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <div className="font-bold">Our Location</div>
                    <div className="text-muted-foreground">
                      123 Innovation Drive<br/>
                      Tech Valley, CA 94025<br/>
                      United States
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pixel-blue border-2 border-border flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <div className="font-bold">Phone</div>
                    <div className="text-muted-foreground">
                      +1 (555) 123-CODE<br/>
                      <span className="text-xs">Mon-Fri 9AM-6PM PST</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pixel-yellow border-2 border-border flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <div className="font-bold">Email</div>
                    <div className="text-muted-foreground">
                      hello@codeheroes.edu<br/>
                      support@codeheroes.edu
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="pixel-card">
              <h3 className="text-xl font-bold mb-4 text-primary">Find Us</h3>
              <div className="w-full h-64 bg-gradient-to-br from-pixel-blue to-pixel-green border-2 border-border flex items-center justify-center relative overflow-hidden">
                {/* Placeholder map with pixel art style */}
                <div className="absolute inset-4">
                  {/* Road grid pattern */}
                  <div className="w-full h-0.5 bg-background absolute top-8"></div>
                  <div className="w-full h-0.5 bg-background absolute top-16"></div>
                  <div className="w-0.5 h-full bg-background absolute left-8"></div>
                  <div className="w-0.5 h-full bg-background absolute left-16"></div>
                  <div className="w-0.5 h-full bg-background absolute right-8"></div>
                  
                  {/* Location marker */}
                  <div className="absolute top-12 left-12 w-4 h-4 bg-pixel-red border-2 border-background"></div>
                  
                  {/* Buildings */}
                  <div className="absolute top-4 right-4 w-8 h-12 bg-background opacity-80"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-8 bg-background opacity-80"></div>
                  <div className="absolute bottom-4 right-12 w-10 h-10 bg-background opacity-80"></div>
                </div>
                
                <div className="text-center z-10">
                  <div className="text-background font-bold">📍 CodeHeroes HQ</div>
                  <div className="text-xs text-background/80 mt-1">Click to open in Maps</div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pixel-card">
              <h3 className="text-xl font-bold mb-4 text-primary">Follow Us</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="w-12 h-12 bg-pixel-blue border-2 border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                  🐦
                </div>
                <div className="w-12 h-12 bg-pixel-purple border-2 border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                  📸
                </div>
                <div className="w-12 h-12 bg-pixel-red border-2 border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                  📺
                </div>
                <div className="w-12 h-12 bg-pixel-green border-2 border-border flex items-center justify-center hover:transform hover:scale-110 transition-all cursor-pointer">
                  💼
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground mt-2">
                <div className="text-center">Twitter</div>
                <div className="text-center">Instagram</div>
                <div className="text-center">YouTube</div>
                <div className="text-center">LinkedIn</div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="pixel-card">
              <h3 className="text-xl font-bold mb-4 text-primary">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-pixel-green">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-pixel-blue">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-pixel-red">Closed</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                📞 Emergency support available 24/7 for enrolled students
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="pixel-card">
              <h4 className="font-bold mb-2 text-pixel-green">What age groups do you teach?</h4>
              <p className="text-sm text-muted-foreground">We offer courses for kids and teens aged 8-18, with age-appropriate content and teaching methods.</p>
            </div>
            <div className="pixel-card">
              <h4 className="font-bold mb-2 text-pixel-blue">Do you offer trial classes?</h4>
              <p className="text-sm text-muted-foreground">Yes! We offer a free 1-hour trial class so your child can experience our teaching style before enrolling.</p>
            </div>
            <div className="pixel-card">
              <h4 className="font-bold mb-2 text-pixel-yellow">What equipment is needed?</h4>
              <p className="text-sm text-muted-foreground">Just a computer or tablet with internet access. We provide all software and learning materials for free.</p>
            </div>
            <div className="pixel-card">
              <h4 className="font-bold mb-2 text-pixel-red">Can parents track progress?</h4>
              <p className="text-sm text-muted-foreground">Absolutely! Our parent dashboard shows real-time progress, completed projects, and skill development.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;