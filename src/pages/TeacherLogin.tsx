import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TeacherLogin = () => {
  const [username, setUsername] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const isAuth = localStorage.getItem("teacherAuth");
    if (isAuth === "true") {
      navigate("/teacher-dashboard", { replace: true });
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // LocalStorage auth: expect principal-provisioned teacher records
    try {
      const auth = JSON.parse(localStorage.getItem('royal-academy-auth-teachers') || '[]');
      const unameKey = (username || '').trim().toLowerCase();
      const idKey = (teacherId || '').trim().toLowerCase();
      const found = (auth || []).find((t: any) => {
        const tName = ((t.username || t.name || '') + '').trim().toLowerCase();
        const tId = ((t.teacherId || t.id || '') + '').trim().toLowerCase();
        return tName === unameKey && tId === idKey;
      });

      if (found) {
        if (found.status && found.status === 'banned') {
          setError('Your account has been banned. Please contact the principal.');
          setIsLoading(false);
          return;
        }
        // Store authentication in localStorage
        localStorage.setItem("teacherAuth", "true");
        localStorage.setItem("teacherEmail", found.email || "");
        localStorage.setItem("teacherName", found.username || found.name || "Teacher");
        localStorage.setItem("teacherSubject", found.subject || "");
        navigate("/teacher-dashboard");
        setIsLoading(false);
        return;
      }
    } catch {}

    setError("Invalid username or teacher ID. Please try again.");
    setIsLoading(false);
  };


  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal via-royal/90 to-gold/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center mx-auto mb-4"
            >
              <Users className="h-10 w-10 text-black" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Teacher Portal
            </h1>
            <p className="text-muted-foreground">
              Access your teaching dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Teacher Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Teacher ID
              </label>
              <Input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Enter your teacher ID"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/80 hover:to-yellow-500/80 text-black font-semibold py-3"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact{" "}
              <a href="mailto:admin@royalacademy.edu" className="text-gold hover:text-gold/80 transition-colors">
                admin@royalacademy.edu
              </a>
            </p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Royal Academy Teacher Portal • Secure Access
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherLogin;
