import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, BookOpen, Users, Calendar, Mail, LogIn, Home, Building, Camera, Trophy, Bell, Eye, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button-variants";
import { getSupabaseData } from "@/lib/supabaseHelpers";
import { ThemeToggle } from "./ThemeToggle";
import schoolLogo from "@/assets/school-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(() => {
    return localStorage.getItem('performance-mode') === 'true';
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to New Academic Year",
      message: "Classes for the new academic year will begin on September 1st. Please check your course schedules.",
      timestamp: "2024-09-26T08:30:00",
      type: "info",
      unread: true
    },
    {
      id: 2,
      title: "Library Hours Extended",
      message: "The library will now be open until 22:00 on weekdays to support your studies.",
      timestamp: "2024-09-25T14:15:00",
      type: "info",
      unread: true
    },
    {
      id: 3,
      title: "Sports Day Registration",
      message: "Registration for Annual Sports Day is now open. Register before October 5th.",
      timestamp: "2024-09-24T10:45:00",
      type: "announcement",
      unread: false
    },
    {
      id: 4,
      title: "Exam Schedule Released",
      message: "Mid-term examination schedule has been published. Check the student portal for details.",
      timestamp: "2024-09-23T16:20:00",
      type: "important",
      unread: false
    }
  ]);
  const location = useLocation();

  // Branding state
  const [brandingData, setBrandingData] = useState({
    schoolName: "Royal Academy",
    tagline: "Excellence in Education",
    logoUrl: schoolLogo
  });

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


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Performance mode toggle function
  const togglePerformanceMode = () => {
    const newMode = !performanceMode;
    console.log('Performance mode toggled:', newMode);
    setPerformanceMode(newMode);
    localStorage.setItem('performance-mode', newMode.toString());

    // Apply performance mode styles to document
    if (newMode) {
      document.documentElement.classList.add('performance-mode');
      console.log('Performance mode enabled - animations disabled');
    } else {
      document.documentElement.classList.remove('performance-mode');
      console.log('Performance mode disabled - animations enabled');
    }
  };

  // Apply performance mode on component mount
  useEffect(() => {
    if (performanceMode) {
      document.documentElement.classList.add('performance-mode');
    }
  }, []);

  // Load notifications from localStorage (connected to principal announcements)
  useEffect(() => {
    const savedNotifications = localStorage.getItem('royal-academy-announcements');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { name: "Home", path: "/", icon: Home, description: "Welcome to Royal Academy" },
    { name: "About", path: "/about", icon: Users, description: "Our history and mission" },
    { name: "Academics", path: "/academics", icon: BookOpen, description: "Academic programs and curriculum" },
    { name: "Courses", path: "/courses", icon: BookOpen, description: "Browse our courses" },
    { name: "Facilities", path: "/facilities", icon: Building, description: "Campus and infrastructure" },
    { name: "Admissions", path: "/admissions", icon: GraduationCap, description: "Join our academy" },
    { name: "Gallery", path: "/gallery", icon: Camera, description: "Campus life in pictures" },
    { name: "Top Scorers", path: "/top-scorers", icon: Trophy, description: "Academic excellence showcase" },
    { name: "Events", path: "/events", icon: Calendar, description: "Upcoming events and activities" },
    { name: "Contact", path: "/contact", icon: Mail, description: "Get in touch with us" },
  ];

  // Calculate dynamic opacity and blur based on scroll position
  const opacity = Math.min(scrollY / 100, 0.9);
  const blurAmount = Math.min(scrollY / 30, 20);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'nav-scrolled' : 'header-transparent'
      }`}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">

          {/* Logo with Dropdown (PC Only) */}
          <div className="relative">
            <motion.button
              className="flex items-center space-x-3 group"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <img
                  src={brandingData.logoUrl}
                  alt={brandingData.schoolName}
                  className="h-8 w-8 sm:h-12 sm:w-12 animate-glow group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-heading font-bold text-gradient-gold">
                  {brandingData.schoolName}
                </span>
                <span className="text-xs text-muted-foreground tracking-wider hidden sm:block">
                  {brandingData.tagline}
                </span>
              </div>
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block"
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu (PC Only) */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden hidden lg:block"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="p-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group ${
                            location.pathname === item.path
                              ? "bg-gold/15 border border-gold/30"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setShowDropdown(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`p-2 rounded-lg ${
                              location.pathname === item.path
                                ? "bg-gold text-black"
                                : "bg-muted/30 text-muted-foreground group-hover:text-gold group-hover:bg-gold/20"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1">
                            <div className={`font-semibold ${
                              location.pathname === item.path ? "text-gold" : "text-foreground"
                            }`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                          {location.pathname === item.path && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-gold rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  {/* Authentication Links */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-xs font-semibold text-gold mb-3 px-4">SIGN IN</div>
                  <Link
                    to="/teacher"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-foreground hover:text-gold hover:bg-gold/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <div>Teacher Login</div>
                  </Link>
                  <Link
                    to="/student-login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-foreground hover:text-gold hover:bg-gold/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <GraduationCap className="h-5 w-5" />
                    <div>Student Login</div>
                  </Link>
                </div>
                  {/* Dropdown Footer */}
                  <div className="border-t border-border bg-muted/20 p-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gradient-gold mb-1">
                        🏆 148+ Years of Excellence
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Empowering minds, shaping futures
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Dashboard buttons for logged-in users */}
            {(() => {
              const teacherAuth = localStorage.getItem("teacherAuth");
              const studentAuth = localStorage.getItem("studentAuth");

              if (teacherAuth) {
                return (
                  <Link to="/teacher-dashboard" className="hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-gold/10 to-yellow-500/10 hover:from-gold/20 hover:to-yellow-500/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300"
                    >
                      Teacher Dashboard
                    </Button>
                  </Link>
                );
              }

              if (studentAuth) {
                return (
                  <Link to="/student-dashboard" className="hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-royal/10 to-gold/10 hover:from-royal/20 hover:to-gold/20 border-royal/30 text-royal hover:text-royal/80 transition-all duration-300"
                    >
                      Student Dashboard
                    </Button>
                  </Link>
                );
              }

              // Show Sign Up button if not logged in
              return (
                <Link to="/auth" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-gold/10 to-yellow-500/10 hover:from-gold/20 hover:to-yellow-500/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300"
                  >
                    Sign Up
                  </Button>
                </Link>
              );
            })()}
            <ThemeToggle />

            {/* Performance Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePerformanceMode}
              className={`p-2 transition-all duration-300 hidden sm:flex ${
                performanceMode
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                  : 'hover:bg-gold/10 text-muted-foreground hover:text-gold border border-transparent'
              }`}
              title={performanceMode ? 'Disable Performance Mode' : 'Enable Performance Mode'}
            >
              <Zap className={`h-5 w-5 transition-all duration-300 ${
                performanceMode ? 'text-green-400' : 'text-muted-foreground'
              }`} />
            </Button>

            {/* Notification Bell - Always visible */}
            <div className="relative" data-notification-container>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 sm:p-2 hover:bg-gold/10 transition-colors"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-gold transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                    className="absolute right-0 top-full mt-2 w-72 xs:w-80 sm:w-96 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">School Announcements</h3>
                        <div className="text-xs text-muted-foreground">
                          {unreadCount > 0 ? `${unreadCount} new` : 'All read'}
                        </div>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No announcements</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                              notification.unread ? 'bg-muted/20' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className={`text-sm font-medium ${
                                    notification.unread ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                    {formatTime(notification.timestamp)}
                                  </p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    notification.type === 'important' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                    notification.type === 'announcement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                  }`}>
                                    {notification.type}
                                  </span>
                                </div>
                              </div>
                              {notification.unread && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border bg-muted/20">
                        <div className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-gold"
                            onClick={() => setShowNotifications(false)}
                          >
                            Close Notifications
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-1 sm:p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-full left-0 w-full overflow-hidden nav-scrolled"
            >
              <div className="px-6 py-4 space-y-2 max-h-[70vh] overflow-y-scroll mobile-nav-scroll">
                {/* Mobile Dashboard/Sign Up Button - Top of Menu */}
                <div className="mb-4">
                  {(() => {
                    const teacherAuth = localStorage.getItem("teacherAuth");
                    const studentAuth = localStorage.getItem("studentAuth");

                    if (teacherAuth) {
                      return (
                        <Link to="/teacher-dashboard">
                          <Button
                            variant="outline"
                            className="w-full bg-gradient-to-r from-gold/10 to-yellow-500/10 hover:from-gold/20 hover:to-yellow-500/20 border-gold/30 text-gold hover:text-gold/80 transition-all duration-300"
                            onClick={() => setIsOpen(false)}
                          >
                            Teacher Dashboard
                          </Button>
                        </Link>
                      );
                    }

                    if (studentAuth) {
                      return (
                        <Link to="/student-dashboard">
                          <Button
                            variant="outline"
                            className="w-full bg-gradient-to-r from-royal/10 to-gold/10 hover:from-royal/20 hover:to-gold/20 border-royal/30 text-royal hover:text-royal/80 transition-all duration-300"
                            onClick={() => setIsOpen(false)}
                          >
                            Student Dashboard
                          </Button>
                        </Link>
                      );
                    }

                    // Show Sign Up button if not logged in
                    return (
                      <Link
                        to="/auth"
                        className="w-full flex justify-center items-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-500 text-black font-medium hover:from-gold/90 hover:to-yellow-500/90 transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <Users className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    );
                  })()}
                </div>

                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                        location.pathname === item.path
                          ? "text-gold bg-gold/10 border border-gold/30"
                          : "text-foreground hover:text-gold hover:bg-gold/5"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Additional Navigation Items for Footer Pages */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-xs font-semibold text-gold mb-3 px-4">PROGRAMS</div>
                  {[
                    { name: "Undergraduate", path: "/undergraduate", icon: GraduationCap },
                    { name: "Graduate", path: "/graduate", icon: GraduationCap },
                    { name: "PhD Programs", path: "/phd-programs", icon: GraduationCap },
                    { name: "Online Learning", path: "/online-learning", icon: BookOpen }
                  ].map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + index) * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                          location.pathname === item.path
                            ? "text-gold bg-gold/10 border border-gold/30"
                            : "text-muted-foreground hover:text-gold hover:bg-gold/5"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <div>{item.name}</div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-xs font-semibold text-gold mb-3 px-4">RESOURCES</div>
                  {[
                    { name: "Faculty", path: "/our-teachers", icon: Users },
                    { name: "Alumni Network", path: "/alumni-network", icon: Users },
                    { name: "Library", path: "/library", icon: BookOpen },
                    { name: "Career Services", path: "/career-services", icon: Building }
                  ].map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 4 + index) * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                          location.pathname === item.path
                            ? "text-gold bg-gold/10 border border-gold/30"
                            : "text-muted-foreground hover:text-gold hover:bg-gold/5"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <div>{item.name}</div>
                      </Link>
                    </motion.div>
                  ))}
                </div>



                {/* Mobile Performance Mode Toggle */}
                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="ghost"
                    onClick={togglePerformanceMode}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                      performanceMode
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'hover:bg-gold/10 text-muted-foreground hover:text-gold'
                    }`}
                  >
                    <Zap className={`h-5 w-5 ${
                      performanceMode ? 'text-green-400' : 'text-muted-foreground'
                    }`} />
                    <span className="font-medium">
                      {performanceMode ? 'Performance Mode: ON' : 'Performance Mode: OFF'}
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;