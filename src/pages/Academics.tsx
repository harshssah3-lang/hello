import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Book, Microscope, Calculator, Globe, Palette, Music, Users, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button-variants";
import { getSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

const iconMap: { [key: string]: any } = {
  Book, Calculator, Microscope, Globe, Palette, Music, Cpu, Users
};

interface Department {
  id: string;
  icon: string;
  title: string;
  description: string;
  programs: string[];
  color: string;
}

interface Achievement {
  id: string;
  value: string;
  label: string;
}

const Academics = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadData();
    
    const unsubDepts = subscribeToSupabaseChanges<Department[]>(
      'royal-academy-academic-departments',
      (newData) => setDepartments(newData)
    );
    
    const unsubAchievements = subscribeToSupabaseChanges<Achievement[]>(
      'royal-academy-academic-achievements',
      (newData) => setAchievements(newData)
    );
    
    return () => {
      unsubDepts();
      unsubAchievements();
    };
  }, []);

  const loadData = async () => {
    try {
      const defaultDepartments: Department[] = [
        {
          id: '1',
          icon: 'Book',
          title: 'Literature & Languages',
          description: 'Comprehensive language arts program covering English, Foreign languages, and Creative Writing.',
          programs: ['Advanced English', 'World Literature', 'Creative Writing', 'Foreign Languages'],
          color: 'from-blue-500/20 to-purple-500/20'
        },
        {
          id: '2',
          icon: 'Calculator',
          title: 'Mathematics & Statistics',
          description: 'Advanced mathematical concepts from algebra to calculus and statistical analysis.',
          programs: ['Pre-Calculus', 'Advanced Calculus', 'Statistics', 'Applied Mathematics'],
          color: 'from-green-500/20 to-blue-500/20'
        },
        {
          id: '3',
          icon: 'Microscope',
          title: 'Sciences',
          description: 'Hands-on laboratory experiences in Biology, Chemistry, Physics, and Environmental Science.',
          programs: ['Advanced Biology', 'Organic Chemistry', 'Quantum Physics', 'Environmental Science'],
          color: 'from-purple-500/20 to-pink-500/20'
        },
        {
          id: '4',
          icon: 'Globe',
          title: 'Social Studies',
          description: 'Understanding human civilization, governance, economics, and cultural diversity.',
          programs: ['World History', 'Government & Politics', 'Economics', 'Cultural Studies'],
          color: 'from-orange-500/20 to-red-500/20'
        },
        {
          id: '5',
          icon: 'Palette',
          title: 'Fine Arts',
          description: 'Creative expression through visual arts, design, and multimedia production.',
          programs: ['Studio Art', 'Digital Design', 'Art History', 'Multimedia Production'],
          color: 'from-pink-500/20 to-purple-500/20'
        },
        {
          id: '6',
          icon: 'Music',
          title: 'Performing Arts',
          description: 'Musical excellence through choir, orchestra, band, and individual instruction.',
          programs: ['Concert Choir', 'Symphony Orchestra', 'Jazz Band', 'Music Theory'],
          color: 'from-yellow-500/20 to-orange-500/20'
        },
        {
          id: '7',
          icon: 'Cpu',
          title: 'Technology & Engineering',
          description: 'Cutting-edge computer science, robotics, and engineering fundamentals.',
          programs: ['Computer Science', 'Robotics', 'Engineering Design', 'Data Science'],
          color: 'from-blue-500/20 to-green-500/20'
        },
        {
          id: '8',
          icon: 'Users',
          title: 'Leadership & Ethics',
          description: 'Character development, leadership skills, and ethical decision-making.',
          programs: ['Student Government', 'Ethics & Philosophy', 'Community Service', 'Debate Team'],
          color: 'from-red-500/20 to-pink-500/20'
        }
      ];

      const defaultAchievements: Achievement[] = [
        { id: '1', value: '98%', label: 'College Acceptance Rate' },
        { id: '2', value: '1450', label: 'Average SAT Score' },
        { id: '3', value: '32', label: 'Average ACT Score' },
        { id: '4', value: '$2.3M', label: 'Scholarships Awarded Annually' }
      ];

      const depts = await getSupabaseData<Department[]>('royal-academy-academic-departments', defaultDepartments);
      const achieves = await getSupabaseData<Achievement[]>('royal-academy-academic-achievements', defaultAchievements);
      
      setDepartments(depts);
      setAchievements(achieves);
    } catch (error) {
      console.error('[Academics] Error loading data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-crimson/20"></div>
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Academic <span className="text-gradient-gold">Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive curriculum designed to challenge, inspire, and prepare students for success in higher education and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Academic Departments */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Our Departments</h2>
            <p className="text-xl text-muted-foreground">Explore our comprehensive academic programs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {departments.map((dept, index) => {
              const IconComponent = iconMap[dept.icon] || Book;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    z: 50 
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="card-3d p-6 group cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10 space-y-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center"
                    >
                      <IconComponent className="h-6 w-6 text-gold" />
                    </motion.div>
                    <h3 className="text-xl font-heading font-semibold">{dept.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{dept.description}</p>
                    <div className="space-y-1">
                      {dept.programs.map((program, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="text-sm text-gold font-medium"
                        >
                          • {program}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Achievements */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Academic Performance</h2>
            <p className="text-xl text-muted-foreground">Excellence reflected in our students' achievements</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotateX: 15
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                className="card-3d p-8 text-center group cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                  className="text-5xl font-heading font-bold text-gradient-gold mb-4"
                >
                  {achievement.value}
                </motion.div>
                <p className="text-muted-foreground text-lg">{achievement.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/curriculum-guide">
              <Button 
                variant="hero" 
                size="xl" 
                className="group bg-gradient-to-r from-gold to-yellow-500 text-black hover:from-gold/80 hover:to-yellow-500/80 font-semibold"
                onClick={() => console.log('Curriculum Guide button clicked')}
              >
                View Curriculum Guide
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="ml-2"
                >
                  →
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
