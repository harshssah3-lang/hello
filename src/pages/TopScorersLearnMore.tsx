import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Trophy, Medal, Award, Star, GraduationCap, BookOpen, Target, 
  TrendingUp, Crown, Zap, Users, Calendar, MapPin, Phone, Mail,
  ChevronRight, ArrowLeft, ExternalLink, Download, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TopScorersLearnMore = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "programs", label: "Programs", icon: GraduationCap },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "contact", label: "Contact", icon: Phone }
  ];

  const achievements = [
    {
      year: "2024",
      title: "Record Breaking Performance",
      description: "98.5% average score across all subjects - highest in school history",
      icon: Crown,
      color: "from-gold to-yellow-500"
    },
    {
      year: "2024",
      title: "International Recognition",
      description: "15 students qualified for international olympiads",
      icon: Trophy,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2023-2024",
      title: "University Admissions",
      description: "100% acceptance rate to top-tier universities",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2024",
      title: "Research Publications",
      description: "12 student research papers published in academic journals",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const programs = [
    {
      name: "Advanced Placement Program",
      description: "Rigorous college-level courses with university credit opportunities",
      features: ["25+ AP Courses", "Expert Faculty", "College Credit", "University Partnerships"],
      icon: Target
    },
    {
      name: "Research & Innovation Track",
      description: "Independent research projects with mentorship from industry experts",
      features: ["1-on-1 Mentoring", "Lab Access", "Publication Support", "Conference Presentations"],
      icon: Zap
    },
    {
      name: "Leadership Development",
      description: "Comprehensive leadership training and real-world application",
      features: ["Student Government", "Community Projects", "Internships", "Global Exchanges"],
      icon: Users
    },
    {
      name: "Academic Excellence Support",
      description: "Personalized support system for high-achieving students",
      features: ["Tutoring", "Study Groups", "Exam Prep", "Career Counseling"],
      icon: Star
    }
  ];

  const testimonials = [
    {
      name: "Emma Richardson",
      role: "Valedictorian 2024",
      quote: "Royal Academy provided me with the perfect environment to excel. The teachers pushed me to reach my potential while supporting every step of my journey.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "Harvard University - Full Scholarship"
    },
    {
      name: "James Chen",
      role: "Math Olympiad Gold Medalist",
      quote: "The advanced mathematics program here is exceptional. I was able to compete at international levels thanks to the rigorous training and support.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "MIT - Early Admission"
    },
    {
      name: "Dr. Sarah Williams",
      role: "Parent & Alumni",
      quote: "As both a parent and alumna, I've seen firsthand how Royal Academy transforms students into confident, capable leaders ready for any challenge.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      achievement: "Parent of 2024 Top Scorer"
    }
  ];

  const stats = [
    { number: "98.5%", label: "Average Score", description: "Highest in school history" },
    { number: "100%", label: "University Acceptance", description: "Top-tier institutions" },
    { number: "15", label: "International Qualifiers", description: "Olympic competitions" },
    { number: "12", label: "Research Publications", description: "Student-led studies" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <Link to="/top-scorers">
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-royal/10 to-gold/10 hover:from-royal/20 hover:to-gold/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Top Scorers
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                <span>/</span>
                <Link to="/top-scorers" className="hover:text-gold transition-colors">Top Scorers</Link>
                <span>/</span>
                <span className="text-gold">Learn More</span>
              </div>
            </div>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <Crown className="h-12 w-12 text-gold animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-heading font-bold">
                Academic <span className="text-gradient-gold">Excellence</span>
              </h1>
              <Trophy className="h-12 w-12 text-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
            </motion.div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the comprehensive programs, achievements, and support systems that make our top scorers exceptional leaders of tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black">
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Success Stories
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-royal/10 to-gold/10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 md:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-foreground mb-1 text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto scrollbar-none">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-gold to-yellow-500 text-black shadow-lg"
                    : "bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
                    Excellence in Education
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                    At Royal Academy, we believe every student has the potential for greatness. Our comprehensive approach to education combines rigorous academics, innovative teaching methods, and personalized support to help students achieve their highest potential.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Personalized Learning",
                      description: "Tailored educational paths that adapt to each student's unique strengths and learning style.",
                      icon: Target,
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      title: "Expert Faculty",
                      description: "World-class educators with advanced degrees and industry experience.",
                      icon: GraduationCap,
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      title: "Innovation Focus",
                      description: "Cutting-edge technology and research opportunities in every discipline.",
                      icon: Zap,
                      color: "from-green-500 to-emerald-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6 text-center"
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-heading font-bold mb-3 text-gradient-gold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
                    Outstanding Achievements
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Our students consistently achieve remarkable results across all academic disciplines and extracurricular activities.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center flex-shrink-0`}>
                        <achievement.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-heading font-bold text-gradient-gold">
                            {achievement.title}
                          </h3>
                          <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "programs" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
                    Academic Programs
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Comprehensive programs designed to challenge, inspire, and prepare students for success in higher education and beyond.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {programs.map((program, index) => (
                    <motion.div
                      key={program.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                          <program.icon className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-gradient-gold">
                          {program.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {program.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {program.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <ChevronRight className="h-4 w-4 text-gold flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
                    Success Stories
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Hear from our top scorers, parents, and alumni about their transformative experiences at Royal Academy.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6 text-center"
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gold/20"
                      />
                      <h3 className="text-lg font-heading font-bold text-gradient-gold mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{testimonial.role}</p>
                      <blockquote className="text-muted-foreground italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="text-xs text-gold font-medium bg-gold/10 px-3 py-1 rounded-full">
                        {testimonial.achievement}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gradient-gold">
                    Get In Touch
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Ready to join our community of academic excellence? Contact us to learn more about our programs and admission process.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Admissions Office",
                      icon: GraduationCap,
                      details: [
                        { icon: Phone, text: "+1 (555) 123-4567" },
                        { icon: Mail, text: "admissions@royalacademy.edu" },
                        { icon: Calendar, text: "Mon-Fri: 8:00 AM - 5:00 PM" }
                      ]
                    },
                    {
                      title: "Academic Affairs",
                      icon: BookOpen,
                      details: [
                        { icon: Phone, text: "+1 (555) 123-4568" },
                        { icon: Mail, text: "academics@royalacademy.edu" },
                        { icon: Calendar, text: "Mon-Fri: 9:00 AM - 4:00 PM" }
                      ]
                    },
                    {
                      title: "Campus Location",
                      icon: MapPin,
                      details: [
                        { icon: MapPin, text: "123 Excellence Boulevard" },
                        { icon: MapPin, text: "Academic City, AC 12345" },
                        { icon: ExternalLink, text: "View on Maps" }
                      ]
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card-3d p-6 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center mx-auto mb-4">
                        <contact.icon className="h-8 w-8 text-black" />
                      </div>
                      <h3 className="text-xl font-heading font-bold mb-4 text-gradient-gold">
                        {contact.title}
                      </h3>
                      <div className="space-y-3">
                        {contact.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center justify-center space-x-2 text-muted-foreground">
                            <detail.icon className="h-4 w-4 text-gold flex-shrink-0" />
                            <span className="text-sm">{detail.text}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link to="/admissions">
                    <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Start Your Application
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TopScorersLearnMore;
