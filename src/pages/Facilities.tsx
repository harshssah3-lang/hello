import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car } from "lucide-react";
import { getSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

const iconMap: { [key: string]: any } = {
  BookOpen, Beaker, Dumbbell, Theater, Cpu, Heart, Coffee, Car
};

interface Facility {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    loadData();
    
    const unsubFacilities = subscribeToSupabaseChanges<Facility[]>(
      'royal-academy-facilities',
      (newData) => setFacilities(newData)
    );
    
    const unsubStats = subscribeToSupabaseChanges<Stat[]>(
      'royal-academy-facility-stats',
      (newData) => setStats(newData)
    );
    
    return () => {
      unsubFacilities();
      unsubStats();
    };
  }, []);

  const loadData = async () => {
    try {
      const defaultFacilities: Facility[] = [
        {
          id: '1',
          icon: 'BookOpen',
          title: 'Royal Library',
          description: 'A magnificent 3-story library with over 100,000 books, digital resources, and quiet study spaces.',
          features: ['Digital Archives', 'Research Stations', 'Group Study Rooms', 'Reading Gardens'],
          image: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
        },
        {
          id: '2',
          icon: 'Beaker',
          title: 'Science Laboratories',
          description: 'State-of-the-art labs for Biology, Chemistry, Physics, and Environmental Science research.',
          features: ['Advanced Equipment', 'Safety Systems', 'Research Facilities', 'Greenhouse Complex'],
          image: 'bg-gradient-to-br from-green-600/20 to-blue-600/20'
        },
        {
          id: '3',
          icon: 'Cpu',
          title: 'Technology Center',
          description: 'Modern computer labs with latest hardware, robotics workshop, and maker spaces.',
          features: ['3D Printing Lab', 'Robotics Workshop', 'Computer Labs', 'Innovation Studio'],
          image: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'
        },
        {
          id: '4',
          icon: 'Dumbbell',
          title: 'Athletic Complex',
          description: 'Comprehensive sports facilities including gymnasium, swimming pool, and outdoor fields.',
          features: ['Olympic Pool', 'Fitness Center', 'Sports Fields', 'Indoor Courts'],
          image: 'bg-gradient-to-br from-orange-600/20 to-red-600/20'
        },
        {
          id: '5',
          icon: 'Theater',
          title: 'Performing Arts Center',
          description: 'Professional-grade theater, music halls, and practice rooms for artistic excellence.',
          features: ['Main Theater', 'Concert Hall', 'Practice Rooms', 'Recording Studio'],
          image: 'bg-gradient-to-br from-pink-600/20 to-purple-600/20'
        },
        {
          id: '6',
          icon: 'Heart',
          title: 'Health & Wellness Center',
          description: 'Complete healthcare facility with medical staff, counseling services, and wellness programs.',
          features: ['Medical Clinic', 'Counseling Center', 'Wellness Programs', 'Nutrition Services'],
          image: 'bg-gradient-to-br from-red-600/20 to-pink-600/20'
        },
        {
          id: '7',
          icon: 'Coffee',
          title: 'Student Commons',
          description: 'Central hub for student life with dining facilities, lounges, and collaborative spaces.',
          features: ['Dining Hall', 'Student Lounges', 'Collaborative Spaces', 'Outdoor Terraces'],
          image: 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20'
        },
        {
          id: '8',
          icon: 'Car',
          title: 'Transportation',
          description: 'Safe and reliable transportation services connecting students to the academy.',
          features: ['School Buses', 'Shuttle Service', 'Parking Facilities', 'Bike Storage'],
          image: 'bg-gradient-to-br from-blue-600/20 to-green-600/20'
        }
      ];

      const defaultStats: Stat[] = [
        { id: '1', value: '150', label: 'Acres Campus' },
        { id: '2', value: '50+', label: 'Modern Facilities' },
        { id: '3', value: '24/7', label: 'Security & Support' },
        { id: '4', value: '100%', label: 'WiFi Coverage' }
      ];

      const facs = await getSupabaseData<Facility[]>('royal-academy-facilities', defaultFacilities);
      const sts = await getSupabaseData<Stat[]>('royal-academy-facility-stats', defaultStats);
      
      setFacilities(facs);
      setStats(sts);
    } catch (error) {
      console.error('[Facilities] Error loading data:', error);
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
              World-Class <span className="text-gradient-gold">Facilities</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience learning in state-of-the-art facilities designed to inspire, innovate, and excel in every aspect of education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Campus Stats */}
      <section className="section-padding bg-gradient-to-r from-royal/5 via-background to-crimson/5">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotateY: 15 
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
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Our Facilities</h2>
            <p className="text-xl text-muted-foreground">Discover the spaces where excellence comes to life</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {facilities.map((facility, index) => {
              const IconComponent = iconMap[facility.icon] || BookOpen;
              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 5,
                    z: 50 
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="card-3d overflow-hidden group cursor-pointer"
                >
                  <div className="relative">
                    {/* Image/Background */}
                    <div className={`h-48 ${facility.image} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-6 left-6 w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center"
                      >
                        <IconComponent className="h-8 w-8 text-gold" />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="absolute bottom-6 left-6 right-6"
                      >
                        <h3 className="text-2xl font-heading font-bold text-white mb-2">{facility.title}</h3>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gold">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {facility.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 + idx * 0.05 }}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-gold"></div>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-gradient-to-r from-royal/10 via-crimson/5 to-royal/10 p-16 rounded-2xl border border-border cursor-pointer"
          >
            <h3 className="text-4xl font-heading font-bold mb-6">Take a Virtual Tour</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience our campus from anywhere in the world. Schedule a virtual tour to see our facilities in action.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-hero px-8 py-4 text-lg font-semibold rounded-lg"
            >
              Schedule Virtual Tour
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
