import { useState, useEffect } from "react";
import { ArrowRight, Award, BookOpen, Users } from "lucide-react";
import { Button } from "./ui/button-variants";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-school.jpg";
import schoolLogo from "@/assets/school-logo.png"; // Import the school logo
import { getSupabaseData } from "@/lib/supabaseHelpers"; // Import Supabase helper

interface HomepageData {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  bannerImages: string[];
  autoRotate: boolean;
  rotationInterval: number;
  stats: {
    students: { number: string; label: string };
    programs: { number: string; label: string };
    awards: { number: string; label: string };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const Hero = () => {
  // State for homepage data
  const [homepageData, setHomepageData] = useState<HomepageData>({
    heroTitle: "Royal Academy",
    heroSubtitle: "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
    heroButtonPrimary: "Apply for Admission",
    heroButtonSecondary: "Discover Our Legacy",
    bannerImages: [],
    autoRotate: true,
    rotationInterval: 5,
    stats: {
      students: { number: "2,500+", label: "Students" },
      programs: { number: "150+", label: "Programs" },
      awards: { number: "25+", label: "Awards" }
    },
    colors: {
      primary: "#1e40af",
      secondary: "#f59e0b",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1f2937"
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    }
  });

  // State for branding data
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Excellence in Education",
    logoUrl: schoolLogo
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load homepage data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-homepage', {
      heroTitle: "Royal Academy",
      heroSubtitle: "Shaping tomorrow's leaders through excellence in education, character development, and innovative learning experiences.",
      heroButtonPrimary: "Apply for Admission",
      heroButtonSecondary: "Discover Our Legacy",
      bannerImages: [],
      autoRotate: true,
      rotationInterval: 5,
      stats: {
        students: { number: "2,500+", label: "Students" },
        programs: { number: "150+", label: "Programs" },
        awards: { number: "25+", label: "Awards" }
      },
      colors: {
        primary: "#1e40af",
        secondary: "#f59e0b",
        accent: "#10b981",
        background: "#ffffff",
        text: "#1f2937"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      }
    }).then(data => {
      setHomepageData(data);
    });
  }, []);

  // Load branding data from Supabase
  useEffect(() => {
    getSupabaseData('royal-academy-branding', {
      schoolName: "Royal Academy",
      tagline: "Excellence in Education",
      logoUrl: schoolLogo
    }).then(data => {
      setBrandingData({
        schoolName: data.schoolName || "Royal Academy",
        tagline: data.tagline || "Excellence in Education",
        logoUrl: data.logoUrl || schoolLogo
      });
    });
  }, []);


  // Auto-rotate banner images
  useEffect(() => {
    if (homepageData.autoRotate && homepageData.bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % homepageData.bannerImages.length
        );
      }, homepageData.rotationInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [homepageData.autoRotate, homepageData.rotationInterval, homepageData.bannerImages.length]);

  const stats = [
    { icon: Users, value: homepageData.stats.students.number, label: homepageData.stats.students.label },
    { icon: BookOpen, value: homepageData.stats.programs.number, label: homepageData.stats.programs.label },
    { icon: Award, value: homepageData.stats.awards.number, label: homepageData.stats.awards.label },
  ];

  const currentBannerImage = homepageData.bannerImages.length > 0 
    ? homepageData.bannerImages[currentImageIndex] 
    : heroImage;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentBannerImage}
          alt="Royal Academy"
          className="w-full h-full object-cover transition-opacity duration-1000"
          key={currentImageIndex}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-royal/90 via-background/80 to-crimson/90"
          style={{
            background: `linear-gradient(to bottom right, ${homepageData.colors.primary}90, ${homepageData.colors.background}80, ${homepageData.colors.secondary}90)`
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gold/20 animate-float hidden sm:block"></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-crimson/20 animate-float hidden sm:block" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gold/30 animate-float hidden sm:block" style={{ animationDelay: "4s" }}></div>

      {/* Content */}
      <div className="relative z-10 container-wide px-4 sm:px-6 py-8 sm:py-16 text-center">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-slide-up">
          {/* Main Heading */}
          <div className="space-y-4 sm:space-y-6">
             {/* School Logo */}
             {brandingData.logoUrl && (
              <img 
                src={brandingData.logoUrl} 
                alt="School Logo" 
                className="h-24 w-auto mx-auto mb-4" 
              />
            )}
            <h1 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight sm:leading-normal"
              style={{ fontFamily: homepageData.fonts.heading }}
            >
              {homepageData.heroTitle.split(' ').map((word, index) => (
                <span 
                  key={index}
                  className={`block ${index === 0 ? 'text-gradient-gold' : 'text-foreground'}`}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p 
              className="text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
              style={{ fontFamily: homepageData.fonts.body, color: '#000000' }}
            >
              {homepageData.heroSubtitle}
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8 px-4 sm:px-0">
            <Button variant="hero" size="xl" asChild>
              <Link to="/admissions" className="group">
                {homepageData.heroButtonPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="border-gold/50 text-black hover:bg-gold/10">
              <Link to="/about">
                {homepageData.heroButtonSecondary}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-16 px-2 sm:px-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="card-3d p-4 sm:p-8 text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-4xl font-heading font-bold text-gradient-gold">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground text-base sm:text-lg">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold/80 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;