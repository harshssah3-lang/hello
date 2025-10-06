import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";
import { 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  Star, 
  BarChart3, 
  FileText, 
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  BookOpen,
  Trophy,
  Award,
  Bell,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Volume2,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DocumentViewer from "@/components/DocumentViewer";
import LiveClassViewer from "@/components/LiveClassViewer";

interface StudentData {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  class: string;
  section: string;
  status: string;
}

interface StudentReport {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  reportImage: string;
  notes: string;
  createdAt: string;
  class: string;
  section: string;
}

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  notes?: string;
  teacherId: string;
  createdAt: string;
}

interface PaymentRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  amount: number;
  months: string[];
  notes: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  status: 'pending' | 'paid';
}

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [showLiveClassViewer, setShowLiveClassViewer] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);
  const [customHolidays, setCustomHolidays] = useState<string[]>([]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [studentRemarks, setStudentRemarks] = useState<any[]>([]);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [studentTimetable, setStudentTimetable] = useState<any[]>([]);
  
  // Fee management state
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<PaymentRequest | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'online',
    notes: ''
  });
  
  // Principal remarks state
  const [principalRemarks, setPrincipalRemarks] = useState<any[]>([]);
  const [showPrincipalRemarksModal, setShowPrincipalRemarksModal] = useState(false);
  
  // Student notifications state
  const [studentNotifications, setStudentNotifications] = useState<any[]>([]);
  const [showStudentNotifications, setShowStudentNotifications] = useState(false);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  
  // Profile state
  const [studentProfile, setStudentProfile] = useState({
    name: studentData?.fullName || "",
    photo: "",
    bio: "",
    phone: "",
    interests: ""
  });
  
  const navigate = useNavigate();

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to load assignments for current student
  const loadAssignments = () => {
    if (studentData) {
      const allHomework = JSON.parse(localStorage.getItem('royal-academy-homework') || '[]');
      const studentAssignments = allHomework.filter((hw: any) => 
        hw.class === studentData.class && hw.section === studentData.section
      );
      setAssignments(studentAssignments);
    }
  };

  // Helper function to load timetable for current student
  const loadStudentTimetable = () => {
    if (!studentData || !studentData.class || !studentData.section) {
      console.log('Student data not available yet');
      setStudentTimetable([]);
      return;
    }
    
    // Load timetable from Principal's system
    const classSection = `${studentData.class}${studentData.section}`;
    const timetableKey = `royal-academy-timetable-${classSection}`;
    const storedTimetable = localStorage.getItem(timetableKey);
    
    console.log('Loading timetable for:', classSection, 'Key:', timetableKey);
    
    if (storedTimetable) {
      try {
        const timetableData = JSON.parse(storedTimetable);
        console.log('Found timetable data:', timetableData);
        
        if (timetableData.schedule && Array.isArray(timetableData.schedule) && timetableData.schedule.length > 0) {
          // Check if all days have periods
          const hasAnyPeriods = timetableData.schedule.some((day: any) => 
            day.periods && day.periods.length > 0
          );
          
          if (hasAnyPeriods) {
            setStudentTimetable(timetableData.schedule);
            console.log('Timetable loaded successfully');
            return;
          } else {
            console.log('Timetable exists but all days are empty');
            setStudentTimetable([]);
            return;
          }
        }
      } catch (e) {
        console.error('Error parsing timetable:', e);
      }
    }
    
    console.log('No timetable found for this class');
    // If no timetable exists, show empty
    setStudentTimetable([]);
  };

  // Helper function to load remarks for current student
  const loadStudentRemarks = () => {
    if (studentData) {
      console.log('Loading remarks for student:', studentData);
      
      // First check auth students (where teacher remarks are synced)
      const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      console.log('Auth students:', authStudents);
      
      let currentStudent = authStudents.find((s: any) => {
        const match = s.email === studentData.email ||
          s.studentId === studentData.id ||
          s.id === studentData.id ||
          s.name === studentData.fullName ||
          s.fullName === studentData.fullName ||
          s.rollNumber === studentData.rollNumber;
        
        if (match) {
          console.log('Found matching auth student:', s);
        }
        return match;
      });
      
      // If not found in auth students, check regular students
      if (!currentStudent) {
        console.log('Not found in auth students, checking regular students...');
        const allStudents = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
        console.log('All students:', allStudents);
        
        currentStudent = allStudents.find((s: any) => {
          const match = s.email === studentData.email ||
            s.id === studentData.id ||
            s.name === studentData.fullName ||
            s.fullName === studentData.fullName ||
            s.rollNumber === studentData.rollNumber;
          
          if (match) {
            console.log('Found matching regular student:', s);
          }
          return match;
        });
      }
      
      if (currentStudent && currentStudent.remarks && currentStudent.remarks.length > 0) {
        console.log('Found remarks:', currentStudent.remarks);
        setStudentRemarks(currentStudent.remarks);
      } else {
        console.log('No remarks found for student');
        setStudentRemarks([]);
      }
    }
  };

  // Helper function to get student attendance for a specific date
  const getStudentAttendanceForDate = (dateStr: string) => {
    if (!studentData) return null;
    
    // First try to get from royal-academy-students
    const allStudents = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
    let currentStudent = allStudents.find((s: any) => s.email === studentData.email || s.id === studentData.id);
    
    // If not found, try auth students
    if (!currentStudent || !currentStudent.attendance) {
      const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      currentStudent = authStudents.find((s: any) => s.email === studentData.email || s.studentId === studentData.id);
    }
    
    if (!currentStudent || !currentStudent.attendance) return null;
    
    return currentStudent.attendance.find((a: any) => a.date === dateStr);
  };

  // Helper function to calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!studentData) return { present: 0, absent: 0, holidays: 0, percentage: 0 };
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get all students to find current student's data
    const allStudents = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
    let currentStudent = allStudents.find((s: any) => s.email === studentData.email || s.id === studentData.id);
    
    // If not found, try auth students
    if (!currentStudent || !currentStudent.attendance) {
      const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
      currentStudent = authStudents.find((s: any) => s.email === studentData.email || s.studentId === studentData.id);
    }
    
    if (!currentStudent || !currentStudent.attendance) {
      return { present: 0, absent: 0, holidays: 0, percentage: 0 };
    }
    
    let present = 0;
    let absent = 0;
    let holidayCount = 0;
    
    // Count days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      // Fix timezone issue - use local date string instead of ISO
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayStr}`;
      const isSunday = date.getDay() === 0;
      
      const isCustomHoliday = customHolidays.includes(dateStr);
      
      if (isSunday || isCustomHoliday) {
        holidayCount++;
      } else {
        const attendance = currentStudent.attendance.find((a: any) => a.date === dateStr);
        if (attendance) {
          if (attendance.status === 'present' || attendance.status === 'late') {
            present++;
          } else if (attendance.status === 'absent') {
            absent++;
          }
        }
      }
    }
    
    const totalWorkingDays = daysInMonth - holidayCount;
    const percentage = totalWorkingDays > 0 ? Math.round((present / totalWorkingDays) * 100) : 0;
    
    return { present, absent, holidays: holidayCount, percentage };
  };

  // Fee management functions
  const loadFeeData = (studentId: string) => {
    // Load fee records
    const allFeeRecords = JSON.parse(localStorage.getItem('royal-academy-fee-records') || '[]');
    const studentFeeRecords = allFeeRecords.filter((fee: FeeRecord) => fee.studentId === studentId);
    setFeeRecords(studentFeeRecords);
    
    // Load payment requests
    const allPaymentRequests = JSON.parse(localStorage.getItem('royal-academy-payment-requests') || '[]');
    const studentPaymentRequests = allPaymentRequests.filter((req: PaymentRequest) => req.studentId === studentId);
    setPaymentRequests(studentPaymentRequests);
  };

  const getMyFeeStatus = () => {
    const pendingFees = feeRecords.filter(fee => fee.status === 'pending');
    const paidFees = feeRecords.filter(fee => fee.status === 'paid');
    const totalPending = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = paidFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    return {
      pendingFees,
      paidFees,
      totalPending,
      totalPaid,
      pendingMonths: pendingFees.map(fee => fee.month),
      paidMonths: paidFees.map(fee => fee.month)
    };
  };

  const handlePayFees = (paymentRequest: PaymentRequest) => {
    setSelectedPaymentRequest(paymentRequest);
    setPaymentForm({
      amount: paymentRequest.amount.toString(),
      paymentMethod: 'online',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedPaymentRequest || !studentData) {
      alert('Payment information is missing');
      return;
    }

    // Update fee records to paid status
    const updatedFeeRecords = feeRecords.map(fee => {
      if (selectedPaymentRequest.months.includes(fee.month) && fee.status === 'pending') {
        return {
          ...fee,
          status: 'paid' as const,
          paymentDate: new Date().toISOString()
        };
      }
      return fee;
    });
    
    setFeeRecords(updatedFeeRecords);
    localStorage.setItem('royal-academy-fee-records', JSON.stringify(
      JSON.parse(localStorage.getItem('royal-academy-fee-records') || '[]').map((fee: FeeRecord) => {
        const updatedFee = updatedFeeRecords.find(f => f.id === fee.id);
        return updatedFee || fee;
      })
    ));

    // Update payment request status
    const updatedPaymentRequests = paymentRequests.map(req => 
      req.id === selectedPaymentRequest.id 
        ? { ...req, status: 'paid' as const }
        : req
    );
    
    setPaymentRequests(updatedPaymentRequests);
    localStorage.setItem('royal-academy-payment-requests', JSON.stringify(
      JSON.parse(localStorage.getItem('royal-academy-payment-requests') || '[]').map((req: PaymentRequest) => {
        const updatedReq = updatedPaymentRequests.find(r => r.id === req.id);
        return updatedReq || req;
      })
    ));

    alert(`Payment of ₹${selectedPaymentRequest.amount} completed successfully!\nMonths: ${selectedPaymentRequest.months.join(', ')}`);
    
    setShowPaymentModal(false);
    setSelectedPaymentRequest(null);
    setPaymentForm({ amount: '', paymentMethod: 'online', notes: '' });
  };

  useEffect(() => {
    // Check authentication with stricter validation
    const isAuth = localStorage.getItem("studentAuth");
    const currentStudent = localStorage.getItem("currentStudent");
    const studentEmail = localStorage.getItem("studentEmail");
    
    console.log('[StudentDashboard] Auth check:', { isAuth, hasCurrentStudent: !!currentStudent, studentEmail });
    
    // Only redirect if not authenticated - be more lenient to prevent unnecessary redirects
    if (!isAuth || isAuth !== "true") {
      console.log('[StudentDashboard] Not authenticated, redirecting to auth');
      navigate("/student-auth");
      return;
    }
    
    // Subscribe to realtime changes for students data
    const unsubscribeStudents = subscribeToSupabaseChanges(
      'royal-academy-students',
      (newData: any[]) => {
        console.log('[StudentDashboard] Students data updated from Supabase');
        // Reload current student data if it changed
        if (studentEmail) {
          const updatedStudent = newData.find((s: any) => s.email === studentEmail);
          if (updatedStudent) {
            setStudentData({
              id: updatedStudent.id,
              fullName: updatedStudent.fullName || updatedStudent.name,
              email: updatedStudent.email,
              rollNumber: updatedStudent.rollNumber || 'N/A',
              class: updatedStudent.class || 'N/A',
              section: updatedStudent.section || 'A',
              status: updatedStudent.status || 'active'
            });
          }
        }
      }
    );
    
    // Subscribe to other relevant data
    const unsubscribeReports = subscribeToSupabaseChanges('royal-academy-student-reports', () => {
      console.log('[StudentDashboard] Reports updated');
      window.location.reload(); // Reload to get fresh data
    });
    
    const unsubscribeNotifications = subscribeToSupabaseChanges('royal-academy-student-notifications', () => {
      console.log('[StudentDashboard] Notifications updated');
      window.location.reload();
    });
    
    return () => {
      unsubscribeStudents();
      unsubscribeReports();
      unsubscribeNotifications();
    };
    
    // Ensure auth persists
    if (isAuth === "true") {
      localStorage.setItem("studentAuth", "true");
    }
    
    // Try to get student data from currentStudent first (faster)
    if (currentStudent) {
      try {
        const student = JSON.parse(currentStudent);
        const studentData = {
          id: student.studentId || student.id,
          fullName: student.username || student.name || student.fullName,
          email: student.email || studentEmail,
          rollNumber: student.rollNumber || 'N/A',
          class: student.class || 'N/A',
          section: student.section || 'A',
          status: student.status || 'active'
        };
        setStudentData(studentData);
        
        // Load reports for this student
        const allReports = JSON.parse(localStorage.getItem('royal-academy-student-reports') || '[]');
        const myReports = allReports.filter((report: StudentReport) => report.studentId === studentData.id);
        setStudentReports(myReports);
        
        // Load fee data for this student
        loadFeeData(studentData.id);
        
        return; // Exit early since we found the student
      } catch (e) {
        console.log('Error parsing currentStudent, falling back to database search');
      }
    }

    // Load student data from email if currentStudent failed
    if (studentEmail) {
      // First try to get from royal-academy-students
      const students = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');
      let student = students.find((s: any) => s.email === studentEmail);
      
      // If not found, try to get from auth students
      if (!student) {
        const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
        const authStudent = authStudents.find((s: any) => s.email === studentEmail);
        if (authStudent) {
          student = {
            id: authStudent.studentId || authStudent.id,
            fullName: authStudent.username || authStudent.name || authStudent.fullName,
            email: authStudent.email,
            rollNumber: authStudent.rollNumber || 'N/A',
            class: authStudent.class || 'N/A',
            section: authStudent.section || 'A',
            status: authStudent.status || 'active'
          };
        }
      }
      
      if (student) {
        // Ensure fullName is available
        if (!student.fullName && student.email) {
          // Try to get name from localStorage or use email
          const storedName = localStorage.getItem("studentName");
          if (storedName) {
            student.fullName = storedName;
          } else {
            student.fullName = student.email.split('@')[0]; // Fallback to email username
          }
        }
        
        setStudentData(student);
        
        // Load reports for this student
        const allReports = JSON.parse(localStorage.getItem('royal-academy-student-reports') || '[]');
        const myReports = allReports.filter((report: StudentReport) => report.studentId === student.id);
        setStudentReports(myReports);
        
        // Load fee data for this student
        loadFeeData(student.id);
      }
    }
    // Load holidays
    const storedHolidays = localStorage.getItem('royal-academy-holidays');
    if (storedHolidays) {
      setCustomHolidays(JSON.parse(storedHolidays));
    }

    // Load student profile
    if (studentData) {
      const storedProfile = localStorage.getItem(`student-profile-${studentData.email}`);
      if (storedProfile) {
        setStudentProfile(JSON.parse(storedProfile));
      } else {
        setStudentProfile(prev => ({ ...prev, name: studentData.fullName }));
      }
    }
  }, [navigate]);

  // Load assignments and remarks when studentData changes
  useEffect(() => {
    loadAssignments();
    loadStudentRemarks();
    
    // Load principal remarks for current student
    if (studentData) {
      const storedPrincipalRemarks = localStorage.getItem('royal-academy-principal-remarks');
      if (storedPrincipalRemarks) {
        const allRemarks = JSON.parse(storedPrincipalRemarks);
        const myRemarks = allRemarks.filter((remark: any) => remark.studentId === studentData.id);
        setPrincipalRemarks(myRemarks);
      }
      
      // Load student notifications
      const storedNotifications = localStorage.getItem('royal-academy-student-notifications');
      if (storedNotifications) {
        const allNotifications = JSON.parse(storedNotifications);
        // Filter notifications for this student (individual, class, section, or all students)
        const myNotifications = allNotifications.filter((notification: any) => {
          return notification.targetType === 'all' ||
                 (notification.targetType === 'class' && notification.targetClass === studentData.class) ||
                 (notification.targetType === 'section' && notification.targetClass === studentData.class && notification.targetSection === studentData.section) ||
                 (notification.targetType === 'student' && notification.targetStudentId === studentData.id);
        });
        setStudentNotifications(myNotifications);
      }
    }
  }, [studentData]);

  // Set up real-time remarks refresh
  useEffect(() => {
    if (studentData) {
      // Refresh remarks every 5 seconds for real-time updates
      const remarksInterval = setInterval(() => {
        loadStudentRemarks();
      }, 5000);

      return () => clearInterval(remarksInterval);
    }
  }, [studentData]);

  const handleLogout = () => {
    localStorage.removeItem("studentAuth");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    navigate("/");
  };

  const stats = [
    { icon: BookOpen, label: "Subjects", value: "8", change: "Active courses" },
    { icon: Trophy, label: "Grade Average", value: "85.5%", change: "+2.3% this term" },
    { icon: Calendar, label: "Attendance", value: "94%", change: "This month" },
    { icon: Award, label: "Assignments", value: "12/15", change: "Completed" }
  ];


  const upcomingEvents = [
    { title: "Mathematics Test", date: "Tomorrow", time: "10:00 AM", type: "exam" },
    { title: "Science Project Due", date: "Dec 15", time: "11:59 PM", type: "assignment" },
    { title: "Parent-Teacher Meeting", date: "Dec 18", time: "2:00 PM", type: "meeting" },
    { title: "Winter Break Starts", date: "Dec 22", time: "All Day", type: "holiday" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-2 sm:py-4 px-2 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                {studentProfile.photo ? (
                  <img
                    src={studentProfile.photo}
                    alt="Profile"
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gold"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-xl font-heading font-bold text-foreground truncate">
                  {studentProfile.name || studentData?.fullName || "Student"}
                </h1>
                <p className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">
                  Welcome back, {studentProfile.name || studentData?.fullName || "Student"}
                </p>
              </div>
            </div>
            
            {/* Website Navigation */}
            <div className="hidden lg:flex items-center space-x-6 mr-6">
              <button
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                About
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Courses
              </button>
              <button
                onClick={() => navigate('/admissions')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Admissions
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Gallery
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Class {studentData?.class || ""}{studentData?.section || ""}</span>
                <span>•</span>
                <span>Roll: {studentData?.rollNumber || ""}</span>
              </div>
              
              {/* Student Notifications Bell */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStudentNotifications(!showStudentNotifications)}
                  className="relative p-2"
                >
                  <Bell className="h-4 w-4" />
                  {studentNotifications.filter(n => n.status === 'unread').length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {studentNotifications.filter(n => n.status === 'unread').length}
                    </span>
                  )}
                </Button>
                
                {/* Student Notifications Dropdown */}
                {showStudentNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-foreground">My Notifications</h3>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {studentNotifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        studentNotifications
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((notification) => (
                            <div key={notification.id} className="p-4 border-b border-border hover:bg-muted/50">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-foreground">{notification.subject}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  notification.status === 'unread' ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {notification.status === 'unread' ? 'New' : 'Read'}
                                </span>
                              </div>
                              <p className="text-xs text-blue-400 mb-2">
                                From: {notification.senderName} ({notification.senderType})
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                              
                              {/* Photo Attachments */}
                              {(notification.photo1 || notification.photo2) && (
                                <div className="flex space-x-2 mt-2 mb-2">
                                  {notification.photo1 && (
                                    <img 
                                      src={notification.photo1} 
                                      alt="Attachment 1" 
                                      className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                      onClick={() => {
                                        // Create a new window to display the base64 image
                                        const newWindow = window.open();
                                        if (newWindow) {
                                          newWindow.document.write(`<img src="${notification.photo1}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`);
                                        }
                                      }}
                                    />
                                  )}
                                  {notification.photo2 && (
                                    <img 
                                      src={notification.photo2} 
                                      alt="Attachment 2" 
                                      className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                                      onClick={() => {
                                        // Create a new window to display the base64 image
                                        const newWindow = window.open();
                                        if (newWindow) {
                                          newWindow.document.write(`<img src="${notification.photo2}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`);
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  Target: {notification.targetType === 'all' ? 'All Students' : 
                                          notification.targetType === 'class' ? `Class ${notification.targetClass}` :
                                          notification.targetType === 'section' ? `Class ${notification.targetClass}-${notification.targetSection}` :
                                          'Individual'}
                                </span>
                                {notification.status === 'unread' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Mark as read
                                      const updatedNotifications = studentNotifications.map(n => 
                                        n.id === notification.id ? { ...n, status: 'read' } : n
                                      );
                                      setStudentNotifications(updatedNotifications);
                                      
                                      // Update localStorage
                                      const allNotifications = JSON.parse(localStorage.getItem('royal-academy-student-notifications') || '[]');
                                      const updatedAllNotifications = allNotifications.map((n: any) => 
                                        n.id === notification.id ? { ...n, status: 'read' } : n
                                      );
                                      localStorage.setItem('royal-academy-student-notifications', JSON.stringify(updatedAllNotifications));
                                    }}
                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container-wide py-8 px-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-royal/20 to-gold/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-royal" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <h2 className="text-lg font-heading font-bold text-foreground mb-6">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'exam' ? 'bg-red-500' :
                        event.type === 'assignment' ? 'bg-yellow-500' :
                        event.type === 'meeting' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} • {event.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Academic Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
              <h2 className="text-lg font-heading font-bold text-foreground mb-6">
                Academic Progress
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Mathematics</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Physics</span>
                    <span className="text-sm text-muted-foreground">88%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">English</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Chemistry</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-heading font-bold text-foreground mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "View Grades", icon: BarChart3, color: "from-blue-500 to-cyan-500", action: () => setShowGradesModal(true) },
                { title: "Assignments", icon: FileText, color: "from-green-500 to-emerald-500", action: () => {
                  loadAssignments(); // Refresh assignments when opening
                  setShowAssignmentsModal(true);
                } },
                { title: "Attendance", icon: Calendar, color: "from-purple-500 to-pink-500", action: () => setShowAttendanceModal(true) },
                { title: "Remarks", icon: Star, color: "from-yellow-500 to-orange-500", action: () => {
                  // Force refresh remarks data
                  setTimeout(() => {
                    loadStudentRemarks();
                  }, 100);
                  setShowRemarksModal(true);
                } },
                { title: "Timetable", icon: Clock, color: "from-orange-500 to-red-500", action: () => navigate('/student-timetable') },
                { title: "Fees", icon: CreditCard, color: "from-green-500 to-emerald-500", action: () => setActiveSection("fees") },
                { title: "Principal Audio", icon: Volume2, color: "from-indigo-500 to-purple-500", action: () => navigate('/principal-audio') },
                { title: "Principal Remarks", icon: Star, color: "from-yellow-500 to-orange-500", action: () => setShowPrincipalRemarksModal(true) },
                { title: "Profile", icon: User, color: "from-teal-500 to-blue-500", action: () => setActiveSection("profile") }
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="p-4 rounded-lg bg-gradient-to-r hover:shadow-lg transition-all duration-200 text-white group"
                >
                  <div className={`bg-gradient-to-r ${action.color} p-4 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white mb-3 mx-auto" />
                    <p className="text-sm font-medium text-white text-center">
                      {action.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grades/Reports Modal */}
      {showGradesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                My Reports & Grades
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGradesModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {studentReports.length > 0 ? (
              <div className="space-y-4">
                {studentReports
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/20 rounded-lg p-4 border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {report.subject} Report
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            From: {report.teacherName} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-xs bg-royal/10 text-royal px-2 py-1 rounded">
                          New Report
                        </div>
                      </div>

                      {/* Report Image */}
                      {report.reportImage && (
                        <div className="mb-4">
                          <img
                            src={report.reportImage}
                            alt="Report"
                            className="w-full max-w-md mx-auto rounded-lg border border-border/30 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedImage({
                                src: report.reportImage,
                                title: `${report.subject} Report - ${report.teacherName}`
                              });
                              setShowImageModal(true);
                            }}
                          />
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Click image to view full size
                          </p>
                        </div>
                      )}

                      {/* Teacher Notes */}
                      {report.notes && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-foreground mb-2">
                            Teacher's Notes:
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {report.notes}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No Reports Currently
                </h4>
                <p className="text-muted-foreground">
                  Your teachers haven't sent any reports yet. Check back later!
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button
                onClick={() => setShowGradesModal(false)}
                className="w-full bg-gradient-to-r from-royal to-gold text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-heading font-bold text-foreground">My Attendance</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(currentCalendarDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentCalendarDate(newDate);
                    }}
                  >
                    ←
                  </Button>
                  <span className="text-lg font-medium min-w-[150px] text-center">
                    {currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(currentCalendarDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentCalendarDate(newDate);
                    }}
                  >
                    →
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAttendanceModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/30">
              <h4 className="font-semibold mb-3 text-foreground">Attendance Legend:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-foreground">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-foreground">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-400"></div>
                  <span className="text-foreground ml-2">Not Updated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-foreground">Holiday</span>
                </div>
              </div>
            </div>

            {/* Monthly Calendar */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <h4 className="font-semibold mb-4 text-foreground">Monthly Attendance Calendar</h4>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: 35 }, (_, index) => {
                    const today = new Date();
                    const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - firstDay.getDay());
                    
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + index);
                    
                    const isCurrentMonth = currentDate.getMonth() === currentCalendarDate.getMonth();
                    const isToday = currentDate.toDateString() === today.toDateString();
                    const isSunday = currentDate.getDay() === 0;
                    // Fix timezone issue - use local date string instead of ISO
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    
                    // Get student's attendance for this date
                    const studentAttendance = studentData ? getStudentAttendanceForDate(dateStr) : null;
                    
                    return (
                      <div
                        key={index}
                        className={`relative h-12 border border-border/30 rounded-lg flex items-center justify-center text-sm ${
                          !isCurrentMonth ? 'text-muted-foreground/50 bg-muted/10' : 'bg-card'
                        } ${isToday ? 'ring-2 ring-gold' : ''}`}
                      >
                        <span className={`absolute top-1 left-1 text-xs ${
                          !isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground'
                        }`}>
                          {currentDate.getDate()}
                        </span>
                        
                        {/* Attendance Indicator */}
                        {isCurrentMonth && (
                          <div className="flex items-center justify-center">
                            {isSunday || customHolidays.includes(dateStr) ? (
                              <div className="w-6 h-6 bg-blue-500 rounded" title={isSunday ? "Sunday - Holiday" : "Holiday"}></div>
                            ) : studentAttendance ? (
                              studentAttendance.status === 'present' ? (
                                <div className="w-6 h-6 bg-green-500 rounded" title="Present"></div>
                              ) : studentAttendance.status === 'absent' ? (
                                <div className="w-6 h-6 bg-red-500 rounded-full" title="Absent"></div>
                              ) : (
                                <div className="w-6 h-6 bg-yellow-500 rounded" title="Late"></div>
                              )
                            ) : (
                              <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-gray-400" title="Not Updated"></div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendance Statistics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">
                  {studentData ? calculateAttendanceStats().present : 0}
                </div>
                <div className="text-sm text-green-400">Present Days</div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">
                  {studentData ? calculateAttendanceStats().absent : 0}
                </div>
                <div className="text-sm text-red-400">Absent Days</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">
                  {studentData ? calculateAttendanceStats().holidays : 0}
                </div>
                <div className="text-sm text-blue-400">Holidays</div>
              </div>
              <div className="bg-gold/10 rounded-lg p-4 text-center border border-gold/30">
                <div className="text-2xl font-bold text-gold">
                  {studentData ? calculateAttendanceStats().percentage : 0}%
                </div>
                <div className="text-sm text-gold">Attendance Rate</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button
                onClick={() => setShowAttendanceModal(false)}
                className="w-full bg-gradient-to-r from-royal to-gold text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assignments Modal */}
      {showAssignmentsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                My Assignments & Homework
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAssignments}
                  className="text-xs"
                >
                  🔄 Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAssignmentsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((assignment) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/20 rounded-lg p-6 border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {assignment.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {assignment.subject}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Assigned: {new Date(assignment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          new Date(assignment.dueDate) < new Date() 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : new Date(assignment.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            : 'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {new Date(assignment.dueDate) < new Date() 
                            ? 'Overdue'
                            : new Date(assignment.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
                            ? 'Due Soon'
                            : 'Active'
                          }
                        </div>
                      </div>

                      {/* Assignment Description */}
                      <div className="mb-4">
                        <p className="text-foreground leading-relaxed">
                          {assignment.description}
                        </p>
                      </div>

                      {/* Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-foreground mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            Attachments ({assignment.attachments.length})
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {assignment.attachments.map((attachment: string, index: number) => (
                              <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={() => {
                                  setSelectedImage({
                                    src: attachment,
                                    title: `${assignment.title} - Attachment ${index + 1}`
                                  });
                                  setShowImageModal(true);
                                }}
                              >
                                <img
                                  src={attachment}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-border/30 group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 rounded-full p-2">
                                      <FileText className="h-4 w-4 text-gray-800" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assignment Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="text-sm text-muted-foreground">
                          Created by: {assignment.createdBy}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Mark as Complete
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs bg-gradient-to-r from-gold to-yellow-500 text-black"
                          >
                            Submit Work
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Assignments Yet</h4>
                <p className="text-muted-foreground">
                  Your teachers haven't assigned any homework or assignments yet.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button
                onClick={() => setShowAssignmentsModal(false)}
                className="w-full bg-gradient-to-r from-royal to-gold text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                My Remarks from Teachers
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Force refresh by clearing cache and reloading
                    setStudentRemarks([]);
                    setTimeout(() => {
                      loadStudentRemarks();
                    }, 100);
                  }}
                  className="text-xs"
                >
                  🔄 Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRemarksModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {studentRemarks.length > 0 ? (
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">
                      {studentRemarks.filter(r => r.type === 'good').length}
                    </div>
                    <div className="text-sm text-green-400">Good Remarks</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">
                      {studentRemarks.filter(r => r.type === 'bad').length}
                    </div>
                    <div className="text-sm text-red-400">Areas to Improve</div>
                  </div>
                </div>

                {/* Remarks List */}
                {studentRemarks
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((remark, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg p-4 border ${
                        remark.type === 'good' 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {remark.type === 'good' ? (
                            <Star className="h-5 w-5 text-green-400 fill-green-400" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-red-400 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                          )}
                          <span className={`font-medium ${
                            remark.type === 'good' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {remark.type === 'good' ? 'Good Remark' : 'Area to Improve'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(remark.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className={`mb-2 ${
                        remark.type === 'good' ? 'text-green-100' : 'text-red-100'
                      }`}>
                        {remark.message}
                      </p>
                      
                      {/* Multiple Images Display */}
                      {((remark.images && remark.images.length > 0) || remark.image) && (
                        <div className="mb-2">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {/* Handle both new images array and old single image for backward compatibility */}
                            {(remark.images && remark.images.length > 0 ? remark.images : (remark.image ? [remark.image] : [])).map((image: string, imgIndex: number) => (
                              <div key={imgIndex} className="relative">
                                <img
                                  src={image}
                                  alt={`Remark attachment ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => {
                                    setSelectedImage({
                                      src: image,
                                      title: `Remark Image ${imgIndex + 1} - ${remark.subject || 'General'}`
                                    });
                                    setShowImageModal(true);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          {(remark.images?.length > 0 || remark.image) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {remark.images && remark.images.length > 0 ? remark.images.length : (remark.image ? 1 : 0)} image{((remark.images && remark.images.length > 0 ? remark.images.length : (remark.image ? 1 : 0)) > 1) ? 's' : ''} from teacher
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Subject: {remark.subject}</span>
                        <span>From Teacher</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Remarks Yet</h4>
                <p className="text-muted-foreground">
                  Your teachers haven't given you any remarks yet. Keep up the good work!
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button
                onClick={() => setShowRemarksModal(false)}
                className="w-full bg-gradient-to-r from-royal to-gold text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Timetable Modal */}
      {showTimetableModal && studentData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-4 sm:p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto border border-border/50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-6 w-6 text-gold" />
                  Class Timetable - {studentData.class}{studentData.section}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Weekly schedule for your class</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTimetableModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {studentTimetable && studentTimetable.length > 0 ? (
              <div className="space-y-6">
                {studentTimetable.map((daySchedule, dayIndex) => (
                  <motion.div
                    key={daySchedule.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                    className="bg-gradient-to-br from-royal/5 via-gold/5 to-royal/5 rounded-lg p-4 border border-border/30 hover:border-gold/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gold" />
                        {daySchedule.day}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        {daySchedule.periods?.length || 0} periods
                      </span>
                    </div>
                    
                    {daySchedule.periods && daySchedule.periods.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {daySchedule.periods.map((period: any, periodIndex: number) => (
                          <motion.div
                            key={periodIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: dayIndex * 0.1 + periodIndex * 0.05 }}
                            className={`p-3 rounded-lg border transition-all ${
                              period.subject === "Break" || period.subject === "Lunch Break"
                                ? "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
                                : "bg-card border-border/30 hover:border-gold/50 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {period.time}
                              </span>
                              {period.room && (
                                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                                  {period.room}
                                </span>
                              )}
                            </div>
                            
                            <h5 className={`font-semibold mb-1 text-sm ${
                              period.subject === "Break" || period.subject === "Lunch Break"
                                ? "text-blue-400"
                                : "text-foreground"
                            }`}>
                              {period.subject}
                            </h5>
                            
                            {period.teacher && (
                              <p className="text-xs text-muted-foreground truncate" title={period.teacher}>
                                👨‍🏫 {period.teacher}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No periods scheduled for {daySchedule.day}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h4 className="text-lg font-semibold text-foreground mb-2">No Timetable Created Yet</h4>
                <p className="text-muted-foreground mb-2">
                  The Principal hasn't created a timetable for Class {studentData?.class}{studentData?.section} yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please contact your Principal to create the timetable in the Timetable Manager.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border/30 flex justify-center">
              <Button
                onClick={() => setShowTimetableModal(false)}
                className="bg-gradient-to-r from-royal to-gold text-white hover:opacity-90 transition-opacity"
              >
                <X className="h-4 w-4 mr-2" />
                Close Timetable
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fee Management Section */}
      {activeSection === "fees" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Fee Management
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("dashboard")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Fee Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      ₹{getMyFeeStatus().totalPaid}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      ₹{getMyFeeStatus().totalPending}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Pending</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {getMyFeeStatus().pendingFees.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending Months</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Requests */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Payment Requests</h4>
              {paymentRequests.length > 0 ? (
                <div className="space-y-3">
                  {paymentRequests
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((request) => (
                      <div key={request.id} className="bg-muted/20 rounded-lg p-4 border border-border/30">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-foreground">
                              Payment Request - ₹{request.amount}
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              From: {request.teacherName} • {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-2">
                            Months: {request.months.join(', ')}
                          </p>
                          {request.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                              Note: {request.notes}
                            </p>
                          )}
                        </div>
                        
                        {request.status === 'pending' && (
                          <Button
                            onClick={() => handlePayFees(request)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            size="sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay ₹{request.amount}
                          </Button>
                        )}
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment requests found</p>
                  <p className="text-sm text-muted-foreground">Your teacher will send payment requests when fees are due</p>
                </div>
              )}
            </div>

            {/* Fee History */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Fee History ({currentYear})</h4>
              {feeRecords.length > 0 ? (
                <div className="space-y-3">
                  {feeRecords
                    .sort((a, b) => {
                      const monthOrder = months.indexOf(a.month) - months.indexOf(b.month);
                      return monthOrder;
                    })
                    .map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{fee.month} {fee.year}</p>
                          <p className="text-sm text-muted-foreground">₹{fee.amount}</p>
                          {fee.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{fee.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            fee.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400'
                              : fee.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {fee.status.toUpperCase()}
                          </span>
                          {fee.paymentDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Paid: {new Date(fee.paymentDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No fee records found</p>
                  <p className="text-sm text-muted-foreground">Fee records will appear here when your teacher creates them</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Profile Section */}
      {activeSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile information and photo</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {studentProfile.photo ? (
                      <img
                        src={studentProfile.photo}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover border-4 border-gold"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                        <User className="h-16 w-16 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const base64 = await convertToBase64(file);
                            setStudentProfile({ ...studentProfile, photo: base64 as string });
                          }
                        };
                        input.click();
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    
                    {studentProfile.photo && (
                      <Button
                        variant="destructive"
                        onClick={() => setStudentProfile({ ...studentProfile, photo: "" })}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={studentProfile.name}
                    onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={studentProfile.phone}
                    onChange={(e) => setStudentProfile({ ...studentProfile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Interests</label>
                  <Input
                    value={studentProfile.interests}
                    onChange={(e) => setStudentProfile({ ...studentProfile, interests: e.target.value })}
                    placeholder="e.g., Sports, Music, Art, Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={studentProfile.bio}
                    onChange={(e) => setStudentProfile({ ...studentProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={() => {
                    if (studentData) {
                      localStorage.setItem(`student-profile-${studentData.email}`, JSON.stringify(studentProfile));
                      alert('Profile updated successfully!');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-royal to-gold text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPaymentRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Pay Fees Online
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentRequest(null);
                  setPaymentForm({ amount: '', paymentMethod: 'online', notes: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-foreground">₹{selectedPaymentRequest.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Months:</span>
                    <span className="font-medium text-foreground">{selectedPaymentRequest.months.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium text-foreground">{selectedPaymentRequest.teacherName}</span>
                  </div>
                </div>
                {selectedPaymentRequest.notes && (
                  <div className="mt-3 p-2 bg-muted/30 rounded text-sm">
                    <span className="text-muted-foreground">Note: </span>
                    <span className="text-foreground">{selectedPaymentRequest.notes}</span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'razorpay', name: 'Razorpay', icon: '💳', color: 'from-blue-500 to-blue-600' },
                    { id: 'paypal', name: 'PayPal', icon: '🅿️', color: 'from-blue-600 to-blue-700' },
                    { id: 'upi', name: 'UPI', icon: '📱', color: 'from-green-500 to-green-600' },
                    { id: 'card', name: 'Card', icon: '💳', color: 'from-purple-500 to-purple-600' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: method.id })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentForm.paymentMethod === method.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border/30 hover:border-border'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-white text-sm">{method.icon}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Confirmation */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount to Pay (₹)</label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  disabled
                  className="bg-muted/20"
                />
              </div>

              {/* Payment Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Notes (Optional)</label>
                <Textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Add any notes for this payment..."
                  rows={3}
                />
              </div>

              {/* Payment Gateway Info */}
              {paymentForm.paymentMethod === 'razorpay' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">Razorpay Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Secure payment powered by Razorpay. Supports UPI, Cards, Net Banking, and Wallets.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentForm.paymentMethod === 'paypal' && (
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">PayPal Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Pay securely with your PayPal account or credit/debit card.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {(paymentForm.paymentMethod === 'upi' || paymentForm.paymentMethod === 'card') && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment is secured with bank-level encryption.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentRequest(null);
                    setPaymentForm({ amount: '', paymentMethod: 'online', notes: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={processPayment}
                  className={`flex-1 text-white ${
                    paymentForm.paymentMethod === 'razorpay' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    paymentForm.paymentMethod === 'paypal' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay with {paymentForm.paymentMethod === 'razorpay' ? 'Razorpay' : 
                           paymentForm.paymentMethod === 'paypal' ? 'PayPal' : 
                           paymentForm.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Document Viewer for Reports */}
      {showImageModal && selectedImage && (
        <DocumentViewer
          documentUrl={selectedImage.src}
          documentName={selectedImage.title}
          onClose={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        />
      )}

      {/* Principal Remarks Modal */}
      {showPrincipalRemarksModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                Principal Remarks
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrincipalRemarksModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {principalRemarks.length > 0 ? (
              <div className="space-y-4">
                {principalRemarks
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((remark) => (
                    <motion.div
                      key={remark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        remark.type === 'good' 
                          ? 'bg-green-500/10 border-green-500 border-l-green-500' 
                          : 'bg-red-500/10 border-red-500 border-l-red-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${
                            remark.type === 'good' ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <Star className="h-3 w-3 text-white" />
                          </div>
                          <h4 className="font-semibold text-foreground">{remark.subject}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            remark.type === 'good' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {remark.type === 'good' ? 'Good' : 'Needs Improvement'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(remark.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {remark.message}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">From:</span> Principal
                      </div>
                    </motion.div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Principal Remarks</h4>
                <p className="text-muted-foreground">
                  You haven't received any remarks from the principal yet.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Live Class Viewer Modal */}
      {showLiveClassViewer && studentData && (
        <div className="fixed inset-0 z-[100]">
          <LiveClassViewer
            studentClass={studentData.class}
            studentSection={studentData.section}
            studentName={studentData.fullName}
            studentId={studentData.id}
            onClose={() => setShowLiveClassViewer(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
