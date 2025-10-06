import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Volume2, Play, Pause, ArrowLeft, Trash2, Users, Calendar, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

interface AudioMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'principal';
  subject: string;
  description: string;
  audioUrl: string;
  audioBlob?: string;
  recipientType: 'class' | 'section' | 'individual_student' | 'individual_teacher' | 'all_teachers' | 'all_students' | 'whole_school';
  recipientClass?: string;
  recipientSection?: string;
  recipientId?: string;
  recipientName?: string;
  createdAt: string;
  duration?: number;
}

interface PrincipalAudioMessagesProps {
  userEmail: string;
  userType: 'teacher' | 'student';
  userClass?: string;
  userSection?: string;
  userId?: string;
}

const PrincipalAudioMessages = ({ userEmail, userType, userClass, userSection, userId }: PrincipalAudioMessagesProps) => {
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1); // State for volume
  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();

    // Subscribe to real-time changes for cross-port synchronization
    const unsubscribe = subscribeToSupabaseChanges<AudioMessage[]>(
      'royal-academy-audio-messages',
      (newData) => {
        console.log('[PrincipalAudioMessages] Received realtime update, syncing across ports');
        console.log('[PrincipalAudioMessages] New data:', newData);
        filterMessagesForUser(newData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userEmail, userType, userClass, userSection, userId]);

  const loadMessages = async () => {
    try {
      console.log('[PrincipalAudioMessages] Loading messages for:', { userEmail, userType, userClass, userSection, userId });
      const allMessages = await getSupabaseData<AudioMessage[]>('royal-academy-audio-messages', []);
      console.log('[PrincipalAudioMessages] All messages loaded:', allMessages);
      filterMessagesForUser(allMessages);
    } catch (error) {
      console.error('[PrincipalAudioMessages] Error loading messages:', error);
    }
  };

  const filterMessagesForUser = (allMessages: AudioMessage[]) => {
    // Get additional user info for better matching
    const teacherEmail = userType === 'teacher' ? userEmail : '';
    const teacherName = userType === 'teacher' ? localStorage.getItem('teacherName') || '' : '';
    const studentId = userType === 'student' ? userId : '';
    const studentName = userType === 'student' ? (JSON.parse(localStorage.getItem('currentStudent') || '{}').name || '') : '';

    console.log('[PrincipalAudioMessages] Filtering messages. User info:', { 
      userEmail, 
      userType, 
      userClass, 
      userSection, 
      userId,
      teacherName,
      studentName,
      totalMessages: allMessages.length 
    });

    const filtered = allMessages.filter(message => {
      // Whole school messages
      if (message.recipientType === 'whole_school') {
        console.log('[PrincipalAudioMessages] Whole school message matched:', message.id);
        return true;
      }

      // All teachers
      if (message.recipientType === 'all_teachers' && userType === 'teacher') {
        console.log('[PrincipalAudioMessages] All teachers message matched:', message.id);
        return true;
      }

      // All students
      if (message.recipientType === 'all_students' && userType === 'student') {
        console.log('[PrincipalAudioMessages] All students message matched:', message.id);
        return true;
      }

      // Specific class (for students)
      if (message.recipientType === 'class' && userType === 'student' && message.recipientClass === userClass) {
        console.log('[PrincipalAudioMessages] Class message matched:', message.id);
        return true;
      }

      // Specific section (for students)
      if (message.recipientType === 'section' && userType === 'student' && 
          message.recipientClass === userClass && message.recipientSection === userSection) {
        console.log('[PrincipalAudioMessages] Section message matched:', message.id);
        return true;
      }

      // Individual teacher - check all possible matching fields
      if (message.recipientType === 'individual_teacher' && userType === 'teacher') {
        const isMatch = message.recipientId === userEmail || 
                       message.recipientId === userId ||
                       message.recipientName === teacherEmail ||
                       message.recipientName === teacherName;
        if (isMatch) {
          console.log('[PrincipalAudioMessages] Individual teacher message matched:', message.id);
          return true;
        }
      }

      // Individual student - check all possible matching fields
      if (message.recipientType === 'individual_student' && userType === 'student') {
        const isMatch = message.recipientId === userId || 
                       message.recipientId === userEmail ||
                       message.recipientId === studentId ||
                       message.recipientName === studentName;
        if (isMatch) {
          console.log('[PrincipalAudioMessages] Individual student message matched:', message.id);
          return true;
        }
      }

      return false;
    });

    console.log('[PrincipalAudioMessages] Filtered messages:', filtered.length, 'out of', allMessages.length);
    setMessages(filtered);
  };

  const togglePlayPause = (messageId: string, audioSrc: string) => {
    if (playingMessageId === messageId) {
      audioPlayerRef.current?.pause();
      setPlayingMessageId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioSrc;
        audioPlayerRef.current.playbackRate = playbackSpeed;
        audioPlayerRef.current.volume = volume; // Set volume when playing
        audioPlayerRef.current.play();
        setPlayingMessageId(messageId);
      }
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = newVolume;
    }
  };

  const getRecipientDisplay = (message: AudioMessage) => {
    switch (message.recipientType) {
      case 'whole_school':
        return 'Whole School';
      case 'all_teachers':
        return 'All Teachers';
      case 'all_students':
        return 'All Students';
      case 'class':
        return `Class ${message.recipientClass}`;
      case 'section':
        return `Class ${message.recipientClass} Section ${message.recipientSection}`;
      case 'individual_student':
        return userType === 'student' ? 'You (Personal)' : `Student: ${message.recipientName}`;
      case 'individual_teacher':
        return userType === 'teacher' ? 'You (Personal)' : `Teacher: ${message.recipientName}`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <audio ref={audioPlayerRef} onEnded={() => setPlayingMessageId(null)} className="hidden" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(userType === 'teacher' ? '/teacher-dashboard' : '/student-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Volume2 className="h-6 w-6 text-gold" />
                  Principal Audio Messages
                </h1>
                <p className="text-sm text-muted-foreground">Listen to messages from the Principal</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container-wide py-8 px-6">
        {/* Playback Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border/50 mb-6 justify-between">
          {/* Playback Speed Control */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Playback Speed:</span>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
              <Button
                key={speed}
                size="sm"
                variant={playbackSpeed === speed ? "default" : "outline"}
                onClick={() => changePlaybackSpeed(speed)}
              >
                {speed}x
              </Button>
            ))}
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
          </div>
        </div>


        {/* Messages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Volume2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Audio Messages</h3>
              <p className="text-muted-foreground">
                You don't have any audio messages from the Principal yet.
              </p>
            </div>
          ) : (
            messages
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border rounded-xl bg-card hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{message.subject}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{message.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gold mb-2">
                        <Users className="h-4 w-4" />
                        {getRecipientDisplay(message)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => togglePlayPause(message.id, message.audioBlob || message.audioUrl)}
                      className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black"
                    >
                      {playingMessageId === message.id ? (
                        <><Pause className="h-4 w-4 mr-2" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" /> Play</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrincipalAudioMessages;