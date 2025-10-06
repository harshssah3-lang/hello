import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Star, GraduationCap, BookOpen, Target, TrendingUp, Crown, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TopScorers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [categories, setCategories] = useState([
    { id: "all", name: "All Subjects", icon: BookOpen },
    { id: "science", name: "Science", icon: Zap },
    { id: "mathematics", name: "Mathematics", icon: Target },
    { id: "english", name: "English", icon: BookOpen },
    { id: "overall", name: "Overall Performance", icon: Crown }
  ]);
  const [years, setYears] = useState([
    { id: "2024", name: "2024" },
    { id: "2023", name: "2023" },
    { id: "2022", name: "2022" }
  ]);

  // Load categories, years, and students from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('royal-academy-categories');
    const savedYears = localStorage.getItem('royal-academy-years');
    const savedStudents = localStorage.getItem('royal-academy-top-scorers');
    
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories([{ id: "all", name: "All Subjects", icon: BookOpen }, ...parsedCategories]);
    }
    
    if (savedYears) {
      setYears(JSON.parse(savedYears));
      setSelectedYear(JSON.parse(savedYears)[0]?.id || "2024");
    }
    
    if (savedStudents) {
      setTopScorers(JSON.parse(savedStudents));
    }
  }, []);

  const [topScorers, setTopScorers] = useState([
    // Default data - will be replaced by localStorage data
    {
      id: 1,
      name: "Emma Richardson",
      slug: "emma-richardson",
      grade: "Grade 12",
      subject: "overall",
      score: "98.5%",
      year: "2024",
      rank: 1,
      achievements: ["Valedictorian", "Science Olympiad Gold", "Math Competition Winner"],
      image: "https://images.unsplash.com/photo-1494790108755-2616c669-b163?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Outstanding performance across all subjects with exceptional leadership qualities."
    },
    {
      id: 2,
      name: "James Chen",
      slug: "james-chen",
      grade: "Grade 11",
      subject: "mathematics",
      score: "99.2%",
      year: "2024",
      rank: 1,
      achievements: ["International Math Olympiad", "Regional Champion", "Perfect SAT Math"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Mathematical genius with exceptional problem-solving abilities."
    },
    {
      id: 3,
      name: "Sophia Martinez",
      slug: "sophia-martinez",
      grade: "Grade 10",
      subject: "science",
      score: "97.8%",
      year: "2024",
      rank: 1,
      achievements: ["Science Fair Winner", "Research Publication", "Lab Excellence Award"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Brilliant scientist with innovative research in environmental studies."
    },
    {
      id: 4,
      name: "Alexander Thompson",
      slug: "alexander-thompson",
      grade: "Grade 12",
      subject: "english",
      score: "96.7%",
      year: "2024",
      rank: 1,
      achievements: ["Literary Magazine Editor", "Debate Champion", "Writing Contest Winner"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Exceptional writer and orator with outstanding communication skills."
    },
    {
      id: 5,
      name: "Priya Patel",
      slug: "priya-patel",
      grade: "Grade 11",
      subject: "science",
      score: "97.1%",
      year: "2024",
      rank: 2,
      achievements: ["Chemistry Excellence", "Lab Research Assistant", "STEM Leadership"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Chemistry enthusiast with groundbreaking laboratory research."
    },
    {
      id: 6,
      name: "Michael Johnson",
      slug: "michael-johnson",
      grade: "Grade 10",
      subject: "mathematics",
      score: "96.9%",
      year: "2024",
      rank: 2,
      achievements: ["Calculus Prodigy", "Math Tutor", "Academic Excellence"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Mathematical talent with exceptional analytical thinking."
    },

    // 2023 Top Scorers
    {
      id: 7,
      name: "Isabella Rodriguez",
      slug: "isabella-rodriguez",
      grade: "Grade 12",
      subject: "overall",
      score: "97.9%",
      year: "2023",
      rank: 1,
      achievements: ["Class Valedictorian", "Student Council President", "Academic Excellence"],
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Exceptional all-around student with strong leadership skills."
    },
    {
      id: 8,
      name: "David Kim",
      slug: "david-kim",
      grade: "Grade 11",
      subject: "science",
      score: "98.3%",
      year: "2023",
      rank: 1,
      achievements: ["Physics Olympiad Gold", "Research Intern", "Innovation Award"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      description: "Physics prodigy with innovative experimental approaches."
    }
  ]);

  const filteredScorers = topScorers.filter(scorer => {
    const categoryMatch = selectedCategory === "all" || scorer.subject === selectedCategory;
    const yearMatch = scorer.year === selectedYear;
    return categoryMatch && yearMatch;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-gold/20 to-yellow-500/20 border-gold/30";
      case 2:
        return "from-gray-300/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "from-amber-400/20 to-amber-600/20 border-amber-500/30";
      default:
        return "from-blue-400/20 to-blue-600/20 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        
        {/* Floating Achievement Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 text-gold/20"
          >
            <Trophy className="h-24 w-24" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-16 text-crimson/20"
          >
            <GraduationCap className="h-20 w-20" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-10 text-royal/20"
          >
            <Star className="h-16 w-16" />
          </motion.div>
        </div>
        
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <Trophy className="h-12 w-12 text-gold animate-bounce" />
              <h1 className="text-5xl md:text-6xl font-heading font-bold">
                Top <span className="text-gradient-gold">Scorers</span>
              </h1>
              <Trophy className="h-12 w-12 text-gold animate-bounce" style={{ animationDelay: '0.5s' }} />
            </motion.div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Celebrating academic excellence and outstanding achievements of our brilliant students at Royal Academy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/top-scorers/learn-more">
                <Button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Learn More About Our Programs
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/admissions">
                <Button variant="outline" className="border-gold/30 text-gold hover:text-gold/80 hover:bg-gold/10 px-8 py-4 text-lg rounded-xl transition-all duration-300">
                  <Trophy className="h-5 w-5 mr-2" />
                  Apply Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-gold/5">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            
            {/* Category Filter */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-heading font-semibold mb-4 text-gradient-gold">Filter by Subject</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gold text-black shadow-lg"
                        : "bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-heading font-semibold mb-4 text-gradient-gold">Academic Year</h3>
              <div className="flex gap-3">
                {years.map((year, index) => (
                  <motion.button
                    key={year.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedYear(year.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedYear === year.id
                        ? "bg-gradient-to-r from-gold to-yellow-500 text-black shadow-lg"
                        : "bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {year.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Scorers Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence>
              {filteredScorers.map((scorer, index) => (
                <motion.div
                  key={scorer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -10,
                    rotateY: 5
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  className={`card-3d overflow-hidden bg-gradient-to-br ${getRankColor(scorer.rank)} backdrop-blur-sm`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-background to-card border-2 border-gold flex items-center justify-center shadow-lg"
                    >
                      {getRankIcon(scorer.rank)}
                    </motion.div>
                  </div>

                  {/* Student Photo */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={scorer.image} 
                      alt={scorer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Score Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="absolute bottom-4 right-4 bg-gold text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg"
                    >
                      {scorer.score}
                    </motion.div>
                  </div>

                  {/* Student Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-gradient-gold mb-1">
                          {scorer.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">{scorer.grade}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Rank</div>
                        <div className="text-2xl font-bold text-gold">#{scorer.rank}</div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {scorer.description}
                    </p>

                    {/* Achievements */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-foreground">Key Achievements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scorer.achievements.map((achievement, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="px-2 py-1 bg-muted/30 text-xs rounded-full border border-border"
                          >
                            {achievement}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Learn More Button */}
                    <div className="pt-4 border-t border-border/30">
                      <Link to={`/student/${scorer.slug}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-gold/10 to-yellow-500/10 hover:from-gold/20 hover:to-yellow-500/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Learn More About {scorer.name}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results Message */}
          {filteredScorers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No top scorers found for the selected criteria. Try adjusting your filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TopScorers;
