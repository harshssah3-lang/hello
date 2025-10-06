
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowLeft, Home, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

interface TimetableData {
  class: string;
  section: string;
  schedule: DaySchedule[];
  lastUpdated?: string;
}

const StudentTimetable = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any>(null);
  const [timetable, setTimetable] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Load student data and timetable
  useEffect(() => {
    const loadStudentAndTimetable = async () => {
      // Get student data
      const studentEmail = localStorage.getItem("studentEmail");
      if (!studentEmail) {
        navigate("/student-auth");
        return;
      }

      // Load student info
      const authStudents = await getSupabaseData<any[]>('royal-academy-auth-students', []);
      const student = authStudents.find((s: any) => s.email === studentEmail);
      
      if (!student) {
        // Try regular students
        const regularStudents = await getSupabaseData<any[]>('royal-academy-students', []);
        const regularStudent = regularStudents.find((s: any) => s.email === studentEmail);
        if (regularStudent) {
          setStudentData(regularStudent);
          await loadTimetableForStudent(regularStudent.class, regularStudent.section);
        }
      } else {
        setStudentData(student);
        await loadTimetableForStudent(student.class, student.section);
      }

      setIsLoading(false);
    };

    loadStudentAndTimetable();
  }, [navigate]);

  // Load timetable from Supabase
  const loadTimetableForStudent = async (classNum: string, section: string) => {
    if (!classNum || !section) {
      console.log('No class or section data');
      setTimetable([]);
      return;
    }

    const classSection = `${classNum}${section}`;
    const timetableKey = `royal-academy-timetable-${classSection}`;
    
    console.log('Loading timetable for:', classSection);

    try {
      // Load from Supabase
      const timetableData = await getSupabaseData<TimetableData>(timetableKey, {
        class: classNum,
        section: section,
        schedule: []
      });

      console.log('Loaded timetable:', timetableData);

      if (timetableData.schedule && Array.isArray(timetableData.schedule)) {
        const hasAnyPeriods = timetableData.schedule.some((day: any) => 
          day.periods && day.periods.length > 0
        );
        
        if (hasAnyPeriods) {
          setTimetable(timetableData.schedule);
          setLastUpdated(timetableData.lastUpdated || new Date().toISOString());
        } else {
          setTimetable([]);
        }
      } else {
        setTimetable([]);
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
      setTimetable([]);
    }
  };

  // Subscribe to real-time timetable updates
  useEffect(() => {
    if (!studentData?.class || !studentData?.section) return;

    const classSection = `${studentData.class}${studentData.section}`;
    const timetableKey = `royal-academy-timetable-${classSection}`;

    const unsubscribe = subscribeToSupabaseChanges<TimetableData>(
      timetableKey,
      (newData) => {
        console.log('Timetable updated in real-time:', newData);
        if (newData.schedule && Array.isArray(newData.schedule)) {
          setTimetable(newData.schedule);
          setLastUpdated(newData.lastUpdated || new Date().toISOString());
        }
      }
    );

    return () => unsubscribe();
  }, [studentData]);

  const refreshTimetable = async () => {
    if (studentData?.class && studentData?.section) {
      setIsLoading(true);
      await loadTimetableForStudent(studentData.class, studentData.section);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/student-dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTimetable}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container-wide py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-royal to-gold mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-2">
              My Class <span className="text-gradient-gold">Timetable</span>
            </h1>
            {studentData && (
              <p className="text-xl text-muted-foreground">
                Class {studentData.class}{studentData.section} • Weekly Schedule
              </p>
            )}
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>

          {timetable && timetable.length > 0 ? (
            <div className="space-y-6">
              {timetable.map((daySchedule, dayIndex) => (
                <motion.div
                  key={daySchedule.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                  className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-gold" />
                      {daySchedule.day}
                    </h3>
                    <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                      {daySchedule.periods?.length || 0} periods
                    </span>
                  </div>

                  {daySchedule.periods && daySchedule.periods.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {daySchedule.periods.map((period: Period, periodIndex: number) => (
                        <motion.div
                          key={periodIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: dayIndex * 0.1 + periodIndex * 0.05 }}
                          className={`p-4 rounded-lg border transition-all ${
                            period.subject === "Break" || period.subject === "Lunch Break"
                              ? "bg-blue-500/10 border-blue-500/30"
                              : "bg-gradient-to-br from-royal/5 to-gold/5 border-border/30 hover:border-gold/50 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gold flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {period.time}
                            </span>
                            {period.room && (
                              <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                                {period.room}
                              </span>
                            )}
                          </div>

                          <h5 className={`font-semibold mb-2 ${
                            period.subject === "Break" || period.subject === "Lunch Break"
                              ? "text-blue-400"
                              : "text-foreground"
                          }`}>
                            {period.subject}
                          </h5>

                          {period.teacher && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {period.teacher}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No periods scheduled for {daySchedule.day}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-card/95 backdrop-blur-md rounded-xl border border-border/50"
            >
              <Clock className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                No Timetable Available
              </h3>
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                Your class timetable hasn't been created yet by the Principal.
              </p>
              {studentData && (
                <p className="text-sm text-muted-foreground">
                  Class {studentData.class}{studentData.section} timetable will appear here once created.
                </p>
              )}
              <Button
                onClick={refreshTimetable}
                className="mt-6 bg-gradient-to-r from-royal to-gold text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentTimetable;
