import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Facilities from "./pages/Facilities";
import Admissions from "./pages/Admissions";
import Gallery from "./pages/Gallery";
import TopScorers from "./pages/TopScorers";
import TopScorersLearnMore from "./pages/TopScorersLearnMore";
import StudentProfile from "./pages/StudentProfile";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import PrimaryEducation from "./pages/PrimaryEducation";
import SecondaryEducation from "./pages/SecondaryEducation";
import HigherSecondary from "./pages/HigherSecondary";
import ScienceStream from "./pages/ScienceStream";
import CommerceStream from "./pages/CommerceStream";
import ArtsStream from "./pages/ArtsStream";
import OurTeachers from "./pages/OurTeachers";
import TeacherProfile from "./pages/TeacherProfile";
import AlumniNetwork from "./pages/AlumniNetwork";
import Library from "./pages/Library";
import CareerServices from "./pages/CareerServices";
import Undergraduate from "./pages/Undergraduate";
import Graduate from "./pages/Graduate";
import PhdPrograms from "./pages/PhdPrograms";
import OnlineLearning from "./pages/OnlineLearning";
import PrincipalLogin from "./pages/PrincipalLogin";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentAuth from "./pages/StudentAuth";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTimetable from "./pages/StudentTimetable";
import AuthLanding from "./pages/AuthLanding";
import CurriculumGuide from "./pages/CurriculumGuide";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTeacherID from "./pages/CreateTeacherID";
import ManageTeacherID from "./pages/ManageTeacherID";
import ManageTeachers from "./pages/ManageTeachers";
import TeacherProfileSettings from "./pages/TeacherProfileSettings";
import StudentProfileSettings from "./pages/StudentProfileSettings";
import CoursesManagement from "./pages/CoursesManagement";
import Courses from "./pages/Courses";
import PrincipalAudioRoute from "@/components/PrincipalAudioRoute";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Index />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <About />
          </motion.div>
        } />
        <Route path="/academics" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Academics />
          </motion.div>
        } />
        <Route path="/curriculum-guide" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CurriculumGuide />
          </motion.div>
        } />
        <Route path="/facilities" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Facilities />
          </motion.div>
        } />
        <Route path="/admissions" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Admissions />
          </motion.div>
        } />
        <Route path="/gallery" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Gallery />
          </motion.div>
        } />
        <Route path="/top-scorers" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TopScorers />
          </motion.div>
        } />
        <Route path="/top-scorers/learn-more" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TopScorersLearnMore />
          </motion.div>
        } />
        <Route path="/student/:studentId" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <StudentProfile />
          </motion.div>
        } />
        <Route path="/events" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Events />
          </motion.div>
        } />
        <Route path="/events/:eventId" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <EventDetail />
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Contact />
          </motion.div>
        } />
        <Route path="/privacy" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PrivacyPolicy />
          </motion.div>
        } />
        <Route path="/terms" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TermsOfService />
          </motion.div>
        } />
        <Route path="/sitemap" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Sitemap />
          </motion.div>
        } />
        <Route path="/cookies" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CookiePolicy />
          </motion.div>
        } />
        <Route path="/faq" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <FAQ />
          </motion.div>
        } />
        <Route path="/primary-education" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PrimaryEducation />
          </motion.div>
        } />
        <Route path="/secondary-education" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <SecondaryEducation />
          </motion.div>
        } />
        <Route path="/higher-secondary" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HigherSecondary />
          </motion.div>
        } />
        <Route path="/science-stream" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ScienceStream />
          </motion.div>
        } />
        <Route path="/commerce-stream" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CommerceStream />
          </motion.div>
        } />
        <Route path="/arts-stream" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ArtsStream />
          </motion.div>
        } />
        <Route path="/our-teachers" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <OurTeachers />
          </motion.div>
        } />
        <Route path="/teacher/:teacherId" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TeacherProfile />
          </motion.div>
        } />
        <Route path="/alumni-network" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AlumniNetwork />
          </motion.div>
        } />
        <Route path="/library" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Library />
          </motion.div>
        } />
        <Route path="/career-services" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CareerServices />
          </motion.div>
        } />
        <Route path="/undergraduate" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Undergraduate />
          </motion.div>
        } />
        <Route path="/graduate" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Graduate />
          </motion.div>
        } />
        <Route path="/phd-programs" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PhdPrograms />
          </motion.div>
        } />
        <Route path="/online-learning" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <OnlineLearning />
          </motion.div>
        } />
        <Route path="/principal" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PrincipalLogin />
          </motion.div>
        } />
        <Route path="/principal-dashboard" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PrincipalDashboard />
          </motion.div>
        } />
        {/* Alias: support underscore URL to avoid blank page */}
        <Route path="/principal_dashboard" element={<Navigate to="/principal-dashboard" replace />} />
        <Route path="/teacher" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TeacherLogin />
          </motion.div>
        } />
        <Route path="/auth" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <AuthLanding />
          </motion.div>
        } />
        <Route path="/teacher-dashboard" element={
          <ProtectedRoute 
            authKey="teacherAuth" 
            redirectTo="/teacher"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TeacherDashboard />
            </motion.div>
          </ProtectedRoute>
        } />
        {/* Alias: common misspelling should go to teacher login */}
        <Route path="/teacher-dashbored" element={<Navigate to="/teacher" replace />} />
        <Route path="/teacher-profile-settings" element={
          <ProtectedRoute 
            authKey="teacherAuth" 
            redirectTo="/teacher"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TeacherProfileSettings />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/student-login" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <StudentAuth />
          </motion.div>
        } />
        <Route path="/student-dashboard" element={
          <ProtectedRoute 
            authKey="studentAuth" 
            redirectTo="/student-login"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StudentDashboard />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/student-timetable" element={
          <ProtectedRoute
            authKey="studentAuth"
            redirectTo="/student-login"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StudentTimetable />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/student-profile-settings" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <StudentProfileSettings />
          </motion.div>
        } />
        <Route path="/create-teacher-id" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CreateTeacherID />
          </motion.div>
        } />
        <Route path="/manage-teacher-id" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ManageTeacherID />
          </motion.div>
        } />
        <Route path="/manage-teachers" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ManageTeachers />
          </motion.div>
        } />
        <Route path="/courses" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Courses />
          </motion.div>
        } />
        <Route path="/courses-management" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CoursesManagement />
          </motion.div>
        } />
        <Route 
          path="/principal-audio" 
          element={
            <PrincipalAudioRoute />
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  // Validate any existing teacher session against principal-provisioned list
  useEffect(() => {
    try {
      const teacherAuth = localStorage.getItem("teacherAuth");
      const email = (localStorage.getItem("teacherEmail") || "").trim().toLowerCase();
      const name = (localStorage.getItem("teacherName") || "").trim().toLowerCase();

      if (teacherAuth === "true") {
        const raw = localStorage.getItem("royal-academy-auth-teachers") || "[]";
        const teachers = JSON.parse(raw);
        const exists = (teachers || []).some((t: any) => {
          const tEmail = ((t.email || "") + "").trim().toLowerCase();
          const tName = ((t.username || t.name || "") + "").trim().toLowerCase();
          const tId = ((t.teacherId || t.id || "") + "").trim().toLowerCase();
          // Consider a session valid only if email or name matches a provisioned record
          return (email && tEmail === email) || (name && tName === name);
        });

        if (!exists) {
          // Clear any stale or seeded session (e.g., old John Smith test data)
          localStorage.removeItem("teacherAuth");
          localStorage.removeItem("teacherEmail");
          localStorage.removeItem("teacherName");
          localStorage.removeItem("teacherSubject");
        }
      }
    } catch {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <CookieConsentBanner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;